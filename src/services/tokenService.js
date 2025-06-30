import { redis } from "../config/redis.js";
import crypto from "crypto";

class TokenService {
  // Generate unique token id(JWT ID - jti)
  generateTokenId() {
    return crypto.randomBytes(32).toString("hex");
  }

  // Store token in Redis with expiration time
  async storeToken(jti, userId, expiresIn) {
    const key = `token:${jti}`;
    const value = JSON.stringify({
      userId,
      type: "access",
      createdAt: Date.now(),
    });
    await redis.setex(key, this.parseExpireTime(expiresIn), value);
  }

  // Check if token exists in blacklist
  async isTokenBlacklisted(jti) {
    const key = `token:${jti}`;
    const exists = await redis.exists(key);
    return !exists;
  }

  // Blacklist token (remove from Redis)
  async blacklistToken(jti) {
    const key = `token:${jti}`;
    await redis.del(key);
  }

  // Get all user's active tokens
  async getUserSessions(userId) {
    const keys = await this.scanKeys("token:*");
    const sessions = [];
    for (const key of keys) {
      const value = await redis.get(key);
      if (value) {
        const tokenData = JSON.parse(value);
        if (tokenData.userId === userId) {
          sessions.push({
            jti: key.replace("token:", ""),
            createdAt: tokenData.createdAt,
          });
        }
      }
    }
    return sessions;
  }

  // Logout all user sessions
  async logoutAllSessions(userId) {
    const sessions = await this.getUserSessions(userId);

    for (const session of sessions) {
      await this.blacklistToken(session.jti);
    }
    return sessions.length;
  }

  parseExpireTime(expiresIn) {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case "s":
        return value;
      case "m":
        return value * 60;
      case "h":
        return value * 60 * 60;
      case "d":
        return value * 60 * 60 * 24;
      default:
        return 15 * 60;
    }
  }

  async scanKeys(pattern) {
    let cursor = "0";
    const keys = [];

    do {
      const reply = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = reply[0];
      keys.push(...reply[1]);
    } while (cursor !== "0");

    return keys;
  }

  async cleanupExpiredTokens() {
    console.log("Redis auto-expires tokens. Manual cleanup not required.");
  }
}

export const tokenService = new TokenService();
