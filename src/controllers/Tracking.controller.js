import { nanoid } from 'nanoid'

import EventModel from '../models/Event.model.js'
import SessionModel from '../models/Session.model.js'
import AppModel from '../models/App.model.js'
import {
  getBrowsingData,
  getLocationFromIp,
  getUserAgentDetails,
  getUtmData,
} from '../utils/getBrowsingData.js'

async function trackEvent(request) {
  try {
    console.log('Tracking Event', Date.now())
    const { browser, os, platform, meta } = getUserAgentDetails(request.headers)
    const ipDetails = await getLocationFromIp(request.headers, request.ip)
    const body = JSON.parse(request.body)

    const event = new EventModel({
      app: request.params.analyticsId,
      user: body.uid,
      event: body.event,
      eventType: body.type,
      page: body.page,
      browsingData: getBrowsingData({
        browser,
        os,
        platform,
        meta,
        ipDetails,
      }),
      referrer: body.page.meta?.referrer,
      utm: getUtmData(body.page.meta),
    })
    await event.save()
    return { success: true }
  } catch (err) {
    console.error(err)
  }
}

async function trackSession(request) {
  console.log('Tracking Session', Date.now())
  const { browser, os, platform, meta } = getUserAgentDetails(request.headers)
  const ipDetails = await getLocationFromIp(request.headers, request.ip)
  const body = JSON.parse(request.body)

  const session = new SessionModel({
    app: request.params.analyticsId,
    user: body.uid,
    visitedAt: body.visitedAt,
    leftAt: body.leftAt,
    page: body.page,
    browsingData: getBrowsingData({
      browser,
      os,
      platform,
      meta,
      ipDetails,
    }),
    referrer: body.page.meta?.referrer,
    utm: getUtmData(body.page.meta),
  })
  await session.save()
  return { success: true }
}

async function getTrackingId() {
  return { id: `OAU-${nanoid()}` }
}

async function getEvents(request) {
  const analyticsId = request.params.analyticsId
  const { events } = await AppModel.findById(analyticsId, 'events').lean()
  return {
    events,
  }
}

export default {
  trackEvent,
  trackSession,
  getTrackingId,
  getEvents,
}
