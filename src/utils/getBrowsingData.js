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

async function getLocationFromIp(headers, requestIP) {
  const ip =
    headers["x-forwarded-for"] ||
    headers["X-Forwarded-For"] ||
    headers["x-real-ip"] ||
    headers["X-Real-IP"] ||
    requestIP;
  const dbPath = path.resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../maxmind/GeoLite2-City.mmdb"
  );
  const lookup = await maxmind.open(dbPath);
  const ipDetails = lookup.get(ip);
  if (ipDetails) {
    return {
      city: ipDetails.city.names.en,
      country: {
        name: ipDetails.country.names.en,
        code: ipDetails.country.iso_code,
      },
      continent: {
        name: ipDetails.continent.names.en,
        code: ipDetails.continent.code,
      },
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

function getUtmData(meta) {
  return {
    utm_source: meta?.utm_source,
    utm_medium: meta?.utm_medium,
    utm_campaign: meta?.utm_campaign,
    utm_term: meta?.utm_term,
    utm_content: meta?.utm_content,
  };
}

function getBrowsingData({ browser, os, meta, platform, ipDetails }) {
  return {
    browser,
    os,
    platform,
    city: ipDetails?.city,
    country: ipDetails?.country,
    continent: ipDetails?.continent,
    coords: ipDetails?.coords,
    timezone: ipDetails?.timezone,
    meta,
  };
}

export { getUserAgentDetails, getLocationFromIp, getUtmData, getBrowsingData };
