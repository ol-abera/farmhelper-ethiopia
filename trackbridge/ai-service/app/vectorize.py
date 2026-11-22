from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from .textutil import normalize


def tfidf_rank(query: str, documents: list[str]) -> list[float]:
    if not documents:
        return []
    corpus = [normalize(query)] + [normalize(d) for d in documents]
    vec = TfidfVectorizer(min_df=1, ngram_range=(1, 2))
    try:
        matrix = vec.fit_transform(corpus)
    except ValueError:
        return [0.0] * len(documents)
    sims = cosine_similarity(matrix[0:1], matrix[1:]).flatten()
    return [float(np.clip(s, 0, 1)) for s in sims]
