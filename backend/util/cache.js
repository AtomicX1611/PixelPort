import { createClient } from "redis";

// Simple abstraction that prefers Redis and falls back to in-memory cache.
const REDIS_URL = process.env.REDIS_URL;
const DEFAULT_TTL_SECONDS = 300;

let redisClient = null;
let redisReady = false;

if (REDIS_URL) {
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on("error", (err) => {
    console.error("Redis error, falling back to in-memory cache:", err.message);
  });
  redisClient.connect()
    .then(() => {
      redisReady = true;
      console.log("Redis cache connected");
    })
    .catch((err) => {
      console.error("Redis connection failed, using in-memory cache:", err.message);
      redisClient = null;
    });
}

// In-memory fallback store
const memoryStore = new Map();

const isRedisAvailable = () => Boolean(redisClient && redisReady);

export const getCache = async (key) => {
  try {
    if (isRedisAvailable()) {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    }
  } catch (err) {
    console.error("Cache get failed:", err.message);
  }

  const entry = memoryStore.get(key);
  if (!entry) return null;
  const { value, expiresAt } = entry;
  if (Date.now() > expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return value;
};

export const setCache = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  try {
    if (isRedisAvailable()) {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      return;
    }
  } catch (err) {
    console.error("Cache set failed:", err.message);
  }

  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

export const deleteCacheByPrefix = async (prefix) => {
  try {
    if (isRedisAvailable()) {
      const pattern = `${prefix}*`;
      for await (const key of redisClient.scanIterator({ MATCH: pattern })) {
        await redisClient.del(key);
      }
      return;
    }
  } catch (err) {
    console.error("Cache invalidation failed:", err.message);
  }

  for (const key of Array.from(memoryStore.keys())) {
    if (key.startsWith(prefix)) {
      memoryStore.delete(key);
    }
  }
};
