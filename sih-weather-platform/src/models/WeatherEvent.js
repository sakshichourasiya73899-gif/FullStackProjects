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
   // Trend Analysis
trend: {

  // Report volume
  reportsLast15Min: {
    type: Number,
    default: 0
  },

  reportsLastHour: {
    type: Number,
    default: 0
  },

  reportsLast6Hours: {
    type: Number,
    default: 0
  },

  // Previous windows for comparison
  reportsPrevious15Min: {
    type: Number,
    default: 0
  },

  reportsPreviousHour: {
    type: Number,
    default: 0
  },

  // How fast the event is growing
  velocity: {
    type: String,
    enum: [
      'rapidly_increasing',
      'increasing',
      'stable',
      'decreasing'
    ],
    default: 'stable'
  },

  // Reports per minute
  reportRate: {
    type: Number,
    default: 0
  },

  // Increase compared with previous period
  growthPercentage: {
    type: Number,
    default: 0
  },

  // Overall surge indicator
  surgeScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Early-stage rapidly developing event
  isEmerging: {
    type: Boolean,
    default: false
  },

  // Time when event was identified as emerging
  emergingDetectedAt: {
    type: Date,
    default: null
  },

  // When trend was last calculated
  lastCalculatedAt: {
    type: Date,
    default: null
  }
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

  // status field update karo:
status: {
  type: String,
  enum: ['detected', 'corroborating', 'emerging', 'high_priority', 'under_review', 'verified', 'rejected', 'resolved'],
  default: 'detected'
},

  firstReportedAt: { type: Date, required: true },
  lastReportedAt: { type: Date, required: true }

}, { timestamps: true });


WeatherEventSchema.index({ 'location.coordinates': '2dsphere' });
WeatherEventSchema.index({ status: 1, priorityScore: -1 });
WeatherEventSchema.index({ eventType: 1, lastReportedAt: -1 });

export default mongoose.model('WeatherEvent', WeatherEventSchema);