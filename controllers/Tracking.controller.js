import { nanoid } from "nanoid";
import Bowser from "bowser";
import maxmind from "maxmind";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import EventModel from "../models/Event.model.js";
import SessionModel from "../models/Session.model.js";
import AppModel from "../models/App.model.js";

function getUserAgentDetails(headers) {
  const useragent = headers["user-agent"];
  const isBrave = headers["x-browser-brave"];
  const browserDetails = Bowser.parse(useragent);
  return {
    browser: isBrave === "1" ? "Brave" : browserDetails.browser.name,
    os: browserDetails.os.name,
    platform: browserDetails.platform.type,
    meta: {
      ...browserDetails,
    },
  };
}

async function getLocationFromIp(ip) {
  const dbPath = path.resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../maxmind/GeoLite2-City.mmdb"
  );
  const lookup = await maxmind.open(dbPath);
  const ipDetails = lookup.get(ip);
  if (ipDetails) {
    return {
      city: ipDetails.city.names.en,
      country: ipDetails.country.names.en,
      coords: {
        type: "Point",
        coordinates: [
          ipDetails.location.longitude,
          ipDetails.location.latitude,
        ],
      },
      timezone: ipDetails.location.time_zone,
    };
  } else {
    return null;
  }
}

async function trackEvent(request) {
  try {
    console.log("\nTracking Event");
    const { browser, os, platform, meta } = getUserAgentDetails(
      request.headers
    );
    const ipDetails = await getLocationFromIp(request.ip);
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
  console.log("\nTracking Session");
  const { browser, os, platform, meta } = getUserAgentDetails(request.headers);
  const ipDetails = await getLocationFromIp(request.ip);
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
