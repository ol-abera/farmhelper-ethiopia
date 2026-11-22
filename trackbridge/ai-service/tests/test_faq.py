from app.faq import answer

def test_fallback_on_unknown():
    r = answer("quantum banana taxation", [{"id": "1", "question": "What is CBTP?", "answer": "Community training."}])
    assert r["fallback"] is True

def test_match():
    r = answer("what is cbtp", [{"id": "1", "question": "What is CBTP?", "answer": "Community-Based Training Program.", "tags": "cbtp"}])
    assert r["fallback"] is False
    assert "Community" in r["answer"]
