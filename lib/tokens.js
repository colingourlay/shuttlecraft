import crypto from 'crypto';
import debug from 'debug';
import fs from 'fs';
import path from 'path';
import { readJSONDictionary, writeJSONDictionary, pathToTokens, authorizedAccessTokensFile } from './storage.js';

const logger = debug('ono:tokens');

export const getToken = (tokenId, application) => {
  const tokenFile = path.resolve(pathToTokens, `${tokenId}.json`);

  logger('get token', tokenId, tokenFile);

  if (!fs.existsSync(tokenFile)) {
    throw new Error('invalid_token');
  }

  const token = readJSONDictionary(tokenFile);

  if (token.code === null) {
    throw new Error('code_already_used');
  }

  if (application && token.applicationId !== application._id) {
    throw new Error('invalid_token_application');
  }

  return token;
};

const isValidTokenConfig = config => {
  return (
    typeof config === 'object' &&
    typeof config.application === 'object' &&
    typeof config.application.clientId === 'string' &&
    typeof config.scope === 'string'
  );
};

export const createToken = config => {
  if (!isValidTokenConfig(config)) {
    throw new Error('invalid_token_config');
  }

  const { application, scope } = config;
  const accessToken = crypto.randomBytes(32).toString('hex');
  const code = crypto.randomBytes(16).toString('hex');
  const tokenId = code;
  const tokenFile = path.resolve(pathToTokens, `${tokenId}.json`);
  const now = Date.now();
  const token = {
    _id: tokenId,
    _createdAt: now,
    _updatedAt: now,
    applicationId: application._id,
    scope,
    accessToken,
    code
  };

  logger(`create ${tokenFile}`);

  writeJSONDictionary(tokenFile, token);

  return token;
};

const getAuthorizedAccessTokens = () => {
  return readJSONDictionary(authorizedAccessTokensFile, {});
};

const setAuthorizedAccessTokens = authorizedAccessTokens => {
  writeJSONDictionary(authorizedAccessTokensFile, authorizedAccessTokens);
};

const registerAuthorizedAccessToken = token => {
  setAuthorizedAccessTokens({
    ...getAuthorizedAccessTokens(),
    [token.accessToken]: token.applicationId
  });
};

export const isAccessTokenAuthorized = accessToken => {
  return getAuthorizedAccessTokens()[accessToken] !== null;
};

export const useCode = token => {
  const tokenId = token._id;
  const tokenFile = path.resolve(pathToTokens, `${tokenId}.json`);

  token.code = null;
  token._updatedAt = Date.now();

  logger('use token code', tokenFile);

  registerAuthorizedAccessToken(token);

  writeJSONDictionary(tokenFile, token);

  return token;
};
