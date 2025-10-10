// backend/src/config/env.js
import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),

  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: Number(process.env.DB_PORT ?? 5432),
  DB_NAME: process.env.DB_NAME ?? 'postgres',
  DB_USER: process.env.DB_USER ?? 'postgres',
  DB_PASS: process.env.DB_PASS ?? '1122',

  // секрет для JWT — ОБЯЗАТЕЛЬНО поменяй в проде
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-me',

  // cors, если будет фронт
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
