from app.summarization import textrank

def test_short_text_insufficient():
    r = textrank("Too short.")
    assert r["insufficient"] is True

def test_long_text():
    text = " ".join([f"Community members described sanitation problem number {i} in the kebele." for i in range(12)])
    r = textrank(text, 3)
    assert r["insufficient"] is False
    assert len(r["summary"]) > 20
