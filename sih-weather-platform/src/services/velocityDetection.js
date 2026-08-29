import WeatherEvent from '../models/WeatherEvent.js';
import WeatherReport from '../models/WeatherReport.js';

export const checkVelocity = async (eventId) => {
  const now = new Date();
  const fifteenMinAgo = new Date(now - 15 * 60 * 1000);
  const oneHourAgo = new Date(now - 60 * 60 * 1000);
  const sixHoursAgo = new Date(now - 6 * 60 * 60 * 1000);
  const prevFifteenStart = new Date(now - 30 * 60 * 1000);
  const prevHourStart = new Date(now - 2 * 60 * 60 * 1000);

  // Event ke linkedReports IDs nikalo pehle
  const event = await WeatherEvent.findById(eventId).select('linkedReports');
  if (!event || !event.linkedReports.length) {
    return {
      isEmerging: false, score: 0,
      reportsLast15Min: 0, reportsLastHour: 0, reportsLast6Hours: 0,
      reportsPrevious15Min: 0, reportsPreviousHour: 0,
      growthPercentage: 0, velocity: 'stable'
    };
  }

  const reportIds = event.linkedReports;

  // LinkedReport IDs se count karo — eventId field update hone ka wait nahi
  const [r15, r1h, r6h, rp15, rp1h] = await Promise.all([
    WeatherReport.countDocuments({ _id: { $in: reportIds }, createdAt: { $gte: fifteenMinAgo } }),
    WeatherReport.countDocuments({ _id: { $in: reportIds }, createdAt: { $gte: oneHourAgo } }),
    WeatherReport.countDocuments({ _id: { $in: reportIds }, createdAt: { $gte: sixHoursAgo } }),
    WeatherReport.countDocuments({ _id: { $in: reportIds }, createdAt: { $gte: prevFifteenStart, $lt: fifteenMinAgo } }),
    WeatherReport.countDocuments({ _id: { $in: reportIds }, createdAt: { $gte: prevHourStart, $lt: oneHourAgo } })
  ]);

  const isEmerging = r15 >= 3 || (r15 > rp15 * 2 && r15 >= 2);
  const growthPercentage = rp1h > 0
    ? Math.round(((r1h - rp1h) / rp1h) * 100)
    : r1h * 100;

  const velocity = isEmerging ? 'rapidly_increasing'
    : r1h > rp1h ? 'increasing'
    : r1h === rp1h ? 'stable'
    : 'decreasing';

  return {
    isEmerging,
    score: Math.min(100, r15 * 15 + r1h * 5),
    reportsLast15Min: r15,
    reportsLastHour: r1h,
    reportsLast6Hours: r6h,
    reportsPrevious15Min: rp15,
    reportsPreviousHour: rp1h,
    growthPercentage,
    velocity
  };
};