import EventModel from '../models/Event.model.js'
import SessionModel from '../models/Session.model.js'
import AppModel from '../models/App.model.js'
import {
  getBrowsingData,
  getLocationFromIp,
  getUserAgentDetails,
  getPageData,
  getUtmData,
} from '../utils/getBrowsingData.js'
import { StatusCodes } from 'http-status-codes'

async function trackEvent(request, reply) {
  try {
    console.log('Tracking Event', Date.now())
    const { browser, os, platform, meta } = getUserAgentDetails(request.headers)
    const ipDetails = await getLocationFromIp(request.headers, request.ip)
    const body = request.body

    await EventModel.createEvent({
      app: request.params.analyticsId,
      user: body.uid,
      event: body.event,
      eventType: body.type,
      page: getPageData(body),
      browsingData: getBrowsingData({
        browser,
        os,
        platform,
        meta,
        ipDetails,
      }),
      referrer: body.page?.referrer,
      utm: getUtmData(body),
      capturedAt: Date.now(),
      sessionId: body.sessionId,
    })
    return { success: true }
  } catch (err) {
    console.error(err)
    reply.status(StatusCodes.BAD_REQUEST).send({
      error: true,
      type: 'VALIDATION_ERROR',
    })
  }
}

async function trackSession(request, reply) {
  try {
    console.log('Tracking Session', Date.now())
    const { browser, os, platform, meta } = getUserAgentDetails(request.headers)
    const ipDetails = await getLocationFromIp(request.headers, request.ip)

    const body = request.body

    await SessionModel.createSession({
      app: request.params.analyticsId,
      user: body.uid,
      visitedAt: body.visitedAt,
      leftAt: body.leftAt,
      page: getPageData(body),
      browsingData: getBrowsingData({
        browser,
        os,
        platform,
        meta,
        ipDetails,
      }),
      referrer: body.page?.referrer,
      utm: getUtmData(body),
      capturedAt: Date.now(),
      sessionId: body.sessionId,
    })
    return { success: true }
  } catch (err) {
    console.error(err)
    reply.status(StatusCodes.BAD_REQUEST).send({
      error: true,
      type: 'VALIDATION_ERROR',
    })
  }
}

async function getEvents(request) {
  const analyticsId = request.params.analyticsId
  const { events } = await AppModel.getEventsById(analyticsId)
  return {
    success: true,
    events,
  }
}

export default {
  trackEvent,
  trackSession,
  getEvents,
}
