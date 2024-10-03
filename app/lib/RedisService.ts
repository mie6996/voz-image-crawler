import Redis, { RedisOptions } from "ioredis";
import { redisConfig } from "./RedisConfig";

function getRedisConfiguration(): {
  port: number;
  host: string;
  password: string;
} {
  return redisConfig;
}

export class RedisService {
  private static redis: Redis = RedisService.createRedisInstance();

  static createRedisInstance(config = getRedisConfiguration()) {
    try {
      const options: RedisOptions = {
        host: config.host,
        lazyConnect: true,
        showFriendlyErrorStack: true,
        enableAutoPipelining: true,
        maxRetriesPerRequest: 0,
        // tls: {
        //   rejectUnauthorized: false,
        // },
        retryStrategy: (times: number) => {
          if (times > 3) {
            console.warn(`[Redis] Could not connect after ${times} attempts`);
            return null;
          }

          return Math.min(times * 200, 1000);
        },
      };

      if (config.port) {
        options.port = config.port;
      }

      if (config.password) {
        options.password = config.password;
      }

      const redis = new Redis(options);

      redis.on("error", (error: unknown) => {
        console.warn("[Redis] Error connecting", error);
      });

      return redis;
    } catch (e) {
      throw new Error(`[Redis] Could not create a Redis instance`);
    }
  }

  static generateKey(...args: string[]) {
    return args.join(":");
  }

  static async setKey(key: string, value: string, expireTime?: number) {
    if (expireTime) {
      await this.redis.set(key, value, "EX", expireTime);
    } else {
      await this.redis.set(key, value);
    }
  }

  static async getKey(key: string) {
    // check if key exists
    if (!(await this.redis.exists(key))) {
      return null;
    }

    const value = await this.redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  }

  static async deleteKey(key: string) {
    // Find keys matching a pattern
    const keys = await this.redis.keys(`${key}*`);

    // Delete all keys found
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  static async hasKey(key: string) {
    return this.redis.exists(key);
  }
}
