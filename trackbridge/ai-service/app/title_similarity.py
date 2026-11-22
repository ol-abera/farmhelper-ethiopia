from .vectorize import tfidf_rank
from .config import TITLE_TOP_N
from .textutil import normalize


def similar_titles(title: str, corpus: list[dict], top_n: int = TITLE_TOP_N) -> list[dict]:
    docs = [c.get("title") or "" for c in corpus]
    scores = tfidf_rank(normalize(title), docs)
    ranked = []
    for item, score in zip(corpus, scores):
        s = float(score)
        if s >= 0.72:
            advisory = "High overlap — review before approving; this is not a plagiarism verdict."
        elif s >= 0.45:
            advisory = "Moderate overlap — consider whether the topics differ enough."
        else:
            advisory = "Low overlap."
        ranked.append({**item, "score": round(s, 4), "advisory": advisory})
    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked[:top_n]
