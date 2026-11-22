import { AT_RISK_DEFAULTS } from '@trackbridge/shared';
import { rankSimilar } from './tfidf.js';

export type Faq = { id: string; question: string; answer: string; tags?: string };

export function answerFaq(question: string, faqs: Faq[], minScore = AT_RISK_DEFAULTS.faqMinScore) {
  if (!question.trim()) {
    return {
      answer:
        'Please type a question about CBTP, internships, or technical projects. If you need a decision, contact your advisor or coordinator.',
      matched: null as null | { id: string; question: string; score: number },
      fallback: true,
    };
  }
  const docs = faqs.map((f) => ({
    id: f.id,
    text: `${f.question} ${f.answer} ${f.tags ?? ''}`,
  }));
  const ranked = rankSimilar(question, docs);
  const top = ranked[0];
  if (!top || top.score < minScore) {
    return {
      answer:
        'I could not find a close match in the approved FAQ knowledge base. Please contact your academic advisor or the CBTP/internship coordinator for this question. I cannot grade work, approve submissions, or decide placements.',
      matched: top ? { id: top.id, question: faqs.find((f) => f.id === top.id)?.question ?? '', score: top.score } : null,
      fallback: true,
    };
  }
  const faq = faqs.find((f) => f.id === top.id)!;
  return {
    answer: faq.answer,
    matched: { id: faq.id, question: faq.question, score: top.score },
    fallback: false,
  };
}
