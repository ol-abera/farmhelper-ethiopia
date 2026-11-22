import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { faqSchema, summarizeSchema, titleSchema } from './ai.schema.js';
import * as c from './ai.controller.js';

export const aiRouter = Router();
aiRouter.use(authenticate);
aiRouter.get('/match', asyncHandler(c.match));
aiRouter.post('/match', asyncHandler(c.match));
aiRouter.get('/recommend', asyncHandler(c.recommend));
aiRouter.get('/warnings', asyncHandler(c.warnings));
aiRouter.post('/summarize', validate({ body: summarizeSchema }), asyncHandler(c.summarize));
aiRouter.post('/title-similarity', validate({ body: titleSchema }), asyncHandler(c.titleSimilarity));
aiRouter.post('/faq', validate({ body: faqSchema }), asyncHandler(c.chatbot));
