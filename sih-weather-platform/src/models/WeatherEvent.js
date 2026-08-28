import mongoose from 'mongoose';

const WeatherEventSchema = new mongoose.Schema({
  // Classification
  eventType: { type: String, required: true },
  eventSubtype: { type: String },
  category: {
    type: String,
    enum: ['meteorological', 'hydrological', 'climatological', 'geophysical'],
    default: 'meteorological'
  },

  // Auto-generated title + summary
  title: { type: String },
  summary: { type: String },

  // Location
  location: {
    city: { type: String },
    state: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },

  // Severity
  severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },

  // Scores
  credibilityScore: { type: Number, default: 0 },
  priorityScore: { type: Number, default: 0 },
  aiConfidence: { type: Number, default: 0 },

  // Reports
  linkedReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WeatherReport' }],
  reportCount: { type: Number, default: 1 },
  uniqueSourceCount: { type: Number, default: 1 },
  sourceTypes: [{ type: String }],

  // Evidence
  evidence: {
    imageCount: { type: Number, default: 0 },
    videoCount: { type: Number, default: 0 }
  },

  // Trend
  trend: {
    reportsLast15Min: { type: Number, default: 0 },
    reportsLastHour: { type: Number, default: 0 },
    reportsLast6Hours: { type: Number, default: 0 },
    velocity: {
      type: String,
      enum: ['rapidly_increasing', 'increasing', 'stable', 'decreasing'],
      default: 'stable'
    },
    surgeScore: { type: Number, default: 0 },
    isEmerging: { type: Boolean, default: false }
  },

  // Corroboration
  corroboration: {
    score: { type: Number, default: 0 },
    level: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    reasons: [{ type: String }]
  },

  verificationStatus: {
    type: String,
    enum: ['unverified', 'verified', 'rejected'],
    default: 'unverified'
  },

  status: { type: String, enum: ['active', 'resolved'], default: 'active' },

  firstReportedAt: { type: Date, required: true },
  lastReportedAt: { type: Date, required: true }

}, { timestamps: true });

export default mongoose.model('WeatherEvent', WeatherEventSchema);