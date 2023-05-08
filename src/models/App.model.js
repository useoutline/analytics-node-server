import mongoose from "mongoose";
import { nanoid } from "nanoid";

const appSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `OA-${nanoid()}`,
    },
    user: {
      type: String,
      required: true,
      ref: "users",
    },
    name: {
      type: String,
      required: [true, "App name is required"],
    },
    description: {
      type: String,
    },
    events: [
      {
        event: {
          type: String,
          required: true,
        },
        selectorType: {
          type: String,
          required: true,
          default: "selector",
          validate: {
            validator: function (v) {
              return ["id", "text", "selector"].includes(v);
            },
          },
        },
        selector: {
          type: String,
          required: true,
        },
        text: {
          type: String,
        },
        trigger: {
          type: String,
          required: true,
        },
        page: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AppModel = mongoose.model("apps", appSchema);

export default AppModel;
