import mongoose from 'mongoose';

const WeatherReportSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },

  sourceType: {
    type: String,
    enum: ['citizen', 'weather_api', 'news_rss', 'social_mock'],
    required: true
  },

  source: {
    type: { type: String },
    platform: { type: String },
    sourceUrl: { type: String, default: null },
    sourceName: { type: String, default: null }
  },

  time: {
    reportedAt: { type: Date, default: Date.now },
    collectedAt: { type: Date, default: Date.now }
  },

  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    resolved: { type: Boolean, default: false },
    confidence: { type: Number, default: 0 }
  },

  aiAnalysis: {
    processed: { type: Boolean, default: false },
    isWeatherRelated: { type: Boolean, default: null },
    relevanceScore: { type: Number, default: 0 },
    eventType: {
      type: String,
      enum: ['flood', 'rainfall', 'thunderstorm', 'heatwave', 'fog',
             'dust_storm', 'strong_wind', 'wildfire', 'drought',
             'cyclone', 'cold_wave', 'other'],
      default: 'other'
    },
    eventSubtype: { type: String, default: null },
    eventConfidence: { type: Number, default: 0 },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    severityConfidence: { type: Number, default: 0 }
  },

  credibility: {
    score: { type: Number, default: 0 },
    reasons: [{ type: String }],
    verificationStatus: {
      type: String,
      enum: ['unverified', 'verified', 'rejected'],
      default: 'unverified'
    }
  },

  media: [{
    type: { type: String, enum: ['image', 'video'] },
    url: { type: String },
    thumbnailUrl: { type: String, default: null }
  }],

  duplicate: {
    isDuplicate: { type: Boolean, default: false },
    similarityScore: { type: Number, default: 0 },
    originalReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WeatherReport',
      default: null
    }
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeatherEvent',
    default: null
  },

  embedding: { type: [Number], default: [] }

}, { timestamps: true });

export default mongoose.model('WeatherReport', WeatherReportSchema);