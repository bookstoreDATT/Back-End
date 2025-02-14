import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors.config';
import errorHandler from './middlewares/errorHandlerMiddleware';
import notFoundHandler from './middlewares/notFoundHandlerMiddleware';
import router from './routes';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from './config/cloudinary.config';
const app: Express = express();

// firebase app
cloudinary.config(cloudinaryConfig);
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.use(cookieParser());

// webhook
app.use(
    express.json({
        limit: '5mb',
    }),
);
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1', router);
//error middleware
app.use(notFoundHandler);
app.use(errorHandler);

console.log([].join(','));
export default app;
