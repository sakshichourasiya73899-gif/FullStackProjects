import Parser from 'rss-parser';
import cron from 'node-cron';
import { normalizeAndProcess } from '../services/normalizer.js';

const parser = new Parser();

const RSS_FEEDS = [
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', name: 'TOI India' },
  { url: 'https://feeds.feedburner.com/ndtvnews-top-stories', name: 'NDTV Top Stories' },
  { url: 'https://indianexpress.com/feed/', name: 'Indian Express' },
  { url: 'http://www.gdacs.org/xml/rss.xml', name: 'GDACS Disaster Alerts' }
];

const RELEVANT_KEYWORDS = [
  // Rainy / Monsoon
  'flood', 'rain', 'rainfall', 'monsoon', 'storm', 'thunderstorm',
  'waterlogging', 'cloudburst', 'flash flood', 'river overflow',
  'cyclone', 'landslide', 'mudslide',
  // Winter
  'fog', 'dense fog', 'cold wave', 'cold snap', 'frost', 'freeze',
  'snowfall', 'snow', 'hail', 'hailstorm', 'avalanche', 'sleet',
  'low temperature', 'cold day', 'winter storm', 'hypothermia',
  // Summer / Heat
  'heatwave', 'heat wave', 'scorching', 'heat stroke', 'sun stroke',
  'high temperature', 'hot day', 'dry spell', 'drought', 'water crisis',
  'water shortage', 'heat alert', 'heat index',
  // Spring / Pre-monsoon
  'dust storm', 'dust devil', 'sandstorm', 'strong wind', 'gusty wind',
  'squall', 'nor wester', 'loo', 'pre monsoon', 'pre-monsoon',
  'thundershower', 'lightning',
  // General disaster / alerts
  'wildfire', 'forest fire', 'earthquake', 'tremor', 'seismic',
  'tsunami', 'tidal wave', 'tornado', 'whirlwind',
  'weather warning', 'weather alert', 'red alert', 'orange alert',
  'yellow alert', 'imd warning', 'imd alert', 'ndma alert',
  'disaster alert', 'evacuation', 'relief camp', 'rescue operation',
  // Ground situation
  'school closed', 'school shut', 'road blocked', 'highway closed',
  'bridge damaged', 'power outage', 'electricity cut', 'crop damage',
  'farmer', 'displaced', 'stranded', 'marooned', 'relief fund',
  'affected villages', 'river breach', 'dam overflow', 'reservoir'
];

const IRRELEVANT_KEYWORDS = [
  'ship', 'vessel', 'election', 'politics', 'cricket', 'ipl',
  'match', 'stock market', 'sensex', 'nifty', 'murder', 'crime',
  'arrest', 'court', 'bollywood', 'film', 'movie', 'actor',
  'actress', 'football', 'road accident', 'train accident',
  'plane crash', 'startup', 'funding', 'ipo', 'budget'
];

const INDIA_KEYWORDS = [
  'india', 'indian', 'delhi', 'mumbai', 'chennai', 'kolkata', 'bangalore',
  'bengaluru', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow',
  'raipur', 'bhopal', 'patna', 'ranchi', 'bhubaneswar', 'guwahati',
  'chandigarh', 'dehradun', 'shimla', 'srinagar', 'amritsar', 'kochi',
  'nagpur', 'surat', 'durg', 'bilaspur', 'bhilai', 'korba', 'jagdalpur',
  'odisha', 'kerala', 'gujarat', 'rajasthan', 'maharashtra', 'karnataka',
  'tamil nadu', 'andhra', 'telangana', 'uttar pradesh', 'madhya pradesh',
  'chhattisgarh', 'jharkhand', 'bihar', 'west bengal', 'assam', 'punjab',
  'haryana', 'uttarakhand', 'himachal', 'jammu', 'kashmir', 'manipur',
  'meghalaya', 'mizoram', 'nagaland', 'tripura', 'sikkim', 'goa'
];

// Step 1: India se hai?
const isFromIndia = (text) => {
  const lower = text.toLowerCase();
  return INDIA_KEYWORDS.some((kw) => lower.includes(kw));
};

// Step 2: Weather relevant hai?
const isWeatherRelevant = (text) => {
  const lower = text.toLowerCase();
  const hasIrrelevant = IRRELEVANT_KEYWORDS.some((kw) => lower.includes(kw));
  if (hasIrrelevant) return false;
  return RELEVANT_KEYWORDS.some((kw) => lower.includes(kw));
};

const fetchAndProcessFeed = async (feed) => {
  try {
    const parsedFeed = await parser.parseURL(feed.url);

    for (const item of parsedFeed.items) {
      const combinedText = `${item.title || ''}. ${item.contentSnippet || item.summary || ''}`.trim();

      // Dono checks — pehle India, phir weather
      if (!isFromIndia(combinedText)) continue;
      if (!isWeatherRelevant(combinedText)) continue;

      const rawItem = {
        text: combinedText.slice(0, 500),
        lat: null,
        lng: null,
        media: []
      };

      await normalizeAndProcess(rawItem, 'news_rss');
    }

    console.log(`[newsRssAdapter] Processed feed: ${feed.name}`);
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