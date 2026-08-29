import axios from 'axios';

const CITY_LOOKUP = {
  '28.61,77.21': { city: 'Delhi', state: 'Delhi' },
  '19.08,72.88': { city: 'Mumbai', state: 'Maharashtra' },
  '12.97,77.59': { city: 'Bengaluru', state: 'Karnataka' },
  '13.08,80.27': { city: 'Chennai', state: 'Tamil Nadu' },
  '22.57,88.36': { city: 'Kolkata', state: 'West Bengal' },
  '17.39,78.49': { city: 'Hyderabad', state: 'Telangana' },
  '18.52,73.86': { city: 'Pune', state: 'Maharashtra' },
  '23.02,72.57': { city: 'Ahmedabad', state: 'Gujarat' },
  '26.91,75.79': { city: 'Jaipur', state: 'Rajasthan' },
  '26.85,80.95': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '21.25,81.63': { city: 'Raipur', state: 'Chhattisgarh' },
  '21.19,81.28': { city: 'Durg', state: 'Chhattisgarh' },
  '22.09,82.14': { city: 'Bilaspur', state: 'Chhattisgarh' },
  '23.26,77.41': { city: 'Bhopal', state: 'Madhya Pradesh' },
  '22.72,75.86': { city: 'Indore', state: 'Madhya Pradesh' },
  '21.15,79.09': { city: 'Nagpur', state: 'Maharashtra' },
  '25.59,85.14': { city: 'Patna', state: 'Bihar' },
  '23.34,85.31': { city: 'Ranchi', state: 'Jharkhand' },
  '20.30,85.82': { city: 'Bhubaneswar', state: 'Odisha' },
  '26.14,91.74': { city: 'Guwahati', state: 'Assam' },
  '30.73,76.78': { city: 'Chandigarh', state: 'Punjab' },
  '30.32,78.03': { city: 'Dehradun', state: 'Uttarakhand' },
  '31.10,77.17': { city: 'Shimla', state: 'Himachal Pradesh' },
  '34.08,74.80': { city: 'Srinagar', state: 'Jammu & Kashmir' },
  '31.63,74.87': { city: 'Amritsar', state: 'Punjab' },
  '9.93,76.26': { city: 'Kochi', state: 'Kerala' },
  '8.52,76.94': { city: 'Thiruvananthapuram', state: 'Kerala' },
  '11.02,76.96': { city: 'Coimbatore', state: 'Tamil Nadu' },
  '17.69,83.22': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  '21.17,72.83': { city: 'Surat', state: 'Gujarat' },
  '21.21,81.43': { city: 'Bhilai', state: 'Chhattisgarh' },
  '22.09,82.14': { city: 'Bilaspur', state: 'Chhattisgarh' }
};

const findNearestCity = (lat, lng) => {
  let nearest = null;
  let minDistance = Infinity;

  for (const [key, value] of Object.entries(CITY_LOOKUP)) {
    const [clat, clng] = key.split(',').map(Number);
    const dist = Math.sqrt(Math.pow(lat - clat, 2) + Math.pow(lng - clng, 2));
    if (dist < minDistance) {
      minDistance = dist;
      nearest = value;
    }
  }

  return minDistance < 0.5 ? nearest : null;
};

const reverseGeocodeNominatim = async (lat, lng) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { lat, lon: lng, format: 'json' },
      headers: { 'User-Agent': 'SIH-Weather-Platform/1.0' },
      timeout: 3000
    });
    const addr = response.data.address;
    return {
      city: addr.city || addr.town || addr.village || addr.county || 'Unknown',
      state: addr.state || 'Unknown'
    };
  } catch {
    return null;
  }
};

export const resolveLocation = async (lat, lng) => {
  if (!lat || !lng) return { city: null, state: null };
  const fromLookup = findNearestCity(lat, lng);
  if (fromLookup) return fromLookup;
  return await reverseGeocodeNominatim(lat, lng) || { city: null, state: null };
};