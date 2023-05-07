import trackingController from "../controllers/Tracking.controller.js";

export default function (fastify, _, next) {
  fastify.get("/id", trackingController.getTrackingId);
  fastify.get("/events", trackingController.getEvents);
  fastify.post("/event", trackingController.trackEvent);
  fastify.post("/session", trackingController.trackSession);
  next();
}
