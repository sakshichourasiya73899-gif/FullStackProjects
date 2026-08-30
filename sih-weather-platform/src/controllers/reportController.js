import WeatherReport from '../models/WeatherReport.js';
import { normalizeAndProcess } from '../services/normalizer.js';
import { asyncHandler, AppError } from '../middlewares/errorHandler.js';

export const createCitizenReport = asyncHandler(async (req, res) => {
  const { text, lat, lng, media } = req.body;

  const saved = await normalizeAndProcess({ text, lat, lng, media }, 'citizen');

  if (!saved) {
    throw new AppError('Report failed validation', 400);
  }

  res.status(201).json({
    success: true,
    message: 'Report received',
    report: saved
  });
});

export const getAllReports = asyncHandler(async (req, res) => {
  const {
    sourceType, eventType, severity, city, state,
    isDuplicate, hasMedia, limit = 100, page = 1
  } = req.query;

  const filter = {};
  if (sourceType && sourceType !== 'all') filter.sourceType = sourceType;
  if (eventType && eventType !== 'all') filter['aiAnalysis.eventType'] = eventType;
  if (severity && severity !== 'all') filter['aiAnalysis.severity'] = severity;
  if (city) filter['location.city'] = new RegExp(city, 'i');
  if (state) filter['location.state'] = new RegExp(state, 'i');
  if (isDuplicate === 'true') filter['duplicate.isDuplicate'] = true;
  if (isDuplicate === 'false') filter['duplicate.isDuplicate'] = false;
  if (hasMedia === 'true') filter['media.0'] = { $exists: true };

  const skip = (Number(page) - 1) * Number(limit);

  const reports = await WeatherReport.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await WeatherReport.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: reports.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    reports
  });
});