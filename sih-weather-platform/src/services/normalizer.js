import axios from 'axios';
import WeatherReport from '../models/WeatherReport.js';

export const normalizeAndProcess = async (rawItem, sourceType) => {
  try {
    const normalized = normalize(rawItem, sourceType);

    const validationError = validateNormalized(normalized);
    if (validationError) {
      console.warn(`[Validation failed] ${sourceType}: ${validationError}`);
      return null;
    }

    // Sirf news_rss aur social sources ko Groq se relevance check karwao
    // (weather_api hamesha genuinely weather related hota hai, skip check)
    if (sourceType === 'news_rss' || sourceType === 'social_mock') {
      const relevant = await checkRelevance(normalized.text);
      if (!relevant) {
        console.log(`[Groq Filter] Skipped: "${normalized.text.slice(0, 50)}..."`);
        return null;
      }
    }

    // Python AI service ko call karo — classify + credibility + severity
    const aiResult = await callAIService(normalized, sourceType);

    if (aiResult) {
      normalized.eventType = aiResult.eventType;
      normalized.credibilityScore = aiResult.credibilityScore;
      normalized.credibilityReasons = aiResult.credibilityReasons;
      normalized.severity = aiResult.severity;
      normalized.processedByAI = true;
    }

    const report = new WeatherReport(normalized);
    const saved = await report.save();

    console.log(`[Saved] ${sourceType} | ${saved.eventType} | ${saved.severity} | "${saved.text.slice(0, 40)}..."`);
    return saved;
  } catch (err) {
    console.error(`[normalizeAndProcess error] ${sourceType}:`, err.message);
    return null;
  }
};

const normalize = (rawItem, sourceType) => {
  return {
    text: rawItem.text?.trim() || '',
    sourceType,
    location: {
      lat: rawItem.lat || null,
      lng: rawItem.lng || null,
      resolved: !!(rawItem.lat && rawItem.lng)
    },
    media: rawItem.media || [],
    processedByAI: false
  };
};

const validateNormalized = (item) => {
  if (!item.text || item.text.length < 5) return 'text missing or too short';
  if (item.text.length > 1000) return 'text too long';
  return null;
};

// Groq se puchta hai — "ye India weather/disaster related hai?"
const checkRelevance = async (text) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/is-relevant`,
      { text }
    );
    return response.data.relevant;
  } catch (err) {
    console.error(`[Relevance check error] ${err.message} — including by default`);
    return true; // fail-safe: error aaye toh include karo, drop mat karo
  }
};

// Python classifier ko call karta hai — eventType, credibility, severity
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
    console.error(`[AI service error] ${err.message} — saving without AI fields`);
    return null;
  }
};