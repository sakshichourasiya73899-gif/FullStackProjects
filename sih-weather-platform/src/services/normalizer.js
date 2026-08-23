import WeatherReport from '../models/WeatherReport.js';

// Every adapter calls this function with raw data + source type.
// This is the single funnel point — one pipeline, many entry points.
export const normalizeAndProcess = async (rawItem, sourceType) => {
  try {
    const normalized = normalize(rawItem, sourceType);

    const validationError = validateNormalized(normalized);
    if (validationError) {
      console.warn(`[Validation failed] ${sourceType}: ${validationError}`);
      return null;
    }

    const report = new WeatherReport(normalized);
    const saved = await report.save();

    console.log(`[Saved] ${sourceType} report: "${saved.text.slice(0, 50)}..."`);
    return saved;
  } catch (err) {
    console.error(`[normalizeAndProcess error] ${sourceType}:`, err.message);
    return null;
  }
};

// Converts raw source-specific shape into common WeatherReport shape
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

// Basic required-field checks before saving
const validateNormalized = (item) => {
  if (!item.text || item.text.length < 5) {
    return 'text missing or too short';
  }
  if (item.text.length > 1000) {
    return 'text too long';
  }
  return null;
};