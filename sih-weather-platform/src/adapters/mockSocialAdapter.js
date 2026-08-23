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
  { name: 'Delhi', lat: 28.61, lng: 77.21 },
  { name: 'Mumbai', lat: 19.08, lng: 72.88 },
  { name: 'Bengaluru', lat: 12.97, lng: 77.59 },
  { name: 'Chennai', lat: 13.08, lng: 80.27 },
  { name: 'Kolkata', lat: 22.57, lng: 88.36 },
  { name: 'Hyderabad', lat: 17.39, lng: 78.49 },
  { name: 'Pune', lat: 18.52, lng: 73.86 },
  { name: 'Ahmedabad', lat: 23.02, lng: 72.57 },
  { name: 'Jaipur', lat: 26.91, lng: 75.79 },
  { name: 'Lucknow', lat: 26.85, lng: 80.95 },
  { name: 'Raipur', lat: 21.25, lng: 81.63 },
  { name: 'Durg', lat: 21.19, lng: 81.28 },
  { name: 'Bilaspur', lat: 22.09, lng: 82.14 },
  { name: 'Bhopal', lat: 23.26, lng: 77.41 },
  { name: 'Indore', lat: 22.72, lng: 75.86 },
  { name: 'Nagpur', lat: 21.15, lng: 79.09 },
  { name: 'Patna', lat: 25.59, lng: 85.14 },
  { name: 'Ranchi', lat: 23.34, lng: 85.31 },
  { name: 'Bhubaneswar', lat: 20.30, lng: 85.82 },
  { name: 'Guwahati', lat: 26.14, lng: 91.74 },
  { name: 'Chandigarh', lat: 30.73, lng: 76.78 },
  { name: 'Dehradun', lat: 30.32, lng: 78.03 },
  { name: 'Shimla', lat: 31.10, lng: 77.17 },
  { name: 'Srinagar', lat: 34.08, lng: 74.80 },
  { name: 'Amritsar', lat: 31.63, lng: 74.87 },
  { name: 'Kochi', lat: 9.93, lng: 76.26 },
  { name: 'Thiruvananthapuram', lat: 8.52, lng: 76.94 },
  { name: 'Coimbatore', lat: 11.02, lng: 76.96 },
  { name: 'Visakhapatnam', lat: 17.69, lng: 83.22 },
  { name: 'Surat', lat: 21.17, lng: 72.83 }
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

export const startMockSocialAdapter = (intervalMs = 15000) => {
  console.log(`[mockSocialAdapter] started, generating a post every ${intervalMs / 1000}s`);

  setInterval(async () => {
    const rawItem = generateFakePost();
    await normalizeAndProcess(rawItem, 'social_mock');
  }, intervalMs);
};