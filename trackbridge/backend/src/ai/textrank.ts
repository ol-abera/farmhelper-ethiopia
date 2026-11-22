import { cosine, termFreq, tokenize } from './tfidf.js';

export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);
}

/** Extractive TextRank: sentence graph + PageRank, return top sentences in original order. */
export function textRankSummary(text: string, sentenceCount = 4): string {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return text.trim().slice(0, 600);
  if (sentences.length <= sentenceCount) return sentences.join(' ');

  const tfs = sentences.map((s) => termFreq(tokenize(s)));
  const n = sentences.length;
  const sim: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const s = cosine(tfs[i], tfs[j]);
      sim[i][j] = s;
      sim[j][i] = s;
    }
  }
  for (let i = 0; i < n; i++) {
    const sum = sim[i].reduce((a, b) => a + b, 0) || 1;
    for (let j = 0; j < n; j++) sim[i][j] /= sum;
  }

  const d = 0.85;
  let scores = Array(n).fill(1 / n);
  for (let iter = 0; iter < 40; iter++) {
    const next = Array(n).fill((1 - d) / n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        next[i] += d * sim[j][i] * scores[j];
      }
    }
    scores = next;
  }

  const top = scores
    .map((score, i) => ({ i, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .sort((a, b) => a.i - b.i)
    .map((x) => sentences[x.i]);

  return top.join(' ');
}
