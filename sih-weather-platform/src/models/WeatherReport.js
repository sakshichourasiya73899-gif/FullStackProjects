import mongoose from 'mongoose';

const WeatherReportSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  sourceType: {
    type: String,
    enum: ['citizen', 'weather_api', 'news_rss', 'social_mock'],
    required: true
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    city: { type: String },
    district: { type: String },
    resolved: { type: Boolean, default: false }
  },
  eventType: {
    type: String,
    enum: ['flood', 'rainfall', 'thunderstorm', 'heatwave', 'fog', 'dust_storm', 'strong_wind', 'other'],
    default: 'other'
  },
  credibilityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  credibilityReasons: [{ type: String }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  media: [{
    url: String,
    type: { type: String, enum: ['image', 'video'] }
  }],
  isDuplicate: {
    type: Boolean,
    default: false
  },
  clusterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeatherReport',
    default: null
  },
  reportCount: {
    type: Number,
    default: 1
  },
  processedByAI: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('WeatherReport', WeatherReportSchema);