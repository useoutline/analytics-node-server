import mongoose from 'mongoose'
import BrowsingDataSchema from './BrowsingData.schema.js'
import PageDataSchema from './PageData.schema.js'
import UtmSchema from './Utm.schema.js'

const sessionSchema = new mongoose.Schema(
  {
    app: {
      type: String,
      required: true,
      ref: 'apps',
    },
    user: {
      type: String,
      required: true,
    },
    visitedAt: {
      type: Date,
    },
    leftAt: {
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
    __v: false,
  }
)

const SessionModel = mongoose.model('sessions', sessionSchema)

export default SessionModel
