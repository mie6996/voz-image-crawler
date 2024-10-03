export const redisConfig = {
  host: process.env.NEXT_PUBLIC_REDIS_HOST || "localhost",
  password: process.env.NEXT_PUBLIC_REDIS_PASSWORD || "",
  port: process.env.NEXT_PUBLIC_REDIS_PORT
    ? parseInt(process.env.NEXT_PUBLIC_REDIS_PORT)
    : 6379,
};
