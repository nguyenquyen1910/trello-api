import Redis from "ioredis";
import { env } from "./environment.js";

const redis = new Redis({
  host: env.REDIS_HOST || "localhost",
  port: env.REDIS_PORT || 6379,
  password: env.REDIS_PASSWORD,
  db: env.REDIS_DB || 0,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

redis.on("error", (error) => {
  console.log("Redis connection error:", error);
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

export { redis };
