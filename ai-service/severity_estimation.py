HIGH_WORDS = [
    "heavy", "severe", "extreme", "dangerous", "flooding",
    "uprooted", "submerged", "evacuated", "killed", "collapsed"
]
MEDIUM_WORDS = ["moderate", "strong", "warning", "disrupted", "damaged"]

EVENT_BASE_SEVERITY = {
   "flood": 3,
    "thunderstorm": 2,
    "dust_storm": 2,
    "strong_wind": 2,
    "heatwave": 2,
    "wildfire": 3,
    "fog": 1,
    "rainfall": 1,
    "other": 1,
}

def compute_severity(event_type: str, text: str):
    text_lower = text.lower()
    score = EVENT_BASE_SEVERITY.get(event_type, 1)

    for word in HIGH_WORDS:
        if word in text_lower:
            score += 2
            break

    for word in MEDIUM_WORDS:
        if word in text_lower:
            score += 1
            break

    if score >= 4:
        return "high"
    elif score >= 2:
        return "medium"
    else:
        return "low"