import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

// Helpers
export async function get(key) {
  return redis.get(key);
}

export async function set(key, value, ttlSeconds = null) {
  if (ttlSeconds) {
    return redis.set(key, value, "EX", ttlSeconds);
  }
  return redis.set(key, value);
}

export async function del(key) {
  return redis.del(key);
}

export async function incr(key) {
  return redis.incr(key);
}

export default { get, set, del, incr };
