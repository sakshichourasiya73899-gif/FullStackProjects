import axios from 'axios';
import cron from 'node-cron';
import { normalizeAndProcess } from '../services/normalizer.js';

// ---- NASA EONET ----
const fetchEonetEvents = async () => {
  try {
    const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events', {
      params: { status: 'open', limit: 50 }
    });

    for (const event of response.data.events) {
      const title = event.title || '';
      
      // Sirf India-related events lo
      const isIndia = title.toLowerCase().includes('india') ||
        title.toLowerCase().includes('indian');
      
      // Coordinates check — India ka bounding box roughly ye hai
      const coords = event.geometry?.[0]?.coordinates;
      const lat = coords ? coords[1] : null;
      const lng = coords ? coords[0] : null;
      const inIndiaBounds = lat && lng &&
        lat >= 8 && lat <= 37 &&
        lng >= 68 && lng <= 98;

      if (!isIndia && !inIndiaBounds) continue; // India se bahar = skip

      const category = event.categories?.[0]?.title || 'Natural Event';
      const rawItem = {
        text: `${category}: ${title}`.slice(0, 500),
        lat,
        lng,
        media: []
      };

      await normalizeAndProcess(rawItem, 'news_rss');
    }
    console.log('[jsonApiAdapter] EONET processed');
  } catch (err) {
    console.error('[jsonApiAdapter] EONET failed:', err.message);
  }
};

// ---- ReliefWeb ----
const fetchReliefWebReports = async () => {
  try {
    const response = await axios.get('https://api.reliefweb.int/v1/reports', {
      params: {
        appname: 'sih-weather-platform',
        filter: JSON.stringify({
          field: 'country',
          value: 'India'
        }),
        limit: 15,
        sort: 'date:desc'
      }
    });

    for (const item of response.data.data) {
      const title = item.fields?.title || '';

      const rawItem = {
        text: title.slice(0, 500),
        lat: null,
        lng: null,
        media: []
      };

      await normalizeAndProcess(rawItem, 'news_rss');
    }

    console.log('[jsonApiAdapter] ReliefWeb processed');
  } catch (err) {
    console.error('[jsonApiAdapter] ReliefWeb failed:', err.message);
  }
};

const pollJsonSources = async () => {
  console.log('[jsonApiAdapter] Polling EONET + ReliefWeb...');
  await fetchEonetEvents();
  await fetchReliefWebReports();
  console.log('[jsonApiAdapter] Polling round complete');
};

export const startJsonApiAdapter = () => {
  console.log('[jsonApiAdapter] started, polling every 20 minutes');
  pollJsonSources();
  cron.schedule('*/20 * * * *', pollJsonSources);
};