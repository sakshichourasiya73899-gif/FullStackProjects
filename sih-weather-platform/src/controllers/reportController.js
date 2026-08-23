import WeatherReport from '../models/WeatherReport.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// POST /api/reports/citizen
export const createCitizenReport = asyncHandler(async (req, res) => {
  const { text, lat, lng, media } = req.body;

  const report = new WeatherReport({
    text: text.trim(),
    sourceType: 'citizen',
    location: {
      lat: lat || null,
      lng: lng || null,
      resolved: !!(lat && lng)
    },
    media: media || []
  });

  const savedReport = await report.save();

  res.status(201).json({
    success: true,
    message: 'Report received',
    report: savedReport
  });
});

// GET /api/reports
export const getAllReports = asyncHandler(async (req, res) => {
  const reports = await WeatherReport.find().sort({ createdAt: -1 }).limit(50);
  res.status(200).json({
    success: true,
    count: reports.length,
    reports
  });
});