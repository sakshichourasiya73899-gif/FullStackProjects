import Parser from 'rss-parser';
import cron from 'node-cron';
import { normalizeAndProcess } from '../services/normalizer.js';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'media:content']]
  }
});

const RSS_FEEDS = [
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', name: 'TOI India' },
  { url: 'https://feeds.feedburner.com/ndtvnews-top-stories', name: 'NDTV Top Stories' },
  { url: 'https://indianexpress.com/feed/', name: 'Indian Express' }
];

const RELEVANT_KEYWORDS = [
  'flood', 'rain', 'rainfall', 'monsoon', 'storm', 'thunderstorm',
  'waterlogging', 'cloudburst', 'flash flood', 'river overflow',
  'cyclone', 'landslide', 'mudslide',
  'fog', 'dense fog', 'cold wave', 'cold snap', 'frost', 'freeze',
  'snowfall', 'snow', 'hail', 'hailstorm', 'avalanche', 'sleet',
  'low temperature', 'cold day', 'winter storm', 'hypothermia',
  'heatwave', 'heat wave', 'scorching', 'heat stroke', 'sun stroke',
  'high temperature', 'hot day', 'dry spell', 'drought', 'water crisis',
  'water shortage', 'heat alert', 'heat index',
  'dust storm', 'dust devil', 'sandstorm', 'strong wind', 'gusty wind',
  'squall', 'nor wester', 'loo', 'pre monsoon', 'pre-monsoon',
  'thundershower', 'lightning',
  'wildfire', 'forest fire', 'earthquake', 'tremor', 'seismic',
  'tsunami', 'tidal wave', 'tornado', 'whirlwind',
  'weather warning', 'weather alert', 'red alert', 'orange alert',
  'yellow alert', 'imd warning', 'imd alert', 'ndma alert',
  'disaster alert', 'evacuation', 'relief camp', 'rescue operation',
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

const isFromIndia = (text) => {
  const lower = text.toLowerCase();
  return INDIA_KEYWORDS.some((kw) => lower.includes(kw));
};

const isWeatherRelevant = (text) => {
  const lower = text.toLowerCase();
  if (IRRELEVANT_KEYWORDS.some((kw) => lower.includes(kw))) return false;
  return RELEVANT_KEYWORDS.some((kw) => lower.includes(kw));
};

const fetchAndProcessFeed = async (feed) => {
  try {
    const parsedFeed = await parser.parseURL(feed.url);

    for (const item of parsedFeed.items) {
      const combinedText = `${item.title || ''}. ${item.contentSnippet || item.summary || ''}`.trim();

      if (!isFromIndia(combinedText)) continue;
      if (!isWeatherRelevant(combinedText)) continue;

      // Media extract karo
      const media = [];
      if (item.enclosure?.url) {
        media.push({ url: item.enclosure.url, type: 'image' });
      }
      if (item['media:content']?.url) {
        media.push({ url: item['media:content'].url, type: 'image' });
      }
      if (media.length === 0 && item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) media.push({ url: imgMatch[1], type: 'image' });
      }

      const rawItem = {
        text: combinedText.slice(0, 500),
        lat: null,
        lng: null,
        media,
        sourceUrl: item.link || null,
        sourceName: feed.name
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