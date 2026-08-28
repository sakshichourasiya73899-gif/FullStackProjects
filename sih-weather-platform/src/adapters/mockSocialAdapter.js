import { normalizeAndProcess } from '../services/normalizer.js';

const templates = [
  {
  text: 'Heavy rain causing severe waterlogging in Nagpur',
  event: 'flood'
},

{
  text: 'Roads flooded near Nagpur railway station after continuous rainfall',
  event: 'flood'
},

{
  text: 'Water entering homes in low-lying areas of Nagpur',
  event: 'flood'
},

{
  text: 'Traffic disrupted as several roads remain submerged in Nagpur',
  event: 'flood'
},

{
  text: 'Citizens reporting severe waterlogging across parts of Nagpur',
  event: 'flood'
},

{
  text: 'Vehicles stranded due to flooding near Nagpur railway station',
  event: 'flood'
},

{
  text: 'Heavy rainfall has caused major waterlogging in Nagpur streets',
  event: 'flood'
},

{
  text: 'Several residential areas in Nagpur facing flooding after intense rain',
  event: 'flood'
},




  // Rainy / Flood
  { text: 'Heavy waterlogging reported near {city} railway station', event: 'flood' },
  { text: 'Continuous drizzle since morning in {city}', event: 'rainfall' },
  { text: 'Loud thunder and lightning strikes over {city}', event: 'thunderstorm' },
  
  // Summer / Heat
  { text: 'Unbearable heat today, feels like 45+ in {city}', event: 'heatwave' },
  { text: 'Heat stroke cases reported in {city} hospitals today', event: 'heatwave' },
  { text: 'Severe drought conditions in {city}, water shortage worsening', event: 'heatwave' },
  { text: 'Water supply cut in {city} due to dry spell', event: 'heatwave' },
  
  // Winter
  { text: 'Dense fog reducing visibility on {city} highway', event: 'fog' },
  { text: 'Cold wave hits {city}, temperature drops sharply', event: 'fog' },
  { text: 'Heavy snowfall reported in {city}, roads blocked', event: 'fog' },
  { text: 'Schools closed in {city} due to cold wave alert', event: 'fog' },
  { text: 'Hailstorm damages crops near {city}', event: 'thunderstorm' },
  
  // Spring / Pre-monsoon
  { text: 'Dust storm hit {city}, sky turned orange', event: 'dust_storm' },
  { text: 'Strong winds uprooted trees near {city} market', event: 'strong_wind' },
  { text: 'Loo winds making life difficult in {city}', event: 'heatwave' },
  { text: 'Squall hits {city}, power lines damaged', event: 'strong_wind' },
  
  // Ground situation
  { text: 'River water level rising near {city}, villages on alert', event: 'flood' },
  { text: 'Bridge damaged in {city} due to floods, traffic stopped', event: 'flood' },
  { text: 'Crop damage reported in {city} district due to unseasonal rain', event: 'rainfall' },
  { text: 'Farmers in {city} worried as drought continues', event: 'heatwave' },
  { text: 'Relief camps set up in {city} for flood victims', event: 'flood' },
  { text: 'Rescue teams deployed in {city} after landslide', event: 'flood' },
  { text: 'Road blocked in {city} due to fallen trees after storm', event: 'strong_wind' },
  { text: 'Power outage in {city} due to thunderstorm', event: 'thunderstorm' },
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