import { prisma } from '../../db/prisma.js';
import { aiPost } from './aiClient.js';
import { answerFaq } from '../../ai/chatbot.js';

export async function askFaq(userId: string, question: string) {
  const faqs = await prisma.faqEntry.findMany({ where: { approved: true } });
  const remote = await aiPost<{
    answer: string;
    matched: { id: string; question: string; score: number } | null;
    fallback: boolean;
  }>('/faq', {
    question,
    faqs: faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer, tags: f.tags })),
  });
  const result = remote ?? answerFaq(question, faqs);
  await prisma.chatbotLog.create({
    data: {
      userId,
      query: question.slice(0, 500),
      matchedId: result.matched?.id,
      score: result.matched?.score,
      fallback: result.fallback,
    },
  });
  return {
    ...result,
    advisory:
      'Answers come from the published FAQ corpus only. I cannot grade, approve submissions, or decide placements.',
  };
}
