import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error(
    "Redis Client Error:",
    error.message
  );
});

redisClient.on("connect", () => {
  console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("Redis connected and ready");
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error(
      "Redis connection failed:",
      error.message
    );

    // Do NOT stop application.
    // Weather can still work without cache.
  }
};

export default redisClient;