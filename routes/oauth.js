import express from 'express';
import { getApplication } from '../lib/applications.js';
import { createToken, getToken, useCode } from '../lib/tokens.js';
import { router as adminRouter } from './admin.js';

adminRouter.get('/oauth/authorize', (req, res) => {
  const { client_id: clientId, redirect_uri: redirectURI, response_type: responseType, scope = 'read' } = req.query;

  if (responseType !== 'code') {
    return res.status(500).send(`invalid_response_type: ${responseType}`);
  }

  let application;

  try {
    application = getApplication(clientId);
  } catch (err) {
    return res.status(500).send(err.message);
  }

  return res.render('oauthAuthorize', {
    layout: 'oauth',
    application,
    redirectURI,
    scope
  });
});

export const router = express.Router();

router.get('/authorize', (req, res) => {
  const query = new URLSearchParams(req.query);

  return res.redirect(`/private/oauth/authorize?${query.toString()}`);
});

router.post('/authorize', (req, res) => {
  const { client_id: clientId, redirect_uri: redirectURI, scope = 'read' } = req.body;

  let application;

  try {
    application = getApplication(clientId);
  } catch (err) {
    return res.redirect(`${redirectURI}?error=${err.message}`);
  }

  let token;

  try {
    token = createToken({
      application,
      scope
    });
  } catch (err) {
    return res.redirect(`${redirectURI}?error=${err.message}`);
  }

  res.redirect(`${redirectURI}?code=${token.code}`);
});

router.post('/token', (req, res) => {
  const { grant_type: grantType, client_id: clientId, code, scope = 'read' } = req.body;

  let application;

  try {
    application = getApplication(clientId);
  } catch (_err) {
    return res.code(400).send({ error: 'invalid_client_id' });
  }

  if (grantType === 'client_credentials') {
    // TODO: Implement client credentials flow
  } else if (grantType === 'authorization_code') {
    let token;

    try {
      token = getToken(code, application);
    } catch (_err) {
      return res.code(400).send({ error: 'invalid_code' });
    }

    const tokenScopeSet = new Set(token.scope.split(' '));

    if (!scope.split(' ').every(scope => tokenScopeSet.has(scope))) {
      return res.code(400).send({ error: 'invalid_scope' });
    }

    const { _createdAt, accessToken, scope: tokenScope } = useCode(token);

    return res.send({
      access_token: accessToken,
      token_type: 'Bearer',
      scope: tokenScope,
      created_at: _createdAt
    });
  }

  return res.code(400).send({ error: 'invalid_grant_type' });
});

router.post('/revoke_token', (_req, res) => {
  // TODO: implement
  return res.sendStatus(501);
});
