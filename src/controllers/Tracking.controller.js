import { nanoid } from "nanoid";

import EventModel from "../models/Event.model.js";
import SessionModel from "../models/Session.model.js";
import AppModel from "../models/App.model.js";
import {
  getLocationFromIp,
  getUserAgentDetails,
} from "../utils/getBrowsingData.js";

async function trackEvent(request) {
  try {
    console.log("Tracking Event", Date.now());
    const { browser, os, platform, meta } = getUserAgentDetails(
      request.headers
    );
    console.log("IP", request.headers, request.socket, request.ip);
    const ip =
      request.headers["x-forwarded-for"] ||
      request.socket.remoteAddress ||
      request.ip;
    const ipDetails = await getLocationFromIp(ip);
    const body = JSON.parse(request.body);

    const event = new EventModel({
      app: request.params.analyticsId,
      user: body.uid,
      event: body.event,
      eventType: body.type,
      page: body.page,
      browsingData: {
        browser,
        os,
        platform,
        city: ipDetails?.city,
        country: ipDetails?.country,
        coords: ipDetails?.coords,
        timezone: ipDetails?.timezone,
        meta,
      },
    });
    await event.save();
    return { success: true };
  } catch (err) {
    console.error(err);
  }
}

async function trackSession(request) {
  console.log("Tracking Session", Date.now());
  const { browser, os, platform, meta } = getUserAgentDetails(request.headers);
  console.log("IP", request.headers, request.socket, request.ip);
  const ip =
    request.headers["x-forwarded-for"] ||
    request.socket.remoteAddress ||
    request.ip;
  const ipDetails = await getLocationFromIp(ip);
  const body = JSON.parse(request.body);

  const session = new SessionModel({
    app: request.params.analyticsId,
    user: body.uid,
    visitedAt: body.visitedAt,
    leftAt: body.leftAt,
    page: body.page,
    browsingData: {
      browser,
      os,
      platform,
      city: ipDetails?.city,
      country: ipDetails?.country,
      coords: ipDetails?.coords,
      timezone: ipDetails?.timezone,
      meta,
    },
  });
  await session.save();
  return { success: true };
}

async function getTrackingId() {
  return { id: `OAU-${nanoid()}` };
}

async function getEvents(request) {
  const analyticsId = request.params.analyticsId;
  const { events } = await AppModel.findById(analyticsId, "events").lean();
  return {
    events,
  };
}

export default {
  trackEvent,
  trackSession,
  getTrackingId,
  getEvents,
};
