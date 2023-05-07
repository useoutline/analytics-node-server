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
    "../../maxmind/GeoLite2-City.mmdb"
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

export { getUserAgentDetails, getLocationFromIp };
