import express from 'express';
import WeatherEvent from '../models/WeatherEvent.js';
import WeatherReport from '../models/WeatherReport.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// Sab active events — filters + priority sort ke saath
router.get('/active-events', asyncHandler(async (req, res) => {
  const {
    eventType, severity, status,
    isEmerging, minPriority, city, state,
    limit = 100
  } = req.query;

  const filter = {};
  if (eventType) filter.eventType = eventType;
  if (severity) filter.severity = severity;
  if (status) filter.status = status;
  else filter.status = 'active';
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

// Ek event ka detail
router.get('/:id', asyncHandler(async (req, res) => {
  const event = await WeatherEvent.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json({ success: true, event });
}));

// Ek event ke linked reports
router.get('/:id/reports', asyncHandler(async (req, res) => {
  const event = await WeatherEvent.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const reports = await WeatherReport.find({
    _id: { $in: event.linkedReports }
  }).sort({ createdAt: -1 });

  res.json({ success: true, count: reports.length, reports });
}));

// Analytics endpoint
router.get('/analytics/summary', asyncHandler(async (req, res) => {
  const [
    totalActive,
    emerging,
    highPriority,
    byType,
    bySeverity
  ] = await Promise.all([
    WeatherEvent.countDocuments({ status: 'active' }),
    WeatherEvent.countDocuments({ status: 'active', 'trend.isEmerging': true }),
    WeatherEvent.countDocuments({ status: 'active', priorityScore: { $gte: 70 } }),
    WeatherEvent.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } }
    ]),
    WeatherEvent.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ])
  ]);

  res.json({
    success: true,
    summary: {
      totalActive,
      emerging,
      highPriority,
      byType: Object.fromEntries(byType.map(b => [b._id, b.count])),
      bySeverity: Object.fromEntries(bySeverity.map(b => [b._id, b.count]))
    }
  });
}));

export default router;