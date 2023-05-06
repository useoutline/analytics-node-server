import mongoose from "mongoose";

const BrowsingDataSchema = new mongoose.Schema({
  browser: {
    type: String,
  },
  os: {
    type: String,
  },
  platform: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  coords: {
    type: {
      type: String,
    },
    coordinates: [Number, Number],
  },
  timezone: {
    type: String,
  },
  meta: {
    type: Object,
  },
});

export default BrowsingDataSchema;
