import { createClient } from "redis";

const redis = createClient();

redis.on("error", (err) => console.log("Redis Client Error", err));

const connectDB = async () => {
  await redis.connect();
};

connectDB();

export { redis };

