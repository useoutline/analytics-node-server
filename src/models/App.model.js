import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

const APP_ERRORS_CODE_START = 1000
const APP_EVENT_ERRORS_CODE_START = 1100

const APP_MODEL_ERRORS = {
  APP_NAME_REQUIRED: {
    code: APP_ERRORS_CODE_START + 1,
    type: 'APP_NAME_REQUIRED',
    message: 'App name is required',
  },
  EVENT_REQUIRED: {
    code: APP_EVENT_ERRORS_CODE_START + 1,
    type: 'EVENT_REQUIRED',
    message: 'Event is required',
  },
  SELECTOR_TYPE_REQUIRED: {
    code: APP_EVENT_ERRORS_CODE_START + 2,
    type: 'SELECTOR_TYPE_REQUIRED',
    message: 'Selector type is required',
  },
  SELECTOR_TYPE_INVALID: {
    code: APP_EVENT_ERRORS_CODE_START + 3,
    type: 'SELECTOR_TYPE_INVALID',
    message: 'Selector type is invalid',
    expected: ['id', 'text', 'selector'],
  },
  SELECTOR_REQUIRED: {
    code: APP_EVENT_ERRORS_CODE_START + 4,
    type: 'SELECTOR_REQUIRED',
    message: 'Selector is required',
  },
  TRIGGER_REQUIRED: {
    code: APP_EVENT_ERRORS_CODE_START + 5,
    type: 'TRIGGER_REQUIRED',
    message: 'Trigger is required',
  },
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
