import mongoose from 'mongoose'
import BrowsingDataSchema from './BrowsingData.schema.js'
import PageDataSchema from './PageData.schema.js'
import UtmSchema from './Utm.schema.js'

const SESSION_MODEL_ERRORS = {
  APP_REQUIRED: 'APP_REQUIRED',
  USER_REQUIRED: 'USER_REQUIRED',
}

const sessionSchema = new mongoose.Schema(
  {
    app: {
      type: String,
      required: [true, SESSION_MODEL_ERRORS.APP_REQUIRED],
      ref: 'apps',
    },
    user: {
      type: String,
      required: [true, SESSION_MODEL_ERRORS.USER_REQUIRED],
    },
    sessionId: {
      type: String,
    },
    visitedAt: {
      type: Number,
    },
    leftAt: {
      type: Number,
    },
    capturedAt: {
      type: Date,
    },
    page: PageDataSchema,
    browsingData: BrowsingDataSchema,
    referrer: {
      type: String,
    },
    utm: UtmSchema,
  },
  {
    timestamps: true,
    versionKey: false,
    statics: {
      async createSession(sessionData) {
        const session = new this(sessionData)
        await session.save()
        return session
      },
    },
  }
)

const SessionModel = mongoose.model('sessions', sessionSchema)

export default SessionModel
