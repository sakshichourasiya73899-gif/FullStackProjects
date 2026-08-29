// import axios from 'axios';

// export const generateEventSummary = async (event, recentReports) => {
//   try {
//     const reportTexts = recentReports
//       .slice(0, 8)
//       .map((r, i) => `${i + 1}. [${r.source?.type || r.sourceType}] ${r.text}`)
//       .join('\n');

//     const city = event.location?.city || 'unknown location';
//     const prompt = `You are an AI assistant for a disaster management system in India.

// Based on these reports about a ${event.eventType} event near ${city}:

// ${reportTexts}

// Write a 2-3 sentence factual summary that an emergency officer can read quickly.
// Focus on: what is happening, where, and impact on people.
// Be concise and factual. No warnings or recommendations.`;

//     const response = await axios.post(
//       `${process.env.PYTHON_AI_URL}/summarize`,
//       { prompt }
//     );

//     return response.data.summary || null;
//   } catch (err) {
//     console.error('[Summarization] Failed:', err.message);
//     return null;
//   }
// };

// export const generateEventTitle = (eventType, city) => {
//   const titles = {
//     flood: 'Urban Flooding',
//     rainfall: 'Heavy Rainfall',
//     thunderstorm: 'Thunderstorm',
//     heatwave: 'Heatwave',
//     fog: 'Dense Fog',
//     dust_storm: 'Dust Storm',
//     strong_wind: 'Strong Wind',
//     wildfire: 'Wildfire',
//     drought: 'Drought',
//     cyclone: 'Cyclone',
//     cold_wave: 'Cold Wave',
//     other: 'Weather Event'
//   };
//   const base = titles[eventType] || 'Weather Event';

//   return city ? `${base} in ${city}` : base;
// };



import axios from 'axios';

export const generateEventSummary = async (event, recentReports) => {
  // Pehle Groq try karo
  try {
    const reportTexts = recentReports
      .slice(0, 6)
      .map((r, i) => `${i + 1}. [${r.source?.type || r.sourceType}] ${r.text}`)
      .join('\n');

    const city = event.location?.city || 'the affected area';
    const prompt = `You are an AI assistant for India's disaster management system.

Based on these ${recentReports.length} reports about a ${event.eventType} event near ${city}:

${reportTexts}

Write a 2-3 sentence factual summary for emergency officers.
Focus on: what is happening, where, and impact on people.
Be factual and concise. No warnings or recommendations.`;

    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/summarize`,
      { prompt },
      { timeout: 5000 }
    );

    if (response.data.summary) return response.data.summary;
  } catch (err) {
    console.error('[Summarization] Groq failed, using rule-based:', err.message);
  }

  // Groq fail ho toh rule-based fallback
  return generateRuleBasedSummary(event, recentReports);
};

// Groq ke bina bhi decent summary ban jaati hai
const generateRuleBasedSummary = (event, reports) => {
  const city = event.location?.city || 'the affected area';
  const state = event.location?.state ? `, ${event.location.state}` : '';
  const count = reports.length;
  const sources = [...new Set(reports.map(r => r.source?.type || r.sourceType))];
  const eventName = event.eventType?.replace('_', ' ') || 'weather event';
  const severity = event.severity || 'low';

  const sourceDesc = sources.length >= 3
    ? 'multiple independent sources including citizens, social media, and news'
    : sources.length === 2
    ? `${sources[0]} and ${sources[1]}`
    : sources[0] || 'local sources';

  const severityDesc = severity === 'high'
    ? 'Significant impact on people and infrastructure has been reported.'
    : severity === 'medium'
    ? 'Moderate disruption to normal life has been reported.'
    : 'Limited impact reported so far, situation being monitored.';

  return `${count} report${count > 1 ? 's' : ''} indicate ${eventName} conditions in ${city}${state}, reported by ${sourceDesc}. ${severityDesc} The event was first reported at ${new Date(event.firstReportedAt).toLocaleTimeString('en-IN')} and is currently ${event.status}.`;
};

export const generateEventTitle = (eventType, city) => {
  const titles = {
    flood: 'Urban Flooding',
    rainfall: 'Heavy Rainfall',
    thunderstorm: 'Thunderstorm',
    heatwave: 'Heatwave',
    fog: 'Dense Fog',
    dust_storm: 'Dust Storm',
    strong_wind: 'Strong Wind',
    wildfire: 'Wildfire',
    drought: 'Drought',
    cyclone: 'Cyclone',
    cold_wave: 'Cold Wave',
    other: 'Weather Event'
  };
  const base = titles[eventType] || 'Weather Event';
  return city ? `${base} in ${city}` : base;
};