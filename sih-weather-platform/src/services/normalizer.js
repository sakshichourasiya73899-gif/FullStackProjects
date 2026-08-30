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

// import axios from 'axios';
// import WeatherReport from '../models/WeatherReport.js';
// import { findOrCreateEvent } from './eventClustering.js';
// import { resolveLocation } from './geocodingService.js';
// import { resolveLocation, geocodeCity } from './geocodingService.js';

// export const normalizeAndProcess = async (rawItem, sourceType) => {
//   try {
//     const normalized = await normalize(rawItem, sourceType);

//     const validationError = validateNormalized(normalized);
//     if (validationError) {
//       console.warn(`[Validation failed] ${sourceType}: ${validationError}`);
//       return null;
//     }

//     // Groq relevance filter — sirf news aur social ke liye
//     if (sourceType === 'news_rss' || sourceType === 'social_mock') {
//       const relevant = await checkRelevance(normalized.text);
//       if (!relevant) {
//         console.log(`[Groq Filter] Skipped: "${normalized.text.slice(0, 50)}..."`);
//         return null;
//       }
//     }

//     // Geocoding Fallback for text-based sources
//     if (!normalized.location.resolved) {
//       const locData = await extractLocation(normalized.text);
//       if (locData && locData.lat && locData.lng) {
//         normalized.location.lat = locData.lat;
//         normalized.location.lng = locData.lng;
//         normalized.location.city = locData.city;
//         normalized.location.state = locData.state;
//         normalized.location.resolved = true;
//         normalized.location.confidence = 0.8;
//         console.log(`[Geocoding] Extracted Location: ${locData.city} (${locData.lat}, ${locData.lng})`);
//       }
//     }

//     // Python AI service call
//     const aiResult = await callAIService(normalized, sourceType);

//     if (aiResult) {
//       normalized.aiAnalysis = {
//         processed: true,
//         isWeatherRelated: true,
//         relevanceScore: aiResult.classifyConfidence || 0,
//         eventType: aiResult.eventType,
//         eventConfidence: aiResult.classifyConfidence || 0,
//         severity: aiResult.severity,
//         severityConfidence: aiResult.severityConfidence || 0.8
//       };
//       normalized.credibility = {
//         score: aiResult.credibilityScore,
//         reasons: aiResult.credibilityReasons,
//         verificationStatus: 'unverified'
//       };
//     }

//     const report = new WeatherReport(normalized);
//     normalize.embedding = await generateEmbedding(normalized.text);
//     const saved = await report.save();

//     // Clustering
//     if (saved.aiAnalysis?.processed && saved.aiAnalysis?.eventType !== 'other') {
//       const event = await findOrCreateEvent(saved);
//       if (event) {
//         await WeatherReport.findByIdAndUpdate(saved._id, { eventId: event._id });
//       }
//     }

//     console.log(`[Saved] ${sourceType} | ${saved.aiAnalysis?.eventType} | ${saved.aiAnalysis?.severity} | "${saved.text.slice(0, 40)}..."`);
//     return saved;
//   } catch (err) {
//     console.error(`[normalizeAndProcess error] ${sourceType}:`, err.message);
//     return null;
//   }
// };

// const normalize = async (rawItem, sourceType) => {
//   const lat = rawItem.lat || null;
//   const lng = rawItem.lng || null;

//   let cityState = { city: null, state: null };
//   if (lat && lng) {
//     cityState = await resolveLocation(lat, lng);
//   }

//   return {
//     text: rawItem.text?.trim() || '',
//     sourceType,
//     source: {
//       type: sourceType,
//       platform: sourceType,
//       sourceUrl: rawItem.sourceUrl || null,
//       sourceName: rawItem.sourceName || null
//     },
//     time: { reportedAt: new Date(), collectedAt: new Date() },
//     location: {
//       lat,
//       lng,
//       city: cityState.city,
//       state: cityState.state,
//       resolved: !!(lat && lng),
//       confidence: lat ? 0.9 : 0
//     },
//     media: rawItem.media || [],
//     aiAnalysis: { processed: false },
//     credibility: { score: 0, reasons: [], verificationStatus: 'unverified' },
//     duplicate: { isDuplicate: false },
//     embedding: []
//   };
// };

// const validateNormalized = (item) => {
//   if (!item.text || item.text.length < 5) return 'text missing or too short';
//   if (item.text.length > 1000) return 'text too long';
//   return null;
// };

// const checkRelevance = async (text) => {
//   try {
//     const response = await axios.post(
//       `${process.env.PYTHON_AI_URL}/is-relevant`,
//       { text }
//     );
//     return response.data.relevant;
//   } catch (err) {
//     console.error(`[checkRelevance error]:`, err.message);
//     return false;
//   }
// };

// const generateEmbedding = async (text) => {
//   try {
//     const response = await axios.post(
//       `${process.env.PYTHON_AI_URL}/embed`,
//       { text },
//       { timeout: 10000 }
//     );
//     return response.data.embedding || [];
//   } catch {
//     return [];
//   }
// };

// const extractLocation = async (text) => {
//   try {
//     const response = await axios.post(
//       `${process.env.PYTHON_AI_URL}/extract-location`,
//       { text }
//     );
//     return response.data;
//   } catch (err) {
//     console.error(`[extractLocation error]:`, err.message);
//     return null;
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
//     console.error(`[AI service error] ${err.message}`);
//     return null;
//   }
// };

// const callLocationExtraction = async (text) => {
//   try {
//     const response = await axios.post(
//       `${process.env.PYTHON_AI_URL}/extract-location`,
//       { text },
//       { timeout: 5000 }
//     );
//     const data = response.data;
//     if (data.city && data.lat && data.lng) {
//       return data;
//     }
//     return null;
//   } catch (err) {
//     return null;
//   }
// };
// // normalizeAndProcess mein, aiResult ke baad add karo:
// // Agar location resolved nahi hai (news RSS ke liye) toh NER se extract karo
// if (!normalize.location.resolved && aiResult) {
//   const extracted = await callLocationExtraction(normalize.text);
//   if (extracted) {
//     normalize.location.lat = extracted.lat;
//     normalize.location.lng = extracted.lng;
//     normalize.location.city = extracted.city;
//     normalize.location.state = extracted.state;
//     normalize.location.resolved = true;
//     normalize.location.confidence = 0.75;
//     console.log(`[Location] Extracted: ${extracted.city}, ${extracted.state}`);
//   }
// }


import axios from 'axios';
import WeatherReport from '../models/WeatherReport.js';
import { findOrCreateEvent } from './eventClustering.js';
import { resolveLocation, geocodeCity } from './geocodingService.js';
import { checkDuplicate } from './duplicateDetection.js';

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

    // Python AI service — classify + credibility + severity
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

    // Location extraction — news RSS mein lat/lng nahi hoti
    // AI se city nikalo, phir Nominatim se coordinates lo
    if (!normalized.location.resolved) {
      const extracted = await callLocationExtraction(normalized.text);
      if (extracted?.city) {
        if (extracted.lat && extracted.lng) {
          normalized.location.lat = extracted.lat;
          normalized.location.lng = extracted.lng;
          normalized.location.city = extracted.city;
          normalized.location.state = extracted.state || null;
          normalized.location.resolved = true;
          normalized.location.confidence = 0.75;
        } else {
          // Sirf city name mila — Nominatim se coordinates nikalo
          const coords = await geocodeCity(extracted.city);
          if (coords) {
            normalized.location.lat = coords.lat;
            normalized.location.lng = coords.lng;
            normalized.location.city = extracted.city;
            normalized.location.state = extracted.state || null;
            normalized.location.resolved = true;
            normalized.location.confidence = 0.70;
          }
        }
        if (normalized.location.resolved) {
          console.log(`[Location] Resolved: ${normalized.location.city}, ${normalized.location.state}`);
        }
      }
    }

    // Embedding generate karo (semantic similarity ke liye)
    normalized.embedding = await generateEmbedding(normalized.text);

    const report = new WeatherReport(normalized);
    const saved = await report.save();

    // Duplicate check
    const duplicateResult = await checkDuplicate(saved);
    if (duplicateResult.isDuplicate) {
      await WeatherReport.findByIdAndUpdate(saved._id, {
        duplicate: duplicateResult
      });
      console.log(`[Duplicate] ${duplicateResult.similarityScore}% similar to existing report`);
    }

    // Event clustering — sirf actual weather events ke liye, 'other' nahi
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

// Raw item ko WeatherReport schema ke format mein convert karo
const normalize = async (rawItem, sourceType) => {
  const lat = rawItem.lat || null;
  const lng = rawItem.lng || null;

  let cityState = { city: null, state: null };

  // Coordinates hain toh reverse geocode karo
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
    time: {
      reportedAt: new Date(),
      collectedAt: new Date()
    },
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
    credibility: {
      score: 0,
      reasons: [],
      verificationStatus: 'unverified'
    },
    duplicate: {
      isDuplicate: false,
      similarityScore: 0,
      originalReportId: null
    },
    embedding: []
  };
};

const validateNormalized = (item) => {
  if (!item.text || item.text.length < 5) return 'text missing or too short';
  if (item.text.length > 1000) return 'text too long';
  return null;
};

// Groq se weather relevance check
const checkRelevance = async (text) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/is-relevant`,
      { text },
      { timeout: 5000 }
    );
    return response.data.relevant ?? true;
  } catch {
    return true; // fail-safe: include karo
  }
};

// Python classifier — eventType, severity, credibility
const callAIService = async (normalized, sourceType) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/process`,
      {
        text: normalized.text,
        sourceType,
        hasMedia: normalized.media.length > 0,
        locationResolved: normalized.location.resolved
      },
      { timeout: 10000 }
    );
    return response.data;
  } catch (err) {
    console.error(`[AI service error] ${err.message}`);
    return null;
  }
};

// AI se city/state extract karo (news RSS ke liye — no GPS)
const callLocationExtraction = async (text) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/extract-location`,
      { text },
      { timeout: 6000 }
    );
    const data = response.data;
    if (data?.city) return data;
    return null;
  } catch {
    return null;
  }
};

// Sentence embedding generate karo (duplicate detection + clustering ke liye)
const generateEmbedding = async (text) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/embed`,
      { text },
      { timeout: 10000 }
    );
    return response.data.embedding || [];
  } catch {
    return [];
  }
};