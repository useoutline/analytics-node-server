import fastifyServer from "fastify";
import cors from "@fastify/cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

import trackingRoutes from "./routes/tracking.routes.js";
import { downloadMaxmindDB } from "./utils/maxmind.js";

const fastify = fastifyServer();
fastify.register(cors, () => {
  return (req, callback) => {
    const corsOptions = {
      origin: "*",
      methods: ["GET", "POST", "OPTIONS"],
    };

    callback(null, corsOptions);
  };
});
fastify.register(trackingRoutes, { prefix: "/v1/:analyticsId" });

const start = async () => {
  try {
    const server = await fastify.listen({ port: process.env.PORT || 3000 });
    await mongoose.connect(process.env.MONGO_URL);
    downloadMaxmindDB(); // Download DB on server start
    cron.schedule("12 0 * * 3,6", downloadMaxmindDB); // Download new DB every Wednesday and Saturday at 12:00 PM
    console.log(`Server started at ${server}`);
  } catch (err) {
    console.log(err);
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
