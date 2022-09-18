import { config as dotEnvConfig } from 'dotenv';

import { toNumber, getOsEnv, normalizePort } from '@utils/util';
import { NodeEnv } from '@app/constants';

dotEnvConfig({ path: `.env.${getOsEnv('NODE_ENV')}` });

export const config = {
  APP_NAME: 'ExpressJS',
  NODE_ENV: getOsEnv('NODE_ENV'),
  PORT: normalizePort(getOsEnv('PORT')),
  isProduction: getOsEnv('NODE_ENV') === NodeEnv.PRODUCTION,
  isDevelopment: getOsEnv('NODE_ENV') === NodeEnv.DEVELOPMENT,
  BASE_URL: '/api/v1',
  SWAGGER_URL: '/api-docs',
  DB: {
    DB_HOST: getOsEnv('DB_HOST'),
    DB_PORT: toNumber(getOsEnv('DB_PORT')),
    DB_DATABASE: getOsEnv('DB_DATABASE'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  JWT: {
    EXPIRES_IN: getOsEnv('JWT_EXPIRES_IN'),
    JWT_SECRET: getOsEnv('JWT_SECRET'),
    // COOKIE_EXPIRE: toNumber(getOsEnv('COOKIE_EXPIRE')),
  },
  HASH_SALT: toNumber(getOsEnv('HASH_SALT')),
  CRYPTO_ROUNDS: toNumber(getOsEnv('CRYPTO_ROUNDS')),
  CORS: {
    ORIGIN: '*',
    CREDENTIALS: true,
  },
  LOGS: {
    FORMAT: 'dev',
    DIR: '../../logs',
  },
  RATE_LIMIT: {
    MAX: 100,
    WINDOW__MS: 60 * 60 * 1000,
  },
};
