const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1", // VPS ya Docker ho to IP ya container name do
  port: 6379,
});

// 5 routes pr redis applied hai

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error", err);
});

export default redis;
