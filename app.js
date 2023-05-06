import fastifyServer from "fastify";
import cors from "@fastify/cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import trackingRoutes from "./routes/tracking.routes.js";
import AppModel from "./models/App.model.js";
import UserModel from "./models/User.model.js";

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
    await mongoose.connect(process.env.MONGO_URL);
    // const user = new UserModel({
    //   email: "hello@shrinath.me",
    // });
    // await user.save();
    // await new AppModel({
    //   name: "Personal Website",
    //   user: user._id,
    // }).save();
    // await new AppModel({
    //   name: "Personal Website #2",
    //   user: user._id,
    //   events: [
    //     {
    //       event: "lets-connect-click",
    //       selector: "#lets-connect",
    //       trigger: "click",
    //     },
    //     {
    //       event: "read-blog-click",
    //       selector: "#read-my-blog",
    //       trigger: "click",
    //       page: "/",
    //     },
    //   ],
    // }).save();
    console.log(server);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
