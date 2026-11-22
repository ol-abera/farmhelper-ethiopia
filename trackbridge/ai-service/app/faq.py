from .vectorize import tfidf_rank
from .config import FAQ_MIN_SCORE

FALLBACK = (
    "I could not find a close match in the approved FAQ knowledge base. "
    "Please contact your academic advisor or the CBTP/internship coordinator. "
    "I cannot grade work, approve submissions, or decide placements."
)


def answer(question: str, faqs: list[dict], min_score: float = FAQ_MIN_SCORE) -> dict:
    q = (question or "").strip()
    if not q:
        return {
            "answer": "Please type a question about CBTP, internships, or technical projects.",
            "matched": None,
            "fallback": True,
        }
    docs = [f"{f.get('question','')} {f.get('answer','')} {f.get('tags','')}" for f in faqs]
    scores = tfidf_rank(q, docs)
    if not scores:
        return {"answer": FALLBACK, "matched": None, "fallback": True}
    best_i = int(max(range(len(scores)), key=lambda i: scores[i]))
    best = scores[best_i]
    faq = faqs[best_i]
    matched = {"id": faq.get("id"), "question": faq.get("question"), "score": round(best, 4)}
    if best < min_score:
        return {"answer": FALLBACK, "matched": matched, "fallback": True}
    return {"answer": faq.get("answer"), "matched": matched, "fallback": False}
