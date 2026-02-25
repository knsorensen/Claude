const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

const GOOGLE_API_URL = 'https://www.googleapis.com/customsearch/v1';

const FB_EXCLUDED = new Set([
  'people', 'search', 'profile.php', 'photo', 'video',
  'groups', 'events', 'pages', 'login', 'share', 'sharer',
  'dialog', 'plugins', 'ads',
]);

function parseLinkedinUsername(url) {
  const m = url.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function parseTiktokUsername(url) {
  const m = url.match(/tiktok\.com\/@([a-zA-Z0-9_.]+)/);
  return m ? m[1] : null;
}

function parseFacebookUsername(url) {
  const m = url.match(/facebook\.com\/([a-zA-Z0-9._-]+)/);
  if (!m) return null;
  const seg = m[1].split('?')[0];
  if (FB_EXCLUDED.has(seg)) return null;
  return seg;
}

function parseSnapchatUsername(url) {
  const m = url.match(/snapchat\.com\/add\/([a-zA-Z0-9_.]+)/);
  return m ? m[1] : null;
}

async function googleSearch(query) {
  const key = process.env.GOOGLE_API_KEY;
  const cx  = process.env.GOOGLE_CSE_ID;
  const url = `${GOOGLE_API_URL}?key=${key}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`;
  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!r.ok) return [];
  const data = await r.json();
  return data.items || [];
}

// GET /api/persons/search?q=<name or @username>&municipality=<city>
router.get('/search', async (req, res) => {
  const { q, municipality } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  const query  = q.trim();
  const isUser = query.startsWith('@');
  const handle = isUser ? query.slice(1) : query;
  const loc    = municipality?.trim() || '';
  const withLoc = loc ? `${handle} ${loc}` : handle;

  const googleEnabled = !!(process.env.GOOGLE_API_KEY && process.env.GOOGLE_CSE_ID);

  const platforms = {
    facebook: {
      name:            'Facebook',
      color:           '#1877F2',
      search_url:      `https://www.facebook.com/search/people/?q=${encodeURIComponent(withLoc)}`,
      profile_url:     isUser ? `https://www.facebook.com/${handle}` : null,
      profile:         null,
      google_profiles: [],
    },
    linkedin: {
      name:            'LinkedIn',
      color:           '#0A66C2',
      search_url:      `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(withLoc)}`,
      profile_url:     isUser ? `https://www.linkedin.com/in/${handle}` : null,
      profile:         null,
      google_profiles: [],
    },
    tiktok: {
      name:            'TikTok',
      color:           '#010101',
      search_url:      `https://www.tiktok.com/search?q=${encodeURIComponent(handle)}`,
      profile_url:     isUser ? `https://www.tiktok.com/@${handle}` : null,
      profile:         null,
      google_profiles: [],
    },
    snapchat: {
      name:            'Snapchat',
      color:           '#FFFC00',
      search_url:      null,
      profile_url:     isUser ? `https://www.snapchat.com/add/${handle}` : null,
      profile:         null,
      google_profiles: [],
    },
  };

  // @username path: fetch TikTok oEmbed only
  if (isUser) {
    try {
      const r = await fetch(
        `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${encodeURIComponent(handle)}`,
        { headers: { Accept: 'application/json' } }
      );
      if (r.ok) {
        const d = await r.json();
        platforms.tiktok.profile = {
          display_name: d.author_name   || null,
          url:          d.author_url    || null,
          thumbnail:    d.thumbnail_url || null,
        };
      }
    } catch (_) {}
  }

  // Name search path: run 4 parallel Google searches
  if (!isUser && googleEnabled) {
    const quoted  = `"${handle}"`;
    const locPart = loc ? ` ${loc}` : '';

    const [fbR, liR, ttR, scR] = await Promise.allSettled([
      googleSearch(`${quoted}${locPart} site:facebook.com`),
      googleSearch(`${quoted}${locPart} site:linkedin.com/in`),
      googleSearch(`${quoted} site:tiktok.com`),
      googleSearch(`${quoted} site:snapchat.com/add`),
    ]);

    const val = r => (r.status === 'fulfilled' ? r.value : []);

    for (const item of val(fbR)) {
      const username = parseFacebookUsername(item.link);
      if (username) platforms.facebook.google_profiles.push({ username, title: item.title || null, snippet: item.snippet || null, url: item.link });
    }

    for (const item of val(liR)) {
      const username = parseLinkedinUsername(item.link);
      if (username) platforms.linkedin.google_profiles.push({ username, title: item.title || null, snippet: item.snippet || null, url: item.link });
    }

    for (const item of val(ttR)) {
      const username = parseTiktokUsername(item.link);
      if (username) platforms.tiktok.google_profiles.push({ username, title: item.title || null, snippet: item.snippet || null, url: item.link });
    }

    for (const item of val(scR)) {
      const username = parseSnapchatUsername(item.link);
      if (username) platforms.snapchat.google_profiles.push({ username, title: item.title || null, snippet: item.snippet || null, url: item.link });
    }

    // Set top profile_url from Google results
    if (platforms.facebook.google_profiles.length)
      platforms.facebook.profile_url = platforms.facebook.google_profiles[0].url;
    if (platforms.linkedin.google_profiles.length)
      platforms.linkedin.profile_url = platforms.linkedin.google_profiles[0].url;
    if (platforms.tiktok.google_profiles.length)
      platforms.tiktok.profile_url = platforms.tiktok.google_profiles[0].url;
    if (platforms.snapchat.google_profiles.length)
      platforms.snapchat.profile_url = platforms.snapchat.google_profiles[0].url;

    // Fetch TikTok oEmbed for the top Google-found TikTok username
    if (platforms.tiktok.google_profiles.length) {
      const topUser = platforms.tiktok.google_profiles[0].username;
      try {
        const r = await fetch(
          `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${encodeURIComponent(topUser)}`,
          { headers: { Accept: 'application/json' } }
        );
        if (r.ok) {
          const d = await r.json();
          platforms.tiktok.profile = {
            display_name: d.author_name   || null,
            url:          d.author_url    || null,
            thumbnail:    d.thumbnail_url || null,
          };
        }
      } catch (_) {}
    }
  }

  res.json({ query, municipality: loc || null, is_username: isUser, google_enabled: googleEnabled, platforms });
});

module.exports = router;
