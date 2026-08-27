import WeatherReport from '../models/WeatherReport.js';

export const checkVelocity = async (eventId) => {
  const now = new Date();
  const oneHourAgo = new Date(now - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000);

  const recentReports = await WeatherReport.countDocuments({
    clusterId: eventId,
    createdAt: { $gte: oneHourAgo }
  });

  const previousReports = await WeatherReport.countDocuments({
    clusterId: eventId,
    createdAt: { $gte: twoHoursAgo, $lt: oneHourAgo }
  });

  const isEmerging = recentReports > previousReports && recentReports >= 2;
  const score = previousReports > 0
    ? Math.round((recentReports / previousReports) * 100)
    : recentReports * 50;

  return { isEmerging, score, recentReports, previousReports };
};