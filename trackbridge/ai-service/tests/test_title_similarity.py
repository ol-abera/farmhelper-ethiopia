from app.title_similarity import similar_titles

def test_similar_first():
    hits = similar_titles(
        "hospital appointment web system",
        [
            {"id": "1", "title": "Hospital patient appointment scheduling web system"},
            {"id": "2", "title": "Soil moisture sensor for teff farms"},
        ],
    )
    assert hits[0]["id"] == "1"
    assert "plagiarism" in hits[0]["advisory"].lower() or "overlap" in hits[0]["advisory"].lower()
