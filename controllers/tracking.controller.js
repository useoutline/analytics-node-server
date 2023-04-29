import { nanoid } from "nanoid";

function trackEvent(request, reply) {
  console.log("\n\nTracking Event\n");
  const body = request.body;
  console.log("event", body);
  reply.send({ success: true });
}

function trackSession(request, reply) {
  console.log("\n\nTracking Session\n");
  const body = request.body;
  console.log("session", body);
  reply.send({ success: true });
}

function getTrackingId(request, reply) {
  console.log("\n\nGet Tracking ID\n");
  reply.send({ id: `OA-${nanoid()}` });
}

function getEvents(request, reply) {
  console.log("\n\nGet Events\n");
  reply.send({
    events: [
      {
        event: "button-click",
        selector: "button",
        trigger: "click",
      },
      {
        event: "window-scroll",
        selector: "window",
        trigger: "scroll",
      },
    ],
  });
}

export default {
  trackEvent,
  trackSession,
  getTrackingId,
  getEvents,
};
