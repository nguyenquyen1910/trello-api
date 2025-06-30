import "dotenv/config";

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  PORT: process.env.APP_PORT,
  HOSTNAME: process.env.APP_HOST,
  BUILD_MODE: process.env.BUILD_MODE,
  AUTHOR: process.env.AUTHOR,

  JWT_ACCESS_TOKEN_SECRET: process.env.ACCESS_SECRET,
  JWT_REFRESH_TOKEN_SECRET: process.env.REFRESH_SECRET,
  JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: process.env.REDIS_DB,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASS,
};
