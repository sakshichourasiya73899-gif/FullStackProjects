// // import axios from 'axios';
// // import WeatherReport from '../models/WeatherReport.js';
// // import { findOrCreateEvent } from './eventClustering.js';

// // export const normalizeAndProcess = async (rawItem, sourceType) => {
// //   try {
// //     const normalized = normalize(rawItem, sourceType);

// //     const validationError = validateNormalized(normalized);
// //     if (validationError) {
// //       console.warn(`[Validation failed] ${sourceType}: ${validationError}`);
// //       return null;
// //     }

// //     // Groq relevance filter
// //     if (sourceType === 'news_rss' || sourceType === 'social_mock') {
// //       const relevant = await checkRelevance(normalized.source.platform === 'social_mock'
// //         ? normalized.text
// //         : normalized.text);
// //       if (!relevant) {
// //         console.log(`[Groq Filter] Skipped: "${normalized.text.slice(0, 50)}..."`);
// //         return null;
// //       }
// //     }

// //     // Python AI service
// //     const aiResult = await callAIService(normalized, sourceType);

// //     if (aiResult) {
// //       normalized.aiAnalysis = {
// //         processed: true,
// //         isWeatherRelated: true,
// //         relevanceScore: aiResult.classifyConfidence || 0,
// //         eventType: aiResult.eventType,
// //         eventConfidence: aiResult.classifyConfidence || 0,
// //         severity: aiResult.severity,
// //         severityConfidence: 0.8
// //       };
// //       normalized.credibility = {
// //         score: aiResult.credibilityScore,
// //         reasons: aiResult.credibilityReasons,
// //         verificationStatus: 'unverified'
// //       };
// //     }

// //     const report = new WeatherReport(normalized);
// //     const saved = await report.save();

// //     // Clustering
// //     if (saved.aiAnalysis?.processed && saved.aiAnalysis?.eventType !== 'other') {
// //       const event = await findOrCreateEvent(saved);
// //       if (event) {
// //         await WeatherReport.findByIdAndUpdate(saved._id, { eventId: event._id });
// //       }
// //     }

// //     console.log(`[Saved] ${sourceType} | ${saved.aiAnalysis?.eventType} | ${saved.aiAnalysis?.severity} | "${saved.text.slice(0, 40)}..."`);
// //     return saved;
// //   } catch (err) {
// //     console.error(`[normalizeAndProcess error] ${sourceType}:`, err.message);
// //     return null;
// //   }
// // };

// // const normalize = (rawItem, sourceType) => ({
// //   text: rawItem.text?.trim() || '',
// //   source: {
// //     type: sourceType,
// //     platform: sourceType,
// //     sourceUrl: rawItem.sourceUrl || null,
// //     sourceName: rawItem.sourceName || null
// //   },
// //   time: {
// //     reportedAt: new Date(),
// //     collectedAt: new Date()
// //   },
// //   location: {
// //     lat: rawItem.lat || null,
// //     lng: rawItem.lng || null,
// //     resolved: !!(rawItem.lat && rawItem.lng),
// //     confidence: rawItem.lat ? 0.9 : 0
// //   },
// //   media: rawItem.media || [],
// //   aiAnalysis: { processed: false },
// //   credibility: { score: 0, reasons: [], verificationStatus: 'unverified' },
// //   duplicate: { isDuplicate: false },
// //   embedding: []
// // });

// // const validateNormalized = (item) => {
// //   if (!item.text || item.text.length < 5) return 'text missing or too short';
// //   if (item.text.length > 1000) return 'text too long';
// //   return null;
// // };

// // const checkRelevance = async (text) => {
// //   try {
// //     const response = await axios.post(`${process.env.PYTHON_AI_URL}/is-relevant`, { text });
// //     return response.data.relevant;
// //   } catch {
// //     return true;
// //   }
// // };

// // const callAIService = async (normalized, sourceType) => {
// //   try {
// //     const response = await axios.post(`${process.env.PYTHON_AI_URL}/process`, {
// //       text: normalized.text,
// //       sourceType,
// //       hasMedia: normalized.media.length > 0,
// //       locationResolved: normalized.location.resolved
// //     });
// //     return response.data;
// //   } catch (err) {
// //     console.error(`[AI service error] ${err.message}`);
// //     return null;
// //   }
// // };


// import axios from 'axios';
// import WeatherReport from '../models/WeatherReport.js';
// import { findOrCreateEvent } from './eventClustering.js';

// export const normalizeAndProcess = async (rawItem, sourceType) => {
//   try {
//     const normalized = normalize(rawItem, sourceType);

//     const validationError = validateNormalized(normalized);
//     if (validationError) {
//       console.warn(
//         `[Validation failed] ${sourceType}: ${validationError}`
//       );
//       return null;
//     }

//     // Groq relevance filter
//     if (sourceType === 'news_rss' || sourceType === 'social_mock') {
//       const relevant = await checkRelevance(
//         normalized.source.platform === 'social_mock'
//           ? normalized.text
//           : normalized.text
//       );

//       if (!relevant) {
//         console.log(
//           `[Groq Filter] Skipped: "${normalized.text.slice(0, 50)}..."`
//         );
//         return null;
//       }
//     }

//     // Python AI service
//     const aiResult = await callAIService(normalized, sourceType);

//     if (aiResult) {
//       normalized.aiAnalysis = {
//         processed: true,
//         isWeatherRelated: true,
//         relevanceScore: aiResult.classifyConfidence || 0,
//         eventType: aiResult.eventType,
//         eventConfidence: aiResult.classifyConfidence || 0,
//         severity: aiResult.severity,
//         severityConfidence: 0.8
//       };

//       normalized.credibility = {
//         score: aiResult.credibilityScore,
//         reasons: aiResult.credibilityReasons,
//         verificationStatus: 'unverified'
//       };
//     }

//     const report = new WeatherReport(normalized);
//     const saved = await report.save();

//     // Clustering
//     if (
//       saved.aiAnalysis?.processed &&
//       saved.aiAnalysis?.eventType !== 'other'
//     ) {
//       const event = await findOrCreateEvent(saved);

//       if (event) {
//         await WeatherReport.findByIdAndUpdate(
//           saved._id,
//           {
//             eventId: event._id
//           }
//         );
//       }
//     }

//     console.log(
//       `[Saved] ${sourceType} | ${saved.aiAnalysis?.eventType} | ` +
//       `${saved.aiAnalysis?.severity} | ` +
//       `"${saved.text.slice(0, 40)}..."`
//     );

//     return saved;

//   } catch (err) {
//     console.error(
//       `[normalizeAndProcess error] ${sourceType}:`,
//       err.message
//     );

//     return null;
//   }
// };


// const normalize = (rawItem, sourceType) => ({
//   text: rawItem.text?.trim() || '',

//   // Required by the current WeatherReport model
//   sourceType: sourceType,

//   source: {
//     type: sourceType,
//     platform: sourceType,
//     sourceUrl: rawItem.sourceUrl || null,
//     sourceName: rawItem.sourceName || null
//   },

//   time: {
//     reportedAt: new Date(),
//     collectedAt: new Date()
//   },

//   location: {
//     lat: rawItem.lat || null,
//     lng: rawItem.lng || null,
//     resolved: !!(rawItem.lat && rawItem.lng),
//     confidence: rawItem.lat ? 0.9 : 0
//   },

//   media: rawItem.media || [],

//   aiAnalysis: {
//     processed: false
//   },

//   credibility: {
//     score: 0,
//     reasons: [],
//     verificationStatus: 'unverified'
//   },

//   duplicate: {
//     isDuplicate: false
//   },

//   embedding: []
// });


// const validateNormalized = (item) => {
//   if (!item.text || item.text.length < 5) {
//     return 'text missing or too short';
//   }

//   if (item.text.length > 1000) {
//     return 'text too long';
//   }

//   return null;
// };


// const checkRelevance = async (text) => {
//   try {
//     const response = await axios.post(
//       `${process.env.PYTHON_AI_URL}/is-relevant`,
//       { text }
//     );

//     return response.data.relevant;

//   } catch {
//     return true;
//   }
// };


// const callAIService = async (normalized, sourceType) => {
//   try {
//     const response = await axios.post(
//       `${process.env.PYTHON_AI_URL}/process`,
//       {
//         text: normalized.text,
//         sourceType,
//         hasMedia: normalized.media.length > 0,
//         locationResolved: normalized.location.resolved
//       }
//     );

//     return response.data;

//   } catch (err) {
//     console.error(
//       `[AI service error] ${err.message}`
//     );

//     return null;
//   }
// };

import axios from 'axios';
import WeatherReport from '../models/WeatherReport.js';
import { findOrCreateEvent } from './eventClustering.js';
import { resolveLocation } from './geocodingService.js';

export const normalizeAndProcess = async (rawItem, sourceType) => {
  try {
    const normalized = await normalize(rawItem, sourceType);

    const validationError = validateNormalized(normalized);
    if (validationError) {
      console.warn(`[Validation failed] ${sourceType}: ${validationError}`);
      return null;
    }

    // Groq relevance filter — sirf news aur social ke liye
    if (sourceType === 'news_rss' || sourceType === 'social_mock') {
      const relevant = await checkRelevance(normalized.text);
      if (!relevant) {
        console.log(`[Groq Filter] Skipped: "${normalized.text.slice(0, 50)}..."`);
        return null;
      }
    }

    // Geocoding Fallback for text-based sources
    if (!normalized.location.resolved) {
      const locData = await extractLocation(normalized.text);
      if (locData && locData.lat && locData.lng) {
        normalized.location.lat = locData.lat;
        normalized.location.lng = locData.lng;
        normalized.location.city = locData.city;
        normalized.location.state = locData.state;
        normalized.location.resolved = true;
        normalized.location.confidence = 0.8;
        console.log(`[Geocoding] Extracted Location: ${locData.city} (${locData.lat}, ${locData.lng})`);
      }
    }

    // Python AI service call
    const aiResult = await callAIService(normalized, sourceType);

    if (aiResult) {
      normalized.aiAnalysis = {
        processed: true,
        isWeatherRelated: true,
        relevanceScore: aiResult.classifyConfidence || 0,
        eventType: aiResult.eventType,
        eventConfidence: aiResult.classifyConfidence || 0,
        severity: aiResult.severity,
        severityConfidence: aiResult.severityConfidence || 0.8
      };
      normalized.credibility = {
        score: aiResult.credibilityScore,
        reasons: aiResult.credibilityReasons,
        verificationStatus: 'unverified'
      };
    }

    const report = new WeatherReport(normalized);
    const saved = await report.save();

    // Clustering
    if (saved.aiAnalysis?.processed && saved.aiAnalysis?.eventType !== 'other') {
      const event = await findOrCreateEvent(saved);
      if (event) {
        await WeatherReport.findByIdAndUpdate(saved._id, { eventId: event._id });
      }
    }

    console.log(`[Saved] ${sourceType} | ${saved.aiAnalysis?.eventType} | ${saved.aiAnalysis?.severity} | "${saved.text.slice(0, 40)}..."`);
    return saved;
  } catch (err) {
    console.error(`[normalizeAndProcess error] ${sourceType}:`, err.message);
    return null;
  }
};

const normalize = async (rawItem, sourceType) => {
  const lat = rawItem.lat || null;
  const lng = rawItem.lng || null;

  let cityState = { city: null, state: null };
  if (lat && lng) {
    cityState = await resolveLocation(lat, lng);
  }

  return {
    text: rawItem.text?.trim() || '',
    sourceType,
    source: {
      type: sourceType,
      platform: sourceType,
      sourceUrl: rawItem.sourceUrl || null,
      sourceName: rawItem.sourceName || null
    },
    time: { reportedAt: new Date(), collectedAt: new Date() },
    location: {
      lat,
      lng,
      city: cityState.city,
      state: cityState.state,
      resolved: !!(lat && lng),
      confidence: lat ? 0.9 : 0
    },
    media: rawItem.media || [],
    aiAnalysis: { processed: false },
    credibility: { score: 0, reasons: [], verificationStatus: 'unverified' },
    duplicate: { isDuplicate: false },
    embedding: []
  };
};

const validateNormalized = (item) => {
  if (!item.text || item.text.length < 5) return 'text missing or too short';
  if (item.text.length > 1000) return 'text too long';
  return null;
};

const checkRelevance = async (text) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/is-relevant`,
      { text }
    );
    return response.data.relevant;
  } catch (err) {
    console.error(`[checkRelevance error]:`, err.message);
    return false;
  }
};

const extractLocation = async (text) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/extract-location`,
      { text }
    );
    return response.data;
  } catch (err) {
    console.error(`[extractLocation error]:`, err.message);
    return null;
  }
};

const callAIService = async (normalized, sourceType) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/process`,
      {
        text: normalized.text,
        sourceType,
        hasMedia: normalized.media.length > 0,
        locationResolved: normalized.location.resolved
      }
    );
    return response.data;
  } catch (err) {
    console.error(`[AI service error] ${err.message}`);
    return null;
  }
};