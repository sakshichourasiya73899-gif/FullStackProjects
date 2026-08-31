import Parser from 'rss-parser';
import cron from 'node-cron';
import { normalizeAndProcess } from '../services/normalizer.js';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

const RSS_FEEDS = [
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', name: 'TOI India' },
  { url: 'https://feeds.feedburner.com/ndtvnews-top-stories', name: 'NDTV Top Stories' },
  { url: 'https://indianexpress.com/feed/', name: 'Indian Express' },
  { url: 'https://www.thehindu.com/news/national/feeder/default.rss', name: 'The Hindu' }
];

const RELEVANT_KEYWORDS = [
  'flood', 'flooding', 'waterlogging', 'waterlogged',
  'rainfall', 'heavy rain', 'moderate rain', 'monsoon', 'cloudburst',
  'thunderstorm', 'lightning', 'hailstorm', 'hail',
  'cyclone', 'cyclonic storm', 'storm surge', 'hurricane',
  'drought', 'water shortage', 'groundwater depletion',
  'heatwave', 'heat wave', 'heat stroke', 'heat alert', 'scorching',
  'cold wave', 'cold snap', 'frost', 'snowfall', 'avalanche', 'freeze',
  'fog alert', 'dense fog', 'visibility reduced',
  'dust storm', 'sandstorm', 'andhi',
  'wildfire', 'forest fire',
  'earthquake', 'tremor', 'seismic', 'landslide', 'mudslide',
  'imd warning', 'imd alert', 'imd forecast', 'imd issues',
  'ndma alert', 'ndrf deployed', 'ndrf teams',
  'river overflow', 'river breach', 'dam overflow', 'reservoir',
  'flash flood', 'urban flood', 'coastal flood',
  'crop damage', 'crop loss', 'agricultural drought',
  'school closed due to', 'relief camp', 'rescue operation',
  'weather warning', 'red alert', 'orange alert', 'yellow alert',
  'evacuated', 'evacuation', 'displaced families',
  'road blocked', 'highway closed', 'bridge damaged',
  'power outage storm', 'electricity disrupted weather'
];

const IRRELEVANT_KEYWORDS = [
  'stock market', 'sensex', 'nifty', 'share price', 'ipo',
  'bollywood', 'box office', 'film review',
  'cricket score', 'ipl', 'world cup cricket',
  'election result', 'exit poll', 'political party',
  'murder', 'rape case', 'arrested', 'court verdict',
  'startup funding', 'quarterly results', 'revenue growth',
  'scholarship exam', 'admission process',
  'recipe', 'fashion week', 'beauty tips',
  'horoscope', 'zodiac sign', 'astrology',
  'relationship advice', 'dating tips',
  'road accident', 'train derailment', 'plane crash'
];

const SKIP_IF_IN_TITLE = [
  // Crime & Legal
  'arrested', 'arrest', 'verdict', 'murder', 'rape', 'bail',
  'accused', 'fir', 'crime', 'criminal', 'convicted', 'sentence',
  'custody', 'chargesheet', 'probe', 'investigation', 'scam', 'fraud',
  'kidnap', 'robbery', 'theft', 'shooting', 'blast',
  'bomb', 'terror', 'militant', 'naxal',
  // Politics
  'election', 'vote', 'voting', 'poll', 'bjp', 'congress', 'parliament',
  'cabinet', 'rally', 'manifesto', 'lok sabha', 'rajya sabha',
  'yojana', 'ordinance', 'bill passed', 'amendment',
  // Sports
  'ipl', 'cricket', 'test match', 'odi', 't20', 'world cup',
  'football', 'fifa', 'hockey', 'badminton', 'tennis',
  'tournament', 'league', 'scorecard', 'wicket',
  // Entertainment
  'bollywood', 'hollywood', 'tollywood',
  'film', 'movie', 'web series', 'ott', 'netflix',
  'box office', 'trailer', 'teaser',
  'actor', 'actress', 'celebrity', 'award',
  // Business
  'stock', 'sensex', 'nifty', 'share price', 'ipo',
  'startup', 'funding', 'revenue', 'profit',
  'quarterly', 'merger', 'acquisition', 'layoff',
  'gdp', 'inflation', 'repo rate', 'tax', 'gst',
  // Lifestyle
  'recipe', 'food review', 'restaurant',
  'fashion', 'beauty', 'skincare', 'makeup',
  'horoscope', 'zodiac', 'astrology',
  'relationship', 'dating', 'wedding',
  'real estate', 'property', 'home loan',
  // Accidents
  'road accident', 'car crash', 'bike accident',
  'train derail', 'plane crash', 'bus accident', 'collision',
  // Education
  'exam result', 'board result', 'cbse', 'upsc', 'jee', 'neet',
  'admission', 'scholarship',
  // Health (non-weather)
  'dengue', 'malaria', 'covid', 'vaccine',
  'surgery', 'cancer', 'diabetes', 'health tips',
  // Technology
  'iphone', 'android', 'smartphone', 'gadget', 'app launch',
  'whatsapp', 'facebook', 'instagram', 'chatgpt', 'cybercrime'
];

const INDIA_KEYWORDS = [
  'india', 'indian', 'delhi', 'mumbai', 'chennai', 'kolkata',
  'bangalore', 'bengaluru', 'hyderabad', 'pune', 'ahmedabad',
  'jaipur', 'lucknow', 'raipur', 'bhopal', 'patna', 'ranchi',
  'bhubaneswar', 'guwahati', 'chandigarh', 'dehradun', 'shimla',
  'srinagar', 'amritsar', 'kochi', 'nagpur', 'surat', 'durg',
  'bilaspur', 'odisha', 'kerala', 'gujarat', 'rajasthan',
  'maharashtra', 'karnataka', 'tamil nadu', 'andhra', 'telangana',
  'uttar pradesh', 'madhya pradesh', 'chhattisgarh', 'jharkhand',
  'bihar', 'west bengal', 'assam', 'punjab', 'haryana',
  'uttarakhand', 'himachal', 'jammu', 'kashmir', 'goa',
  'manipur', 'meghalaya', 'mizoram', 'nagaland', 'tripura', 'sikkim'
];

const isFromIndia = (text) => {
  const lower = text.toLowerCase();
  return INDIA_KEYWORDS.some((kw) => lower.includes(kw));
};

const isWeatherRelevant = (text) => {
  const lower = text.toLowerCase();
  if (IRRELEVANT_KEYWORDS.some((kw) => lower.includes(kw))) return false;
  return RELEVANT_KEYWORDS.some((kw) => lower.includes(kw));
};

// Media extract karo — 4 methods
const extractMedia = (item) => {
  const media = [];

  // Method 1: media:content
  if (item.mediaContent) {
    const contents = Array.isArray(item.mediaContent)
      ? item.mediaContent
      : [item.mediaContent];
    for (const mc of contents) {
      const url = mc?.$?.url || mc?.url;
      if (url && url.startsWith('http')) {
        const isVideo = (mc?.$?.medium || mc?.medium || '') === 'video';
        media.push({ url, type: isVideo ? 'video' : 'image', thumbnailUrl: url });
        if (media.length >= 2) break;
      }
    }
  }

  // Method 2: enclosure
  if (item.enclosure?.url && media.length === 0) {
    const isVideo = item.enclosure.type?.includes('video') || false;
    media.push({
      url: item.enclosure.url,
      type: isVideo ? 'video' : 'image',
      thumbnailUrl: item.enclosure.url
    });
  }

  // Method 3: media:thumbnail
  if (item.mediaThumbnail && media.length === 0) {
    const url = item.mediaThumbnail?.$?.url || item.mediaThumbnail?.url;
    if (url && url.startsWith('http')) {
      media.push({ url, type: 'image', thumbnailUrl: url });
    }
  }

  // Method 4: img tag inside content:encoded
  if (media.length === 0) {
    const htmlContent = item.contentEncoded || item.content || '';
    const imgMatches = [...htmlContent.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
    for (const match of imgMatches) {
      const url = match[1];
      if (url && url.startsWith('http') &&
          !url.includes('pixel') &&
          !url.includes('tracking') &&
          !url.includes('1x1')) {
        media.push({ url, type: 'image', thumbnailUrl: url });
        break;
      }
    }
  }

  return media.slice(0, 3);
};

// City names + coordinates lookup for quick location resolution
const INDIA_CITY_COORDS = {
  'delhi': { city: 'Delhi', state: 'Delhi', lat: 28.61, lng: 77.21 },
  'new delhi': { city: 'Delhi', state: 'Delhi', lat: 28.61, lng: 77.21 },
  'mumbai': { city: 'Mumbai', state: 'Maharashtra', lat: 19.08, lng: 72.88 },
  'bengaluru': { city: 'Bengaluru', state: 'Karnataka', lat: 12.97, lng: 77.59 },
  'bangalore': { city: 'Bengaluru', state: 'Karnataka', lat: 12.97, lng: 77.59 },
  'chennai': { city: 'Chennai', state: 'Tamil Nadu', lat: 13.08, lng: 80.27 },
  'kolkata': { city: 'Kolkata', state: 'West Bengal', lat: 22.57, lng: 88.36 },
  'hyderabad': { city: 'Hyderabad', state: 'Telangana', lat: 17.39, lng: 78.49 },
  'pune': { city: 'Pune', state: 'Maharashtra', lat: 18.52, lng: 73.86 },
  'ahmedabad': { city: 'Ahmedabad', state: 'Gujarat', lat: 23.02, lng: 72.57 },
  'jaipur': { city: 'Jaipur', state: 'Rajasthan', lat: 26.91, lng: 75.79 },
  'lucknow': { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.85, lng: 80.95 },
  'raipur': { city: 'Raipur', state: 'Chhattisgarh', lat: 21.25, lng: 81.63 },
  'durg': { city: 'Durg', state: 'Chhattisgarh', lat: 21.19, lng: 81.28 },
  'bilaspur': { city: 'Bilaspur', state: 'Chhattisgarh', lat: 22.09, lng: 82.14 },
  'bhilai': { city: 'Bhilai', state: 'Chhattisgarh', lat: 21.21, lng: 81.43 },
  'bhopal': { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.26, lng: 77.41 },
  'indore': { city: 'Indore', state: 'Madhya Pradesh', lat: 22.72, lng: 75.86 },
  'nagpur': { city: 'Nagpur', state: 'Maharashtra', lat: 21.15, lng: 79.09 },
  'patna': { city: 'Patna', state: 'Bihar', lat: 25.59, lng: 85.14 },
  'ranchi': { city: 'Ranchi', state: 'Jharkhand', lat: 23.34, lng: 85.31 },
  'bhubaneswar': { city: 'Bhubaneswar', state: 'Odisha', lat: 20.30, lng: 85.82 },
  'guwahati': { city: 'Guwahati', state: 'Assam', lat: 26.14, lng: 91.74 },
  'chandigarh': { city: 'Chandigarh', state: 'Punjab', lat: 30.73, lng: 76.78 },
  'dehradun': { city: 'Dehradun', state: 'Uttarakhand', lat: 30.32, lng: 78.03 },
  'shimla': { city: 'Shimla', state: 'Himachal Pradesh', lat: 31.10, lng: 77.17 },
  'srinagar': { city: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.08, lng: 74.80 },
  'amritsar': { city: 'Amritsar', state: 'Punjab', lat: 31.63, lng: 74.87 },
  'kochi': { city: 'Kochi', state: 'Kerala', lat: 9.93, lng: 76.26 },
  'thiruvananthapuram': { city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.52, lng: 76.94 },
  'trivandrum': { city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.52, lng: 76.94 },
  'coimbatore': { city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.02, lng: 76.96 },
  'visakhapatnam': { city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.69, lng: 83.22 },
  'vizag': { city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.69, lng: 83.22 },
  'surat': { city: 'Surat', state: 'Gujarat', lat: 21.17, lng: 72.83 },
  'varanasi': { city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.32, lng: 82.97 },
  'agra': { city: 'Agra', state: 'Uttar Pradesh', lat: 27.18, lng: 78.01 },
  'kanpur': { city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.47, lng: 80.33 },
  'allahabad': { city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.44, lng: 81.84 },
  'prayagraj': { city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.44, lng: 81.84 },
  'jodhpur': { city: 'Jodhpur', state: 'Rajasthan', lat: 26.29, lng: 73.03 },
  'udaipur': { city: 'Udaipur', state: 'Rajasthan', lat: 24.57, lng: 73.68 },
  'bikaner': { city: 'Bikaner', state: 'Rajasthan', lat: 28.02, lng: 73.31 },
  'jaisalmer': { city: 'Jaisalmer', state: 'Rajasthan', lat: 26.91, lng: 70.91 },
  'ajmer': { city: 'Ajmer', state: 'Rajasthan', lat: 26.45, lng: 74.64 },
  'kota': { city: 'Kota', state: 'Rajasthan', lat: 25.18, lng: 75.83 },
  'surat': { city: 'Surat', state: 'Gujarat', lat: 21.17, lng: 72.83 },
  'vadodara': { city: 'Vadodara', state: 'Gujarat', lat: 22.31, lng: 73.19 },
  'rajkot': { city: 'Rajkot', state: 'Gujarat', lat: 22.30, lng: 70.80 },
  'bhavnagar': { city: 'Bhavnagar', state: 'Gujarat', lat: 21.76, lng: 72.15 },
  'nashik': { city: 'Nashik', state: 'Maharashtra', lat: 19.99, lng: 73.79 },
  'aurangabad': { city: 'Aurangabad', state: 'Maharashtra', lat: 19.88, lng: 75.34 },
  'solapur': { city: 'Solapur', state: 'Maharashtra', lat: 17.69, lng: 75.91 },
  'amravati': { city: 'Amravati', state: 'Maharashtra', lat: 20.93, lng: 77.75 },
  'mysuru': { city: 'Mysuru', state: 'Karnataka', lat: 12.30, lng: 76.64 },
  'mysore': { city: 'Mysuru', state: 'Karnataka', lat: 12.30, lng: 76.64 },
  'mangaluru': { city: 'Mangaluru', state: 'Karnataka', lat: 12.87, lng: 74.84 },
  'hubli': { city: 'Hubli', state: 'Karnataka', lat: 15.36, lng: 75.12 },
  'madurai': { city: 'Madurai', state: 'Tamil Nadu', lat: 9.93, lng: 78.12 },
  'tiruchirappalli': { city: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.79, lng: 78.70 },
  'trichy': { city: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.79, lng: 78.70 },
  'salem': { city: 'Salem', state: 'Tamil Nadu', lat: 11.65, lng: 78.16 },
  'tirunelveli': { city: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.73, lng: 77.70 },
  'vijayawada': { city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.51, lng: 80.62 },
  'guntur': { city: 'Guntur', state: 'Andhra Pradesh', lat: 16.31, lng: 80.44 },
  'nellore': { city: 'Nellore', state: 'Andhra Pradesh', lat: 14.44, lng: 79.99 },
  'warangal': { city: 'Warangal', state: 'Telangana', lat: 18.00, lng: 79.58 },
  'imphal': { city: 'Imphal', state: 'Manipur', lat: 24.82, lng: 93.94 },
  'agartala': { city: 'Agartala', state: 'Tripura', lat: 23.83, lng: 91.28 },
  'kohima': { city: 'Kohima', state: 'Nagaland', lat: 25.67, lng: 94.11 },
  'itanagar': { city: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.08, lng: 93.61 },
  'aizawl': { city: 'Aizawl', state: 'Mizoram', lat: 23.73, lng: 92.72 },
  'shillong': { city: 'Shillong', state: 'Meghalaya', lat: 25.57, lng: 91.88 },
  'gangtok': { city: 'Gangtok', state: 'Sikkim', lat: 27.33, lng: 88.62 },
  'panaji': { city: 'Panaji', state: 'Goa', lat: 15.49, lng: 73.83 },
  'jammu': { city: 'Jammu', state: 'Jammu & Kashmir', lat: 32.74, lng: 74.87 },
  'leh': { city: 'Leh', state: 'Ladakh', lat: 34.16, lng: 77.58 },
  'gorakhpur': { city: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.76, lng: 83.37 },
  'meerut': { city: 'Meerut', state: 'Uttar Pradesh', lat: 28.98, lng: 77.71 },
  'bareilly': { city: 'Bareilly', state: 'Uttar Pradesh', lat: 28.36, lng: 79.41 },
  'aligarh': { city: 'Aligarh', state: 'Uttar Pradesh', lat: 27.88, lng: 78.08 },
  'moradabad': { city: 'Moradabad', state: 'Uttar Pradesh', lat: 28.84, lng: 78.77 },
  'ghaziabad': { city: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.67, lng: 77.45 },
  'noida': { city: 'Noida', state: 'Uttar Pradesh', lat: 28.54, lng: 77.39 },
  'faridabad': { city: 'Faridabad', state: 'Haryana', lat: 28.41, lng: 77.31 },
  'gurugram': { city: 'Gurugram', state: 'Haryana', lat: 28.46, lng: 77.03 },
  'gurgaon': { city: 'Gurugram', state: 'Haryana', lat: 28.46, lng: 77.03 },
  'ludhiana': { city: 'Ludhiana', state: 'Punjab', lat: 30.90, lng: 75.85 },
  'jalandhar': { city: 'Jalandhar', state: 'Punjab', lat: 31.33, lng: 75.58 },
  'jabalpur': { city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.17, lng: 79.94 },
  'gwalior': { city: 'Gwalior', state: 'Madhya Pradesh', lat: 26.22, lng: 78.18 },
  'rewa': { city: 'Rewa', state: 'Madhya Pradesh', lat: 24.53, lng: 81.30 },
  'korba': { city: 'Korba', state: 'Chhattisgarh', lat: 22.35, lng: 82.70 },
  'jagdalpur': { city: 'Jagdalpur', state: 'Chhattisgarh', lat: 19.08, lng: 82.03 },
  'rajnandgaon': { city: 'Rajnandgaon', state: 'Chhattisgarh', lat: 21.10, lng: 81.03 },
  'ambikapur': { city: 'Ambikapur', state: 'Chhattisgarh', lat: 23.12, lng: 83.20 },
  'dhanbad': { city: 'Dhanbad', state: 'Jharkhand', lat: 23.79, lng: 86.43 },
  'jamshedpur': { city: 'Jamshedpur', state: 'Jharkhand', lat: 22.80, lng: 86.20 },
  'bokaro': { city: 'Bokaro', state: 'Jharkhand', lat: 23.67, lng: 86.15 },
  'cuttack': { city: 'Cuttack', state: 'Odisha', lat: 20.47, lng: 85.88 },
  'rourkela': { city: 'Rourkela', state: 'Odisha', lat: 22.23, lng: 84.86 },
  'sambalpur': { city: 'Sambalpur', state: 'Odisha', lat: 21.47, lng: 83.97 },
  'dibrugarh': { city: 'Dibrugarh', state: 'Assam', lat: 27.48, lng: 95.00 },
  'silchar': { city: 'Silchar', state: 'Assam', lat: 24.82, lng: 92.80 },
  'siliguri': { city: 'Siliguri', state: 'West Bengal', lat: 26.72, lng: 88.43 },
  'asansol': { city: 'Asansol', state: 'West Bengal', lat: 23.68, lng: 86.98 },
  'durgapur': { city: 'Durgapur', state: 'West Bengal', lat: 23.55, lng: 87.32 }
};

// Text mein city name search karo aur coordinates return karo
const extractLocationFromText = (text) => {
  const lower = text.toLowerCase();
  for (const [keyword, locationData] of Object.entries(INDIA_CITY_COORDS)) {
    if (lower.includes(keyword)) {
      return locationData;
    }
  }
  return null;
};

const fetchAndProcessFeed = async (feed) => {
  try {
    const parsedFeed = await parser.parseURL(feed.url);
    let savedCount = 0;

    for (const item of parsedFeed.items) {
      const title = item.title || '';
      const snippet = item.contentSnippet || item.summary || '';
      const combinedText = `${title}. ${snippet}`.trim();

      // Article too short — skip
      if (combinedText.length < 50) continue;

      // Title mein irrelevant words check
      if (SKIP_IF_IN_TITLE.some(word => title.toLowerCase().includes(word))) continue;

      // India se hai?
      if (!isFromIndia(combinedText)) continue;

      // Weather relevant hai?
      if (!isWeatherRelevant(combinedText)) continue;

      // Title ya snippet mein weather keyword hona chahiye
      const titleHasWeather = RELEVANT_KEYWORDS.some(kw => title.toLowerCase().includes(kw));
      const snippetHasWeather = RELEVANT_KEYWORDS.some(kw => snippet.toLowerCase().includes(kw));
      if (!titleHasWeather && !snippetHasWeather) continue;

      // Media extract karo
      const media = extractMedia(item);

      // Location extract karo — city name text mein dhoondo
      const locationData = extractLocationFromText(combinedText);

      const rawItem = {
        text: combinedText.slice(0, 500),
        lat: locationData?.lat || null,
        lng: locationData?.lng || null,
        city: locationData?.city || null,
        state: locationData?.state || null,
        media,
        sourceUrl: item.link || null,
        sourceName: feed.name
      };

      await normalizeAndProcess(rawItem, 'news_rss');
      savedCount++;
    }

    console.log(`[newsRssAdapter] ${feed.name}: ${savedCount} relevant articles saved`);
  } catch (err) {
    console.error(`[newsRssAdapter] Failed for ${feed.name}:`, err.message);
  }
};

const pollAllFeeds = async () => {
  console.log(`[newsRssAdapter] Polling ${RSS_FEEDS.length} RSS feeds...`);
  for (const feed of RSS_FEEDS) {
    await fetchAndProcessFeed(feed);
  }
  console.log('[newsRssAdapter] Polling round complete');
};

export const startNewsRssAdapter = () => {
  console.log('[newsRssAdapter] started, polling every 15 minutes');
  pollAllFeeds();
  cron.schedule('*/15 * * * *', pollAllFeeds);
};