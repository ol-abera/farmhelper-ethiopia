const STOP = new Set(
  `a an the and or of to in for on with at from by as is are was were be been being this that these those it its their his her our you your we they i not no yes into over after before about than then so if but than can may must should would could will shall do does did done have has had having also such other more most some any all each both few many much very just only own same too very s t`.split(
    /\s+/,
  ),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t) && !/^\d+$/.test(t));
}

export function termFreq(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens) m.set(t, (m.get(t) || 0) + 1);
  const n = tokens.length || 1;
  for (const [k, v] of m) m.set(k, v / n);
  return m;
}

export function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const v of a.values()) na += v * v;
  for (const v of b.values()) nb += v * v;
  for (const [k, va] of a) {
    const vb = b.get(k);
    if (vb) dot += va * vb;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export type CorpusDoc = { id: string; text: string };

export function tfidfVectors(docs: CorpusDoc[]) {
  const tfs = docs.map((d) => ({ id: d.id, tf: termFreq(tokenize(d.text)), n: tokenize(d.text).length }));
  const df = new Map<string, number>();
  for (const { tf } of tfs) {
    for (const k of tf.keys()) df.set(k, (df.get(k) || 0) + 1);
  }
  const N = docs.length || 1;
  const vectors = tfs.map(({ id, tf }) => {
    const v = new Map<string, number>();
    for (const [term, freq] of tf) {
      const idf = Math.log((N + 1) / ((df.get(term) || 0) + 1)) + 1;
      v.set(term, freq * idf);
    }
    return { id, vector: v };
  });
  return { vectors, df, N };
}

export function queryVector(query: string, df: Map<string, number>, N: number) {
  const tf = termFreq(tokenize(query));
  const v = new Map<string, number>();
  for (const [term, freq] of tf) {
    const idf = Math.log((N + 1) / ((df.get(term) || 0) + 1)) + 1;
    v.set(term, freq * idf);
  }
  return v;
}

export function rankSimilar(query: string, docs: CorpusDoc[], minScore = 0) {
  if (!docs.length) return [];
  const { vectors, df, N } = tfidfVectors(docs);
  const q = queryVector(query, df, N);
  return vectors
    .map((d) => ({ id: d.id, score: Number(cosine(q, d.vector).toFixed(4)) }))
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score);
}

export function pairwiseSimilarity(a: string, b: string) {
  const docs = [
    { id: 'a', text: a },
    { id: 'b', text: b },
  ];
  const ranked = rankSimilar(a, [{ id: 'b', text: b }]);
  return ranked[0]?.score ?? 0;
}
