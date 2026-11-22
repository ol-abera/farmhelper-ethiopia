import re

_WS = re.compile(r"\s+")


def normalize(text: str) -> str:
    t = (text or "").strip().lower()
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    return _WS.sub(" ", t).strip()


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", (text or "").replace("\n", " ").strip())
    return [p.strip() for p in parts if len(p.strip()) > 25]
