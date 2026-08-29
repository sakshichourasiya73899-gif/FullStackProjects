HIGH_WORDS = [
    "heavy", "severe", "extreme", "dangerous", "massive",
    "flooding", "uprooted", "submerged", "evacuated", "killed",
    "collapsed", "destroyed", "washed away", "breached",
    "red alert", "emergency", "catastrophic", "devastating"
]

MEDIUM_WORDS = [
    "moderate", "strong", "warning", "disrupted", "damaged",
    "alert", "affected", "concern", "rising", "increasing",
    "orange alert", "advisory", "stranded"
]

LOW_WORDS = [
    "light", "mild", "slight", "partly", "scattered",
    "intermittent", "drizzle", "clear", "normal", "pleasant"
]

EVENT_BASE_SEVERITY = {
    "flood": 3,
    "cyclone": 3,
    "wildfire": 3,
    "thunderstorm": 2,
    "dust_storm": 2,
    "strong_wind": 2,
    "heatwave": 2,
    "drought": 2,
    "cold_wave": 2,
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

    for word in LOW_WORDS:
        if word in text_lower:
            score = max(1, score - 1)
            break

    if score >= 4:
        return "high"
    elif score >= 2:
        return "medium"
    else:
        return "low"

def compute_severity_with_confidence(event_type: str, text: str):
    text_lower = text.lower()
    severity = compute_severity(event_type, text)

    high_matches = sum(1 for w in HIGH_WORDS if w in text_lower)
    medium_matches = sum(1 for w in MEDIUM_WORDS if w in text_lower)

    if high_matches >= 2:
        confidence = 0.90
    elif high_matches == 1:
        confidence = 0.80
    elif medium_matches >= 1:
        confidence = 0.65
    else:
        confidence = 0.50

    return {"severity": severity, "confidence": round(confidence, 2)}