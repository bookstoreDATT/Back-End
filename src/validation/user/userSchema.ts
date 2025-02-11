import { ROLE } from '@/constants/allowedRoles';
import Joi from 'joi';

export const registerValidation = Joi.object({
    userName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid(ROLE.USER, ROLE.ADMIN).default(ROLE.USER),
});
