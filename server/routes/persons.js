const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

// GET /api/persons/search?q=<name or @username>&municipality=<city>
router.get('/search', async (req, res) => {
  const { q, municipality } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  const query   = q.trim();
  const isUser  = query.startsWith('@');
  const handle  = isUser ? query.slice(1) : query;
  const loc     = municipality?.trim() || '';
  const withLoc = loc ? `${handle} ${loc}` : handle;

  const platforms = {
    facebook: {
      name:        'Facebook',
      color:       '#1877F2',
      search_url:  `https://www.facebook.com/search/people/?q=${encodeURIComponent(withLoc)}`,
      profile_url: isUser ? `https://www.facebook.com/${handle}` : null,
      profile:     null,
    },
    linkedin: {
      name:        'LinkedIn',
      color:       '#0A66C2',
      search_url:  `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(withLoc)}`,
      profile_url: isUser ? `https://www.linkedin.com/in/${handle}` : null,
      profile:     null,
    },
    tiktok: {
      name:        'TikTok',
      color:       '#010101',
      search_url:  `https://www.tiktok.com/search?q=${encodeURIComponent(handle)}`,
      profile_url: isUser ? `https://www.tiktok.com/@${handle}` : null,
      profile:     null,
    },
    snapchat: {
      name:        'Snapchat',
      color:       '#FFFC00',
      search_url:  null,
      profile_url: isUser ? `https://www.snapchat.com/add/${handle}` : null,
      profile:     null,
    },
  };

  // Fetch TikTok oEmbed profile data when a @username is given
  if (isUser && handle) {
    try {
      const r = await fetch(
        `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${encodeURIComponent(handle)}`,
        { headers: { Accept: 'application/json' } }
      );
      if (r.ok) {
        const d = await r.json();
        platforms.tiktok.profile = {
          display_name: d.author_name || null,
          url:          d.author_url  || null,
          thumbnail:    d.thumbnail_url || null,
        };
      }
    } catch (_) { /* non-fatal */ }
  }

  res.json({ query, municipality: loc || null, is_username: isUser, platforms });
});

module.exports = router;
