import Redis from "ioredis";

let client;

const connectRedis = () => {
  try {
    client = new Redis({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    client.on("connect", () => {
      console.log("Redis connected ");
    });

    client.on("error", (err) => {
      console.error("Redis error ", err);
    });

  } catch (error) {
    console.error("Redis connection failed:", error);
  }
};

export { client, connectRedis };