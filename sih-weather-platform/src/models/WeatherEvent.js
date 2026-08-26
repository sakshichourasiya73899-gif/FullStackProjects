import mongoose from 'mongoose';

const WeatherEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    city: { type: String }
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  // Kaunse reports is event ka hissa hain
  linkedReports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeatherReport'
  }],
  reportCount: {
    type: Number,
    default: 1
  },
  // Kitne alag source types ne is event ko confirm kiya (corroboration ke liye Din 2 mein use hoga)
  sourceTypes: [{ type: String }],
  firstReportedAt: {
    type: Date,
    required: true
  },
  lastReportedAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('WeatherEvent', WeatherEventSchema);