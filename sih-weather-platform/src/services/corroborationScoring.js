const SOURCE_RELIABILITY = {
  weather_api: 100,
  news_rss: 80,
  citizen: 60,
  social_mock: 40
};

export const computeCorroboration = (sourceTypes, reportCount) => {
  let score = 0;
  const reasons = [];

  if (reportCount >= 5) {
    score += 40;
    reasons.push(`${reportCount} independent reports confirm this event`);
  } else if (reportCount >= 3) {
    score += 25;
    reasons.push(`${reportCount} reports confirm this event`);
  } else if (reportCount >= 2) {
    score += 15;
    reasons.push(`${reportCount} reports received`);
  } else {
    score += 5;
    reasons.push('Only 1 report so far — needs corroboration');
  }

  const uniqueSources = [...new Set(sourceTypes)];
  if (uniqueSources.length >= 3) {
    score += 40;
    reasons.push(`Confirmed by ${uniqueSources.length} source types: ${uniqueSources.join(', ')}`);
  } else if (uniqueSources.length === 2) {
    score += 25;
    reasons.push(`Confirmed by 2 source types: ${uniqueSources.join(', ')}`);
  } else {
    score += 10;
    reasons.push(`Only ${uniqueSources[0]} — cross-verification pending`);
  }

  if (sourceTypes.includes('weather_api')) {
    score += 20;
    reasons.push('Official weather API data supports this event');
  }

  const finalScore = Math.min(100, score);
  return {
    score: finalScore,
    level: finalScore >= 75 ? 'High' : finalScore >= 45 ? 'Medium' : 'Low',
    reasons
  };
};