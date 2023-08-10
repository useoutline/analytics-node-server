import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const APP_MODEL_ERRORS = {
  APP_NAME_REQUIRED: 'APP_NAME_REQUIRED',
  EVENT_REQUIRED: 'EVENT_REQUIRED',
  SELECTOR_TYPE_REQUIRED: 'SELECTOR_TYPE_REQUIRED',
  SELECTOR_TYPE_INVALID: 'SELECTOR_TYPE_INVALID',
  SELECTOR_REQUIRED: 'SELECTOR_REQUIRED',
  TRIGGER_REQUIRED: 'TRIGGER_REQUIRED',
}

const appSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `OA-${nanoid()}`,
    },
    user: {
      type: String,
      required: true,
      ref: 'users',
    },
    name: {
      type: String,
      required: [true, APP_MODEL_ERRORS.APP_NAME_REQUIRED],
    },
    description: {
      type: String,
    },
    events: [
      {
        event: {
          type: String,
          required: [true, APP_MODEL_ERRORS.EVENT_REQUIRED],
        },
        selectorType: {
          type: String,
          required: [true, APP_MODEL_ERRORS.SELECTOR_TYPE_REQUIRED],
          default: 'selector',
          validate: {
            validator: function (v) {
              return ['id', 'text', 'selector'].includes(v)
            },
            message: () => APP_MODEL_ERRORS.SELECTOR_TYPE_INVALID,
          },
        },
        selector: {
          type: String,
          required: [true, APP_MODEL_ERRORS.SELECTOR_REQUIRED],
        },
        text: {
          type: String,
        },
        trigger: {
          type: String,
          required: [true, APP_MODEL_ERRORS.TRIGGER_REQUIRED],
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
)

const AppModel = mongoose.model('apps', appSchema)

export default AppModel
