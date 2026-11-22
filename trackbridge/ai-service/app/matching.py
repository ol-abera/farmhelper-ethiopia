from .vectorize import tfidf_rank


def rank_pairs(query_text: str, items: list[dict]) -> list[dict]:
    docs = [i.get("text") or "" for i in items]
    scores = tfidf_rank(query_text, docs)
    ranked = []
    for item, score in zip(items, scores):
        ranked.append({**item, "score": round(float(score), 4)})
    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked
