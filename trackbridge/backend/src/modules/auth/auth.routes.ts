import { Router } from 'express';
import { loginLimiter, resetLimiter } from '../../middleware/rateLimit.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { forgotSchema, loginSchema, registerSchema, resetSchema } from './auth.schema.js';
import * as c from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', validate({ body: registerSchema }), asyncHandler(c.register));
authRouter.post('/login', loginLimiter, validate({ body: loginSchema }), asyncHandler(c.login));
authRouter.post('/refresh', asyncHandler(c.refresh));
authRouter.post('/logout', asyncHandler(c.logout));
authRouter.get('/me', authenticate, asyncHandler(c.me));
authRouter.post('/forgot-password', resetLimiter, validate({ body: forgotSchema }), asyncHandler(c.forgot));
authRouter.post('/reset-password', resetLimiter, validate({ body: resetSchema }), asyncHandler(c.reset));
