# TrackBridge AI service

Python FastAPI process implementing the official proposal methods:

- TF-IDF + cosine similarity (scikit-learn) for placement matching and title similarity
- Suitability + deadline urgency for recommendations
- Extractive TextRank for draft report summaries
- FAQ retrieval over an approved corpus

The Express API is the public gateway (`/api/v1/ai/*`). This service is internal.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
