import axios from 'axios';
import cron from 'node-cron';
import { normalizeAndProcess } from '../services/normalizer.js';

const SUBREDDITS = ['india', 'IndiaSpeaks'];
const SEARCH_KEYWORDS = 'flood OR rain OR heatwave OR thunderstorm OR fog OR "dust storm" OR cyclone';

let cachedToken = null;
let tokenExpiresAt = 0;

// Gets an app-level access token (no user login needed, just app credentials)
const getRedditToken = async () => {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken; // reuse token until it expires
  }

  const response = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    'grant_type=client_credentials',
    {
      auth: {
        username: process.env.REDDIT_CLIENT_ID,
        password: process.env.REDDIT_CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': process.env.REDDIT_USER_AGENT
      }
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000; // refresh 1 min early
  return cachedToken;
};

const fetchSubredditPosts = async (subreddit, token) => {
  try {
    const response = await axios.get(
      `https://oauth.reddit.com/r/${subreddit}/search`,
      {
        params: {
          q: SEARCH_KEYWORDS,
          restrict_sr: true,
          sort: 'new',
          limit: 10,
          t: 'day'
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': process.env.REDDIT_USER_AGENT
        }
      }
    );

    const posts = response.data.data.children;

    for (const post of posts) {
      const title = post.data.title || '';
      const selftext = post.data.selftext || '';
      const combinedText = `${title}. ${selftext}`.trim().slice(0, 500);

      const rawItem = {
        text: combinedText,
        lat: null,
        lng: null,
        media: []
      };

      await normalizeAndProcess(rawItem, 'social_mock'); // treated as social-source bucket
    }

    console.log(`[redditAdapter] Processed r/${subreddit}`);
  } catch (err) {
    console.error(`[redditAdapter] Failed for r/${subreddit}:`, err.message);
  }
};

const pollReddit = async () => {
  try {
    console.log('[redditAdapter] Polling subreddits...');
    const token = await getRedditToken();

    for (const subreddit of SUBREDDITS) {
      await fetchSubredditPosts(subreddit, token);
    }

    console.log('[redditAdapter] Polling round complete');
  } catch (err) {
    console.error('[redditAdapter] Failed to get token or poll:', err.message);
  }
};

export const startRedditAdapter = () => {
  console.log('[redditAdapter] started, polling every 20 minutes');
  pollReddit();
  cron.schedule('*/20 * * * *', pollReddit);
};