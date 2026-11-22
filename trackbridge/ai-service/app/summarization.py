import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .textutil import split_sentences
from .config import SUMMARIZE_MIN_CHARS


def textrank(text: str, sentence_count: int = 4) -> dict:
    raw = (text or "").strip()
    if len(raw) < SUMMARIZE_MIN_CHARS:
        return {
            "summary": "",
            "algorithm": "textrank",
            "insufficient": True,
            "message": "Insufficient text for a TextRank draft. Write or paste a longer report.",
        }
    sentences = split_sentences(raw)
    if len(sentences) <= sentence_count:
        return {"summary": " ".join(sentences) or raw[:600], "algorithm": "textrank", "insufficient": False}
    vec = TfidfVectorizer(min_df=1)
    try:
        m = vec.fit_transform(sentences)
    except ValueError:
        return {"summary": " ".join(sentences[:sentence_count]), "algorithm": "textrank", "insufficient": False}
    sim = cosine_similarity(m)
    np.fill_diagonal(sim, 0)
    row_sum = sim.sum(axis=1, keepdims=True)
    row_sum[row_sum == 0] = 1
    sim = sim / row_sum
    n = sim.shape[0]
    d = 0.85
    scores = np.full(n, 1.0 / n)
    teleport = np.full(n, (1 - d) / n)
    for _ in range(40):
        scores = teleport + d * sim.T.dot(scores)
    top_idx = sorted(list(np.argsort(scores)[-sentence_count:]))
    summary = " ".join(sentences[i] for i in top_idx)
    return {"summary": summary, "algorithm": "textrank", "insufficient": False}
