from app.recommend import combine
from datetime import datetime, timezone, timedelta

def test_urgency_boosts_near_deadline():
    soon = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    far = (datetime.now(timezone.utc) + timedelta(days=40)).isoformat()
    a = combine(0.5, soon, 1)
    b = combine(0.5, far, 8)
    assert a["combinedScore"] > b["combinedScore"]
