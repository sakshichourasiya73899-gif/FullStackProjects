import axios from 'axios';

// Groq se event ka human-readable summary generate karta hai
export const generateEventSummary = async (event, recentReports) => {
  try {
    const reportTexts = recentReports
      .slice(0, 10) // sirf top 10 reports use karo
      .map((r, i) => `${i + 1}. [${r.source?.type || r.sourceType}] ${r.text}`)
      .join('\n');

    const prompt = `You are an AI assistant for a disaster management system in India.

Based on these ${recentReports.length} reports about a ${event.eventType} event near ${event.location?.city || 'unknown location'}:

${reportTexts}

Write a 2-3 sentence factual summary that an emergency officer can read quickly. 
Focus on: what is happening, where, and how severe it appears.
Be concise and factual. Do not add warnings or recommendations.`;

    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/summarize`,
      { prompt }
    );

    return response.data.summary || null;
  } catch (err) {
    console.error('[Summarization] Failed:', err.message);
    return null;
  }
};

// Auto title generate karta hai
export const generateEventTitle = (eventType, city) => {
  const titles = {
    flood: `Urban Flooding`,
    rainfall: `Heavy Rainfall`,
    thunderstorm: `Thunderstorm`,
    heatwave: `Heatwave`,
    fog: `Dense Fog`,
    dust_storm: `Dust Storm`,
    strong_wind: `Strong Wind`,
    wildfire: `Wildfire`,
    drought: `Drought`,
    other: `Weather Event`
  };
  const base = titles[eventType] || 'Weather Event';
  return city ? `${base} in ${city}` : base;
};