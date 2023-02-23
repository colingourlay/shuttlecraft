import debug from 'debug';
import express from 'express';
import { getAccountForMastodonAPI, createNote } from '../lib/account.js';
import { createApplication, getApplicationForAuthorizedAccessToken } from '../lib/applications.js';
import { getInstanceForMastodonAPI } from '../lib/instance.js';
import { isAccessTokenAuthorized } from '../lib/tokens.js';

const logger = debug('ono:api');

const logRequest = req => {
  logger(`Attempt to ${req.method} to API endpoint: "${req.path}"`);

  logger('[headers]', req.headers);

  if (req.method === 'GET') {
    logger('[query]', req.query);
  } else if (req.method === 'POST') {
    logger('[body]', req.body);
  }
};

const notImplemented = (req, res) => {
  logRequest(req);

  return res.sendStatus(501);
};

const notFound = (req, res) => {
  logRequest(req);

  return res.sendStatus(400);
};

const parseAccessToken = req => {
  const authorization = req.headers.authorization || '';
  const [, accessToken] = authorization.split(' ');

  return accessToken;
};

const authorize = (req, res, next) => {
  const accessToken = parseAccessToken(req);

  if (typeof accessToken !== 'string' || accessToken.length !== 64 || !isAccessTokenAuthorized(accessToken)) {
    return res.status(401).send({ error: 'The access token is invalid' });
  }

  next();
};

export const router = express.Router();

// Accounts
router.get('/v1/accounts/verify_credentials', authorize, (_req, res) => res.send(getAccountForMastodonAPI(true)));
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
router.post('/v1/apps', (req, res) => {
  const { client_name: name, website, redirect_uris: redirectURIs, scopes = 'read' } = req.body;
  let application;

  try {
    application = createApplication({
      name,
      website,
      redirectURIs,
      scopes
    });
  } catch (err) {
    return res.status(422).send(err.message);
  }

  const { clientId, clientSecret } = application;

  return res.status(200).send({
    name,
    website,
    redirect_uri: redirectURIs,
    client_id: clientId,
    client_secret: clientSecret
  });
});

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
router.get('/v1/instance', (_req, res) => res.send(getInstanceForMastodonAPI()));
router.get('/v2/instance', (_req, res) => res.send(getInstanceForMastodonAPI(2)));

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
router.post('/v1/statuses', authorize, async (req, res) => {
  const {
    status,
    // media_ids: mediaIds,
    // poll, // {options: string[], expires_in: number, multiple: boolean, hide_totals: boolean}
    in_reply_to_id: inReplyToId,
    sensitive,
    spoiler_text: spoilerText
    // visibility,
    // language,
    // scheduled_at: scheduledAt
  } = req.body;

  if (!status) {
    return res.status(422).send({ error: "Validation failed: Text can't be blank" });
  }

  const accessToken = parseAccessToken(req);
  const application = getApplicationForAuthorizedAccessToken(accessToken);
  const note = await createNote(status, sensitive && spoilerText, inReplyToId || null, null, null);
  const { id, published, content } = note;

  res.send({
    id,
    created_at: published,
    content,
    application: {
      name: application.name,
      website: application.website
    }
  });
});
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

// Other
router.get('*', notFound);
router.post('*', notFound);
