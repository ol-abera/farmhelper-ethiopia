import { prisma } from '../../db/prisma.js';
import { aiPost } from './aiClient.js';
import { textRankSummary } from '../../ai/textrank.js';

export async function summarizeText(actorId: string, text: string, sourceType = 'freeform', sourceId = 'adhoc') {
  const remote = await aiPost<{ summary: string; insufficient?: boolean; algorithm?: string; message?: string }>(
    '/summarize',
    { text, sentenceCount: 4 },
  );
  let summary = remote?.summary;
  let insufficient = Boolean(remote?.insufficient);
  if (!remote) {
    if ((text || '').length < 200) {
      insufficient = true;
      summary = '';
    } else {
      summary = textRankSummary(text, 4);
    }
  }
  if (insufficient) {
    return {
      summary: '',
      algorithm: 'textrank' as const,
      insufficient: true,
      message: remote?.message || 'Insufficient text for a TextRank draft.',
    };
  }
  const saved = await prisma.aiSummary.create({
    data: { userId: actorId, sourceType, sourceId, summary: summary || '', algorithm: 'textrank' },
  });
  return { ...saved, insufficient: false, advisory: 'AI draft summary — review before relying on it.' };
}
