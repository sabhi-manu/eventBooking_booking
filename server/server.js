import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db/db.js";
import { connectRedis } from "./src/config/redis/redis.js";


dotenv.config();
const startServer = async () => {
  try {
    await connectDB();
  await connectRedis()
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();