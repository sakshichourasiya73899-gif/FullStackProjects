import express from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { getRecentLogs } from '../services/systemLogger.js';
import { startMockSocialAdapter } from '../adapters/mockSocialAdapter.js';
import { startNewsRssAdapter } from '../adapters/newsRssAdapter.js';
import WeatherReport from '../models/WeatherReport.js';
import WeatherEvent from '../models/WeatherEvent.js';

const router = express.Router();

// GET /api/system/logs — returns recent pipeline log entries
router.get('/logs', asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 200);
  const logs = getRecentLogs(limit);
  res.json({ success: true, count: logs.length, logs });
}));

// GET /api/system/metrics — full dashboard metrics in one call
router.get('/metrics', asyncHandler(async (req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const [
    reportsToday,
    totalReports,
    reportsLastHour,
    activeEvents,
    emergingEvents,
    highPriorityEvents,
    verifiedEvents,
  ] = await Promise.all([
    WeatherReport.countDocuments({ createdAt: { $gte: todayStart } }),
    WeatherReport.countDocuments({}),
    WeatherReport.countDocuments({ createdAt: { $gte: oneHourAgo } }),
    WeatherEvent.countDocuments({ status: { $nin: ['resolved', 'rejected'] } }),
    WeatherEvent.countDocuments({ status: { $nin: ['resolved', 'rejected'] }, 'trend.isEmerging': true }),
    WeatherEvent.countDocuments({ status: { $nin: ['resolved', 'rejected'] }, priorityScore: { $gte: 70 } }),
    WeatherEvent.countDocuments({ verificationStatus: 'verified' }),
  ]);

  res.json({
    success: true,
    metrics: {
      reportsToday,
      totalReports,
      reportsLastHour,
      activeEvents,
      emergingEvents,
      highPriorityEvents,
      verifiedEvents,
    }
  });
}));

// POST /api/system/sync — triggers a one-off ingestion run
router.post('/sync', asyncHandler(async (req, res) => {
  // Fire adapters once (they run one tick, not continuously)
  // Use setTimeout(0) so we respond immediately and they run in background
  setTimeout(() => {
    try { startMockSocialAdapter(0); } catch (_) { /* ignore */ }
    try { startNewsRssAdapter(); } catch (_) { /* ignore */ }
  }, 0);

  res.json({
    success: true,
    message: 'Force sync triggered. Adapters are ingesting new data.'
  });
}));

export default router;
