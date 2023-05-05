import { nanoid } from "nanoid";
import Bowser from "bowser";
import maxmind from "maxmind";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

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
        lat: ipDetails.location.latitude,
        lon: ipDetails.location.longitude,
      },
      timezone: ipDetails.location.time_zone,
    };
  } else {
    return null;
  }
}

async function trackEvent(request, reply) {
  try {
    console.log("\nTracking Event");
    const body = request.body;
    const browserDetails = getUserAgentDetails(request.headers);
    console.log(browserDetails);
    const ipDetails = await getLocationFromIp(request.ip);
    console.log("event", body);
    console.log("event", ipDetails);
    return { success: true };
  } catch (err) {
    console.error(err);
  }
}

function trackSession(request, reply) {
  console.log("\nTracking Session");
  const body = request.body;
  console.log("session", body);
  return { success: true };
}

function getTrackingId(request, reply) {
  console.log("\nGet Tracking ID");
  return { id: `UOA-${nanoid()}` };
}

function getEvents(request, reply) {
  console.log("\nGet Events");
  return {
    events: [
      {
        event: "lets-connect-click",
        selector: "#lets-connect",
        trigger: "click",
      },
      {
        event: "read-blog-click",
        selector: "#read-my-blog",
        trigger: "click",
      },
    ],
  };
}

export default {
  trackEvent,
  trackSession,
  getTrackingId,
  getEvents,
};
