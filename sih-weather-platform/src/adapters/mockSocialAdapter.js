import { normalizeAndProcess } from '../services/normalizer.js';

const templates = [
  { text: 'Heavy waterlogging reported near {city} railway station', event: 'flood' },
  { text: 'Continuous drizzle since morning in {city}', event: 'rainfall' },
  { text: 'Loud thunder and lightning strikes over {city}', event: 'thunderstorm' },
  { text: 'Unbearable heat today, feels like 45+ in {city}', event: 'heatwave' },
  { text: 'Dense fog reducing visibility on {city} highway', event: 'fog' },
  { text: 'Dust storm hit {city}, sky turned orange', event: 'dust_storm' },
  { text: 'Strong winds uprooted trees near {city} market', event: 'strong_wind' }
];

const cities = [
  { name: 'Durg', lat: 21.19, lng: 81.28 },
  { name: 'Raipur', lat: 21.25, lng: 81.63 },
  { name: 'Bilaspur', lat: 22.09, lng: 82.14 },
  { name: 'Bhilai', lat: 21.21, lng: 81.43 },
  { name: 'Nagpur', lat: 21.15, lng: 79.09 }
];

const generateFakePost = () => {
  const template = templates[Math.floor(Math.random() * templates.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const jitter = () => (Math.random() - 0.5) * 0.05;

  return {
    text: template.text.replace('{city}', city.name),
    lat: city.lat + jitter(),
    lng: city.lng + jitter(),
    media: []
  };
};

// Call this once from server.js to start the mock generator
export const startMockSocialAdapter = (intervalMs = 15000) => {
  console.log(`[mockSocialAdapter] started, generating a post every ${intervalMs / 1000}s`);

  setInterval(async () => {
    const rawItem = generateFakePost();
    await normalizeAndProcess(rawItem, 'social_mock');
  }, intervalMs);
};