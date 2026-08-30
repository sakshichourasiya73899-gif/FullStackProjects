// import WeatherReport from '../models/WeatherReport.js';

// const jaccardSimilarity = (text1, text2) => {
//   const words1 = new Set(text1.toLowerCase().split(/\s+/));
//   const words2 = new Set(text2.toLowerCase().split(/\s+/));
//   const intersection = new Set([...words1].filter(w => words2.has(w)));
//   const union = new Set([...words1, ...words2]);
//   return intersection.size / union.size;
// };

// export const checkDuplicate = async (report) => {
//   const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

//   const recentReports = await WeatherReport.find({
//     sourceType: report.sourceType,
//     createdAt: { $gte: oneHourAgo },
//     _id: { $ne: report._id }
//   }).limit(20);

//   for (const existing of recentReports) {
//     const similarity = jaccardSimilarity(report.text, existing.text);
//     if (similarity > 0.7) {
//       return {
//         isDuplicate: true,
//         similarityScore: Math.round(similarity * 100),
//         originalReportId: existing._id
//       };
//     }
//   }

//   return { isDuplicate: false, similarityScore: 0, originalReportId: null };
// };



import WeatherReport from '../models/WeatherReport.js';

const cosineSimilarity = (vecA, vecB) => {
  if (!vecA?.length || !vecB?.length || vecA.length !== vecB.length) return 0;
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magA && magB ? dot / (magA * magB) : 0;
};

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
  }).select('text embedding').limit(30);

  for (const existing of recentReports) {
    let similarity = 0;

    // Embedding similarity agar dono ke paas hai
    if (report.embedding?.length > 0 && existing.embedding?.length > 0) {
      similarity = cosineSimilarity(report.embedding, existing.embedding);
      if (similarity > 0.92) {
        return {
          isDuplicate: true,
          similarityScore: Math.round(similarity * 100),
          originalReportId: existing._id,
          method: 'embedding'
        };
      }
    }

    // Fallback: Jaccard similarity
    similarity = jaccardSimilarity(report.text, existing.text);
    if (similarity > 0.7) {
      return {
        isDuplicate: true,
        similarityScore: Math.round(similarity * 100),
        originalReportId: existing._id,
        method: 'jaccard'
      };
    }
  }

  return { isDuplicate: false, similarityScore: 0, originalReportId: null };
};