import mongoose from "mongoose";
import BrowsingDataSchema from "./BrowsingData.schema.js";
import PageDataSchema from "./PageData.schema.js";

const eventSchema = new mongoose.Schema(
  {
    app: {
      type: String,
      required: true,
      ref: "apps",
    },
    user: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
    },
    page: PageDataSchema,
    browsingData: BrowsingDataSchema,
  },
  {
    timestamps: true,
    __v: false,
  }
);

const EventModel = mongoose.model("events", eventSchema);

export default EventModel;
