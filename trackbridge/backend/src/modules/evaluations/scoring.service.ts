export type WeightSet = { advisor: number; host: number; project: number };

export function assertWeights(w: WeightSet) {
  const sum = w.advisor + w.host + w.project;
  if (Math.abs(sum - 100) > 0.01) {
    throw new Error(`Weights must sum to 100 (got ${sum})`);
  }
}

export function formTotal(scores: Record<string, number>, criteria: { name: string; maxPoints: number }[]) {
  let earned = 0;
  let max = 0;
  for (const c of criteria) {
    max += c.maxPoints;
    const v = scores[c.name];
    if (typeof v === 'number') earned += Math.min(c.maxPoints, Math.max(0, v));
  }
  if (max === 0) return 0;
  return Number(((earned / max) * 100).toFixed(2));
}

export function weightedFinal(
  components: { advisor: number | null; host: number | null; project: number | null },
  weights: WeightSet,
): { weightedFinal: number | null; incomplete: boolean } {
  assertWeights(weights);
  const missing =
    components.advisor == null || components.host == null || components.project == null;
  if (missing) {
    return { weightedFinal: null, incomplete: true };
  }
  const total =
    (components.advisor! * weights.advisor +
      components.host! * weights.host +
      components.project! * weights.project) /
    100;
  return { weightedFinal: Number(total.toFixed(2)), incomplete: false };
}
