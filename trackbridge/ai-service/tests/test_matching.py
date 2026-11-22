from app.matching import rank_pairs

def test_rank_order():
    items = [
        {"id": "a", "text": "hospital information systems helpdesk"},
        {"id": "b", "text": "microwave radio tower climbing"},
    ]
    ranked = rank_pairs("hospital helpdesk HIS", items)
    assert ranked[0]["id"] == "a"
    assert ranked[0]["score"] >= ranked[1]["score"]
