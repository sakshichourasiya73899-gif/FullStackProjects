import WeatherReport from '../models/WeatherReport.js';

const jaccardSimilarity = (text1, text2) => {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
};

export const checkDuplicate = async (report) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentReports = await WeatherReport.find({
    sourceType: report.sourceType,
    createdAt: { $gte: oneHourAgo },
    _id: { $ne: report._id }
  }).limit(20);

  for (const existing of recentReports) {
    const similarity = jaccardSimilarity(report.text, existing.text);
    if (similarity > 0.7) {
      return {
        isDuplicate: true,
        similarityScore: Math.round(similarity * 100),
        originalReportId: existing._id
      };
    }
  }

  return { isDuplicate: false, similarityScore: 0, originalReportId: null };
};