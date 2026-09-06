import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
}

export const env = {
  NODE_ENV:              process.env.NODE_ENV || 'development',
  PORT:                  parseInt(process.env.PORT || '5000', 10),
  MONGO_URI:             process.env.MONGO_URI || 'mongodb://localhost:27017/scicollab',
  JWT_SECRET:            required('JWT_SECRET', 'scicollab_dev_jwt_secret_key_2026'),
  JWT_EXPIRES_IN:        process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET:    required('JWT_REFRESH_SECRET', 'scicollab_dev_jwt_refresh_secret_key_2026'),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  CLIENT_ORIGIN:         process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  RATE_LIMIT_WINDOW_MS:  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX:        parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
} as const;
