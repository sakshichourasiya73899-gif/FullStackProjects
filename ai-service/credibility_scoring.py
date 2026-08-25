SOURCE_BASE_SCORES = {
    "citizen": 60,
    "social_mock": 40,
    "news_rss": 80,
    "weather_api": 100,
}

def compute_credibility(source_type: str, has_media: bool, location_resolved: bool):
    reasons = []
    score = 0

    # Source type ka base score — weather_api sabse trustworthy, social_mock sabse kam
    source_score = SOURCE_BASE_SCORES.get(source_type, 50)
    score += source_score * 0.5
    reasons.append(f"Source '{source_type}' has base reliability {source_score}/100")

    # Photo/video hai toh zyada credible
    if has_media:
        score += 20
        reasons.append("Report includes photo/video evidence")
    else:
        reasons.append("No media evidence attached")

    # Location coordinates resolve hue toh zyada trustworthy
    if location_resolved:
        score += 20
        reasons.append("Location coordinates resolved and consistent")
    else:
        reasons.append("Location could not be resolved")

    score = max(0, min(100, round(score)))

    if score >= 80:
        level = "High"
    elif score >= 50:
        level = "Medium"
    else:
        level = "Low"

    return {
        "credibilityScore": score,
        "confidenceLevel": level,
        "reasons": reasons
    }