import express from 'express';
import WeatherEvent from '../models/WeatherEvent.js';
import WeatherReport from '../models/WeatherReport.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// Analytics endpoint — MUST be before /:id so Express doesn't match 'analytics' as an ID
router.get('/analytics/summary', asyncHandler(async (req, res) => {
  const [
    totalActive,
    emerging,
    highPriority,
    verified,
    byType,
    bySeverity,
    totalReportsAgg
  ] = await Promise.all([
    WeatherEvent.countDocuments({ status: { $nin: ['resolved', 'rejected'] } }),
    WeatherEvent.countDocuments({ status: { $nin: ['resolved', 'rejected'] }, 'trend.isEmerging': true }),
    WeatherEvent.countDocuments({ status: { $nin: ['resolved', 'rejected'] }, priorityScore: { $gte: 70 } }),
    WeatherEvent.countDocuments({ status: { $nin: ['resolved', 'rejected'] }, verificationStatus: 'verified' }),
    WeatherEvent.aggregate([
      { $match: { status: { $nin: ['resolved', 'rejected'] } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]),
    WeatherEvent.aggregate([
      { $match: { status: { $nin: ['resolved', 'rejected'] } } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]),
    WeatherEvent.aggregate([
      { $match: { status: { $nin: ['resolved', 'rejected'] } } },
      { $group: { _id: null, total: { $sum: '$reportCount' } } }
    ])
  ]);

  const bySeverityObj = Object.fromEntries(bySeverity.map(b => [b._id, b.count]));
  const totalReportsCount = totalReportsAgg.length > 0 ? totalReportsAgg[0].total : 0;

  res.json({
    success: true,
    summary: {
      activeCount: totalActive,
      emergingCount: emerging,
      highPriorityCount: highPriority,
      verifiedCount: verified,
      highSeverityCount: bySeverityObj['high'] || 0,
      totalReports: totalReportsCount,
      byType: Object.fromEntries(byType.map(b => [b._id, b.count])),
      bySeverity: bySeverityObj
    }
  });
}));

// All active events — filters + priority sort
router.get('/', asyncHandler(async (req, res) => {
  const {
    eventType, severity, status,
    isEmerging, minPriority, city, state,
    limit = 100
  } = req.query;

  const filter = {};
  if (eventType) filter.eventType = eventType;
  if (severity) filter.severity = severity;
  if (status) filter.status = status;
  else filter.status = { $nin: ['resolved', 'rejected'] };
  if (isEmerging === 'true') filter['trend.isEmerging'] = true;
  if (minPriority) filter.priorityScore = { $gte: Number(minPriority) };
  if (city) filter['location.city'] = new RegExp(city, 'i');
  if (state) filter['location.state'] = new RegExp(state, 'i');

  const events = await WeatherEvent.find(filter)
    .sort({ priorityScore: -1, lastReportedAt: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    count: events.length,
    emergingCount: events.filter(e => e.trend?.isEmerging).length,
    highPriorityCount: events.filter(e => e.priorityScore >= 70).length,
    events
  });
}));

// Single event detail
router.get('/:id', asyncHandler(async (req, res) => {
  const event = await WeatherEvent.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json({ success: true, event });
}));

// Linked reports for an event
router.get('/:id/reports', asyncHandler(async (req, res) => {
  const event = await WeatherEvent.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const reports = await WeatherReport.find({
    _id: { $in: event.linkedReports }
  }).sort({ createdAt: -1 });

  res.json({ success: true, count: reports.length, reports });
}));

// Verify, Reject, or Flag an event
router.post('/:id/verify', asyncHandler(async (req, res) => {
  const { action } = req.body; // 'verify', 'reject'
  
  if (!['verify', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  const event = await WeatherEvent.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  event.verificationStatus = action === 'verify' ? 'verified' : 'rejected';
  event.status = action === 'verify' ? 'verified' : 'rejected';
  await event.save();

  // Also emit so connected clients get the update
  const { getIO } = await import('../../server.js');
  const io = getIO();
  if (io) io.emit('eventUpdated', event);

  res.json({ success: true, event });
}));

router.post('/:id/flag', asyncHandler(async (req, res) => {
  const event = await WeatherEvent.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  event.status = 'under_review';
  await event.save();

  const { getIO } = await import('../../server.js');
  const io = getIO();
  if (io) io.emit('eventUpdated', event);

  res.json({ success: true, event });
}));

export default router;