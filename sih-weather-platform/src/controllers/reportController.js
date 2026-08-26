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
  const reports = await WeatherReport.find().sort({ createdAt: -1 }).limit(50);
  res.status(200).json({
    success: true,
    count: reports.length,
    reports
  });
});