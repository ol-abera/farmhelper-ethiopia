from datetime import datetime, timezone


def urgency_boost(open_to: str | None, remaining_quota: int | None = None) -> tuple[float, str]:
    reasons = []
    boost = 0.0
    if open_to:
        try:
            dt = datetime.fromisoformat(open_to.replace("Z", "+00:00"))
            days = (dt - datetime.now(timezone.utc)).days
            if days < 0:
                reasons.append("Deadline has passed")
            elif days <= 3:
                boost += 0.18
                reasons.append(f"Deadline in {days} day(s) — high urgency")
            elif days <= 7:
                boost += 0.12
                reasons.append(f"Deadline in {days} days — rising urgency")
            elif days <= 14:
                boost += 0.06
                reasons.append(f"Deadline in {days} days")
            else:
                reasons.append(f"Deadline in {days} days")
        except ValueError:
            reasons.append("Deadline could not be parsed")
    else:
        reasons.append("No application deadline set")
    if remaining_quota is not None:
        if remaining_quota <= 1:
            boost += 0.08
            reasons.append(f"{remaining_quota} seat(s) left")
        else:
            reasons.append(f"{remaining_quota} seats remaining")
    return boost, "; ".join(reasons)


def combine(match_score: float, open_to: str | None, remaining_quota: int | None = None) -> dict:
    boost, reason = urgency_boost(open_to, remaining_quota)
    combined = min(1.0, match_score + boost)
    return {
        "matchScore": round(match_score, 4),
        "urgencyBoost": round(boost, 4),
        "combinedScore": round(combined, 4),
        "reason": reason,
    }
