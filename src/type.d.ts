import { Request } from 'express';
import 'express-session';
import { IOrderCreatePayload } from './interfaces/schema/order';

declare module 'express-serve-static-core' {
    interface Request {
        userId: string;
        role: string;
    }
}
declare module 'express-session' {
    interface SessionData {
        product: IOrderCreatePayload;
    }
}
