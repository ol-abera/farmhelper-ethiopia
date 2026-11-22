from fastapi import FastAPI
from pydantic import BaseModel, Field
from .matching import rank_pairs
from .recommend import combine
from .summarization import textrank
from .title_similarity import similar_titles
from .faq import answer

app = FastAPI(title="TrackBridge AI", version="1.0.0")


class Item(BaseModel):
    id: str
    text: str
    label: str | None = None
    extra: dict | None = None


class RankBody(BaseModel):
    query: str
    items: list[Item]


class RecommendItem(BaseModel):
    id: str
    text: str
    label: str | None = None
    openTo: str | None = None
    remainingQuota: int | None = None


class RecommendBody(BaseModel):
    query: str
    items: list[RecommendItem]


class TitleBody(BaseModel):
    title: str
    corpus: list[dict] = Field(default_factory=list)


class FaqItem(BaseModel):
    id: str
    question: str
    answer: str
    tags: str | None = None


class FaqBody(BaseModel):
    question: str
    faqs: list[FaqItem]
    minScore: float | None = None


class SumBody(BaseModel):
    text: str
    sentenceCount: int = 4


@app.get("/health")
def health():
    return {"ok": True, "service": "trackbridge-ai"}


@app.post("/match")
def match(body: RankBody):
    ranked = rank_pairs(body.query, [i.model_dump() for i in body.items])
    return {"items": ranked, "advisory": True}


@app.post("/recommend")
def recommend(body: RecommendBody):
    ranked = rank_pairs(body.query, [i.model_dump() for i in body.items])
    out = []
    by_id = {i.id: i for i in body.items}
    for row in ranked:
        src = by_id[row["id"]]
        combo = combine(row["score"], src.openTo, src.remainingQuota)
        out.append({**row, **combo, "reasons": [combo["reason"], f"Skill/interest overlap {round(row['score']*100)}%"]})
    out.sort(key=lambda x: x["combinedScore"], reverse=True)
    return {"items": out, "advisory": True}


@app.post("/summarize")
def summarize(body: SumBody):
    return textrank(body.text, body.sentenceCount)


@app.post("/title-similarity")
def titles(body: TitleBody):
    return {"items": similar_titles(body.title, body.corpus), "advisory": True, "notPlagiarismVerdict": True}


@app.post("/faq")
def faq(body: FaqBody):
    data = [f.model_dump() for f in body.faqs]
    return answer(body.question, data, body.minScore or 0.18)
