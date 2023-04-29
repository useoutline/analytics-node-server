import trackingController from "../controllers/tracking.controller.js";

export default async function (fastify, _, next) {
  fastify.post("/event", trackingController.trackEvent);
  fastify.post("/session", trackingController.trackSession);
  fastify.get("/id", trackingController.getTrackingId);
  fastify.get("/events", trackingController.getEvents);

  next();
}
