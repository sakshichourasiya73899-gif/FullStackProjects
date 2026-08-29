// import mongoose from 'mongoose';

// const WeatherReportSchema = new mongoose.Schema({
//   text: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   sourceType: {
//     type: String,
//     enum: ['citizen', 'weather_api', 'news_rss', 'social_mock'],
//     required: true
//   },
//     // Source details
//   source: {
//     type: { type: String, enum: ['citizen', 'weather_api', 'news_rss', 'social_mock'], required: true },
//     platform: { type: String },
//     sourceUrl: { type: String, default: null },
//     sourceName: { type: String, default: null }
//   },
//     // Time tracking
//   time: {
//     reportedAt: { type: Date, default: Date.now },
//     collectedAt: { type: Date, default: Date.now }
//   },
//     // Location
//   location: {
//     rawText: { type: String },
//     city: { type: String },
//     state: { type: String },
//     lat: { type: Number },
//     lng: { type: Number },
//     resolved: { type: Boolean, default: false },
//     confidence: { type: Number, default: 0 }
//   },
//     // AI Analysis
//   aiAnalysis: {
//     processed: { type: Boolean, default: false },
//     isWeatherRelated: { type: Boolean, default: null },
//     relevanceScore: { type: Number, default: 0 },
//     eventType: {
//       type: String,
//       enum: ['flood', 'rainfall', 'thunderstorm', 'heatwave', 'fog', 'dust_storm', 'strong_wind', 'wildfire', 'drought', 'other'],
//       default: 'other'
//     },
//     eventSubtype: { type: String },
//     eventConfidence: { type: Number, default: 0 },
//     severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
//     severityConfidence: { type: Number, default: 0 }
//   },
//    // Credibility
//   credibility: {
//     score: { type: Number, default: 0 },
//     reasons: [{ type: String }],
//     verificationStatus: { type: String, enum: ['unverified', 'verified', 'rejected'], default: 'unverified' }
//   },
//     // Media
//   media: [{
//     type: { type: String, enum: ['image', 'video'] },
//     url: { type: String },
//     thumbnailUrl: { type: String }
//   }],
//    // Duplicate detection
//   duplicate: {
//     isDuplicate: { type: Boolean, default: false },
//     similarityScore: { type: Number, default: 0 },
//     originalReportId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeatherReport', default: null }
//   },
//   // Linked event
//   eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeatherEvent', default: null },
  
//    // Embedding (baad mein use hoga)
//   embedding: { type: [Number], default: [] },
//   //  // Metadata
//   // metadata: {
//   //   sourceUrl: { type: String },
//   //   sourceName: { type: String },
//   //   sourceLogo: { type: String },
//   //   rawText: { type: String },
//   //   originalText: { type: String }
//   // },
//   //   //Counts
//   // duplicatesCount: { type: Number, default: 0 },
//   // similarReportsCount: { type: Number, default: 0 },
//   // verifiedReportsCount: { type: Number, default: 0 },

//   eventType: {
//     type: String,
//     enum: ['flood', 'rainfall', 'thunderstorm', 'heatwave', 'fog', 'dust_storm', 'strong_wind', 'other'],
//     default: 'other'
//   },
//   credibilityScore: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
//   credibilityReasons: [{ type: String }],
//   severity: {
//     type: String,
//     enum: ['low', 'medium', 'high'],
//     default: 'low'
//   },
//   media: [{
//     url: String,
//     type: { type: String, enum: ['image', 'video'] }
//   }],
//   isDuplicate: {
//     type: Boolean,
//     default: false
//   },
//   clusterId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'WeatherReport',
//     default: null
//   },
//   reportCount: {
//     type: Number,
//     default: 1
//   },
//   processedByAI: {
//     type: Boolean,
//     default: false
//   },
//  eventType: {
//   type: String,
//   enum: [
//     'flood', 'rainfall', 'thunderstorm', 'heatwave',
//     'fog', 'dust_storm', 'strong_wind', 'wildfire', 'other'
//   ],
//   default: 'other'
// },
// sourceUrl: {
//   type: String,
//   default: null
// },
// sourceName: {
//   type: String,
//   default: null  // "NDTV", "Times of India", "Reddit r/india", "Citizen Report"
// }
// }, {
//   timestamps: true
// });

// export default mongoose.model('WeatherReport', WeatherReportSchema);  

import mongoose from 'mongoose';

const WeatherReportSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },

  // Root level sourceType — adapters ke liye (required)
  sourceType: {
    type: String,
    enum: ['citizen', 'weather_api', 'news_rss', 'social_mock'],
    required: true
  },

  // Nested source object — new schema
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
    city: { type: String },
  state: { type: String },

  lat: { type: Number, required: true },
  lng: { type: Number, required: true },

  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    resolved: { type: Boolean, default: false },
    confidence: { type: Number, default: 0 }
  },

  // New AI analysis structure
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
    eventSubtype: { type: String },
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
    thumbnailUrl: { type: String }
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