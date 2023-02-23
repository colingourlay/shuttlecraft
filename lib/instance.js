import { createRequire } from 'module';
import { getAccountForMastodonAPI } from './account.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

export const getInstanceForMastodonAPI = (apiVersion = 1) => {
  const domain = process.env.DOMAIN;
  let instance = {
    title: pkg.name,
    short_description: '',
    description: '',
    email: '',
    version: pkg.version,
    urls: {},
    languages: ['en'],
    rules: []
  };

  if (apiVersion === 1) {
    instance = {
      ...instance,
      uri: domain,
      short_description: instance.description,
      stats: {
        user_count: 1,
        status_count: 1, // TODO: count
        domain_count: 1
      },
      thumbnail: '',
      configuration: {
        accounts: {},
        statuses: {
          max_characters: 9999,
          max_media_attachments: 0,
          characters_reserved_per_url: 23
        },
        media_attachments: {
          supported_mime_types: [],
          image_size_limit: 0,
          image_matrix_limit: 0
        }
      },
      registrations: false,
      approval_required: true,
      invites_enabled: false,
      contact_account: null
    };
  } else if (apiVersion === 2) {
    instance = {
      ...instance,
      domain,
      thumbnail: {
        url: ''
      },
      configuration: {
        urls: {},
        accounts: { max_featured_tags: 0 },
        statuses: {
          max_characters: 9999,
          max_media_attachments: 0,
          characters_reserved_per_url: 23
        },
        media_attachments: {
          supported_mime_types: [],
          image_size_limit: 0,
          image_matrix_limit: 0,
          video_size_limit: 0,
          video_frame_rate_limit: 0,
          video_matrix_limit: 0
        },
        polls: {
          max_options: 0,
          max_characters_per_option: 0,
          min_expiration: 0,
          max_expiration: 0
        },
        translation: { enabled: false }
      },
      registrations: {
        enabled: false,
        approval_required: true,
        message: null
      },
      contact: {
        email: '',
        account: getAccountForMastodonAPI()
      }
    };
  }

  return instance;
};
