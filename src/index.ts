import app from './app';
import connectDB from './config/database.config';
import config from './config/env.config';
import { confirmWebhook } from './services/payos.service';

const PORT = config.port || 8080;
const HOSTNAME = config.hostname;

let server: any;
let ngrokListener: any;

connectDB().then(async () => {
    server = app.listen(PORT, `${HOSTNAME}`, async () => {
        const ngrok = await import('@ngrok/ngrok');
        ngrokListener = await ngrok.connect({ addr: PORT, authtoken_from_env: true });
        const ngrokUrl = ngrokListener.url();

        await confirmWebhook(`${ngrokUrl}/webhook`);

        console.log(`Listening to port ${PORT}`);
        console.log(`Ingress established at: ${ngrokUrl}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(async () => {
            if (ngrokListener) {
                await ngrokListener.kill();
            }
            console.log('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: string) => {
    console.log(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
        server.close();
    }
});
