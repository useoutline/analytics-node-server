import fastifyServer from "fastify";
import cors from "@fastify/cors";

import trackingRoutes from "./routes/tracking.routes.js";

const fastify = fastifyServer();
fastify.register(cors, (instance) => {
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
    const server = await fastify.listen({ port: 3000 });
    console.log(server);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
