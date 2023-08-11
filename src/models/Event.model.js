import mongoose from 'mongoose'
import BrowsingDataSchema from './BrowsingData.schema.js'
import PageDataSchema from './PageData.schema.js'
import UtmSchema from './Utm.schema.js'

const EVENT_MODEL_ERRORS = {
  APP_REQUIRED: 'APP_REQUIRED',
  USER_REQUIRED: 'USER_REQUIRED',
  EVENT_REQUIRED: 'EVENT_REQUIRED',
}

const eventSchema = new mongoose.Schema(
  {
    app: {
      type: String,
      required: [true, EVENT_MODEL_ERRORS.APP_REQUIRED],
      ref: 'apps',
    },
    user: {
      type: String,
      required: [true, EVENT_MODEL_ERRORS.USER_REQUIRED],
    },
    event: {
      type: String,
      required: [true, EVENT_MODEL_ERRORS.EVENT_REQUIRED],
    },
    eventType: {
      type: String,
    },
    page: PageDataSchema,
    browsingData: BrowsingDataSchema,
    referrer: {
      type: String,
    },
    utm: UtmSchema,
    sessionId: {
      type: String,
    },
    capturedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    statics: {
      async createEvent(eventData) {
        const event = new this(eventData)
        await event.save()
        return event
      },
    },
  }
)

const EventModel = mongoose.model('events', eventSchema)

export default EventModel
