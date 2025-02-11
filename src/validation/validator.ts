import { BadRequestFormError } from '@/error/customError';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const validator = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((err) => ({
                message: err.message,
                field: err.path.join('.'),
            }));
            throw new BadRequestFormError('Đã có lỗi xảy ra!', errors);
        }

        req.body = value;
        next();
    };
};

export default validator;
