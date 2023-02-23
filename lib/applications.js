import crypto from 'crypto';
import debug from 'debug';
import fs from 'fs';
import path from 'path';

import { readJSONDictionary, writeJSONDictionary, pathToApplications } from './storage.js';

const logger = debug('ono:applications');

export const getApplication = applicationId => {
  const applicationFile = path.resolve(pathToApplications, `${applicationId}.json`);

  logger('get application', applicationId, applicationFile);

  if (!fs.existsSync(applicationFile)) {
    throw new Error('invalid_application');
  }

  return readJSONDictionary(applicationFile);
};

const isValidApplicationConfig = config => {
  return (
    typeof config === 'object' &&
    typeof config.name === 'string' &&
    typeof config.website === 'string' &&
    typeof config.redirectURIs === 'string' &&
    (typeof config.scopes === 'undefined' || typeof config.scopes === 'string')
  );
};

export const createApplication = config => {
  if (!isValidApplicationConfig(config)) {
    throw new Error('invalid_application_config');
  }

  const { name, website, redirectURIs, scopes } = config;
  const clientId = crypto.randomBytes(16).toString('hex');
  const clientSecret = crypto.randomBytes(40).toString('hex');
  const applicationId = clientId;
  const applicationFile = path.resolve(pathToApplications, `${applicationId}.json`);
  const now = Date.now();
  const application = {
    _id: applicationId,
    _createdAt: now,
    _updatedAt: now,
    name,
    website,
    redirectURIs,
    scopes: scopes || 'read',
    clientId,
    clientSecret
  };

  logger(`create ${applicationFile}`);

  writeJSONDictionary(applicationFile, application);

  return application;
};
