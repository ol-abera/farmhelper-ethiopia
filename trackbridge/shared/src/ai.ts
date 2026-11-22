export type MatchHit = {
  id: string;
  label: string;
  score: number;
  reasons: string[];
};

export type Recommendation = MatchHit & {
  urgencyBoost: number;
  combinedScore: number;
};

export type WarningFlag = {
  studentId: string;
  studentName: string;
  studentNumber: string | null;
  reasons: string[];
  types: string[];
};

export type TitleSimilarityHit = {
  projectId?: string;
  title: string;
  creatorName?: string;
  score: number;
  advisory: string;
};

export type SummaryDraft = {
  summary: string;
  algorithm: 'textrank';
  insufficient: boolean;
};

export type FaqReply = {
  answer: string;
  matched: { id: string; question: string; score: number } | null;
  fallback: boolean;
};
