export const computePriorityScore = ({
  severity,
  credibilityScore,
  surgeScore,
  reportCount,
  uniqueSourceCount,
  imageCount,
  videoCount,
  isEmerging
}) => {
  let score = 0;
  const reasons = [];

  const severityPoints = { high: 25, medium: 15, low: 5 };
  score += severityPoints[severity] || 5;
  reasons.push(`Severity: ${severity} (+${severityPoints[severity] || 5})`);

  const credPoints = Math.round((credibilityScore / 100) * 20);
  score += credPoints;
  reasons.push(`Credibility: ${credibilityScore}/100 (+${credPoints})`);

  if (isEmerging) {
    score += 20;
    reasons.push('Emerging event detected — rapid report surge (+20)');
  } else if (surgeScore > 50) {
    score += 10;
    reasons.push('Report velocity elevated (+10)');
  }

  if (reportCount >= 10) { score += 15; reasons.push(`${reportCount} reports (+15)`); }
  else if (reportCount >= 5) { score += 10; reasons.push(`${reportCount} reports (+10)`); }
  else if (reportCount >= 2) { score += 5; reasons.push(`${reportCount} reports (+5)`); }

  if (uniqueSourceCount >= 3) { score += 15; reasons.push(`${uniqueSourceCount} independent sources (+15)`); }
  else if (uniqueSourceCount === 2) { score += 8; reasons.push('2 sources (+8)'); }

  const mediaCount = (imageCount || 0) + (videoCount || 0);
  if (mediaCount > 0) {
    score += 5;
    reasons.push(`${imageCount} images, ${videoCount} videos (+5)`);
  }

  return { score: Math.min(100, score), reasons };
};