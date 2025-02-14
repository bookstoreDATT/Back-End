import 'dotenv/config';
import { z } from 'zod';

const envVarsSchema = z.object({
    PORT: z.coerce.number().default(80),
    HOSTNAME: z.string().default('127.0.0.1'),
    MONGODB_URL_DEV: z.string().describe('Local Mongo DB'),
    JWT_ACCESS_TOKEN_KEY: z.string().min(1, { message: 'JWT Access Token Key là bắt buộc' }),
    JWT_ACCESS_EXPIRATION: z.string().default('15m'),
});

const result = envVarsSchema.safeParse(process.env);
if (!result.success) {
    console.error('❌ Config validation error:', result.error.format());
    throw new Error('Config validation failed. Check environment variables.');
}
const envVars = result.data;
const config = {
    port: envVars.PORT,
    hostname: envVars.HOSTNAME,
    mongoose: {
        url: envVars.MONGODB_URL_DEV,
        options: {
            dbName: 'bookstore',
        },
    },
    jwt: {
        accessTokenKey: envVars.JWT_ACCESS_TOKEN_KEY,
        accessVerifyExpiration: envVars.JWT_ACCESS_EXPIRATION,
    },
};

export default config;
