import Parser from 'rss-parser';
import cron from 'node-cron';
import { normalizeAndProcess } from '../services/normalizer.js';

const parser = new Parser();

// RSS feed URLs — India-focused news sources
const RSS_FEEDS = [
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', name: 'TOI India' },
  { url: 'https://feeds.feedburner.com/ndtvnews-top-stories', name: 'NDTV Top Stories' },
  { url: 'https://indianexpress.com/feed/', name: 'Indian Express' },
  { url: 'http://www.gdacs.org/xml/rss.xml', name: 'GDACS Disaster Alerts' }
  
];

// Keywords to filter only weather/disaster-relevant articles —
// otherwise we'd pull in unrelated news (politics, sports, etc.)
const RELEVANT_KEYWORDS = [
  'flood', 'rain', 'rainfall', 'storm', 'thunderstorm', 'heatwave', 'heat wave',
  'fog', 'dust storm', 'cyclone', 'landslide', 'waterlogging', 'school closed',
  'school shut', 'evacuat', 'disaster', 'weather warning', 'alert issued',
  'river', 'overflow', 'displaced', 'rescue', 'relief camp'
];

const isWeatherRelevant = (text) => {
  const lower = text.toLowerCase();
  return RELEVANT_KEYWORDS.some((keyword) => lower.includes(keyword));
};

// We don't get exact coordinates from news articles, so location stays
// unresolved here — Day 4's location extraction (NER) will fill this in later
const fetchAndProcessFeed = async (feed) => {
  try {
    const parsedFeed = await parser.parseURL(feed.url);

    for (const item of parsedFeed.items) {
      const combinedText = `${item.title || ''}. ${item.contentSnippet || item.summary || ''}`.trim();

      if (!isWeatherRelevant(combinedText)) {
        continue; // skip unrelated news articles
      }

      const rawItem = {
        text: combinedText.slice(0, 500), // keep it reasonably sized
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