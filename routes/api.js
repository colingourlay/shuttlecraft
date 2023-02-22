import express from 'express';
export const router = express.Router();

const notImplemented = (req, res) => {
  console.error(`Attempt to post to API endpoint: "${req.path}"`);
  console.debug(req.body);

  return res.status(501).end();
};

// Accounts
router.post('/v1/accounts/verify_credentials', notImplemented);
router.post('/v1/accounts/update_credentials', notImplemented);
router.post('/v1/accounts/relationships', notImplemented);
router.post('/v1/accounts/familiar_followers', notImplemented);
router.post('/v1/accounts/search', notImplemented);
router.post('/v1/accounts/lookup', notImplemented);
router.post('/v1/accounts/:id', notImplemented);
router.post('/v1/accounts/:id/statuses', notImplemented);
router.post('/v1/accounts/:id/follow', notImplemented);
router.post('/v1/accounts/:id/block', notImplemented);
router.post('/v1/accounts/:id/unblock', notImplemented);
router.post('/v1/accounts/:id/mute', notImplemented);
router.post('/v1/accounts/:id/unmute', notImplemented);
router.post('/v1/accounts/:id/following', notImplemented);
router.post('/v1/accounts/:id/followers', notImplemented);

// Announcements
router.post('/v1/announcements', notImplemented);
router.post('/v1/announcements/:pk/dismiss', notImplemented);

// Apps
router.post('/v1/apps', notImplemented);

// Conversations
router.post('/v1/conversations', notImplemented);

// Custom Emojis
router.post('/v1/custom_emojis', notImplemented);

// Favourites
router.post('/v1/favourites', notImplemented);

// Filters
router.post('/v1/filters', notImplemented);
router.post('/v2/filters', notImplemented);

// Instance
router.post('/v1/instance', notImplemented);
router.post('/v2/instance', notImplemented);

// Media
router.post('/v1/media', notImplemented);
router.post('/v2/media', notImplemented);
router.post('/v1/media/:id', notImplemented);

// Notifications
router.post('/v1/notifications', notImplemented);

// Polls
router.post('/v1/polls/:id', notImplemented);
router.post('/v1/polls/:id/votes', notImplemented);

// Search
router.post('/v2/search', notImplemented);

// Statuses
router.post('/v1/statuses', notImplemented);
router.post('/v1/statuses/:id', notImplemented);
router.post('/v1/statuses/:id/context', notImplemented);
router.post('/v1/statuses/:id/favourite', notImplemented);
router.post('/v1/statuses/:id/unfavourite', notImplemented);
router.post('/v1/statuses/:id/favourited_by', notImplemented);
router.post('/v1/statuses/:id/reblog', notImplemented);
router.post('/v1/statuses/:id/unreblog', notImplemented);
router.post('/v1/statuses/:id/source', notImplemented);

// Timelines
router.post('/v1/timelines/home', notImplemented);
router.post('/v1/timelines/public', notImplemented);
router.post('/v1/timelines/tag/:hashtag', notImplemented);

// Trends
router.post('/v1/trends/links', notImplemented);
router.post('/v1/trends/statuses', notImplemented);
router.post('/v1/trends/tags', notImplemented);
