// import WeatherEvent from '../models/WeatherEvent.js';
// import WeatherReport from '../models/WeatherReport.js';
// import { calculateDistanceKm } from '../utils/geoUtils.js';
// import { computeCorroboration } from './corroborationScoring.js';
// import { checkVelocity } from './velocityDetection.js';
// import { computePriorityScore } from './priorityScoring.js';
// import { generateEventSummary, generateEventTitle } from './summarizationService.js';

// const TIME_WINDOW_HOURS = 6;
// const DISTANCE_THRESHOLD_KM = 2;
// const SEVERITY_RANK = { low: 1, medium: 2, high: 3 };

// // eventType se category map karo
// const EVENT_CATEGORY = {
//   flood: 'hydrological',
//   rainfall: 'meteorological',
//   thunderstorm: 'meteorological',
//   heatwave: 'climatological',
//   fog: 'meteorological',
//   dust_storm: 'meteorological',
//   strong_wind: 'meteorological',
//   wildfire: 'geophysical',
//   drought: 'climatological',
//   other: 'meteorological'
// };

// export const findOrCreateEvent = async (report) => {
//   const lat = report.location?.lat || report.aiAnalysis?.location?.lat;
//   const lng = report.location?.lng || report.aiAnalysis?.location?.lng;
//   const eventType = report.aiAnalysis?.eventType || report.eventType;
//   const severity = report.aiAnalysis?.severity || report.severity;
//   const sourceType = report.source?.type || report.sourceType;
  

//   if (!lat || !lng) return null;

//   const timeWindowStart = new Date(Date.now() - TIME_WINDOW_HOURS * 60 * 60 * 1000);

//   const candidateEvents = await WeatherEvent.find({
//     eventType,
//     status: 'active',
//     lastReportedAt: { $gte: timeWindowStart }
//   });

//   for (const event of candidateEvents) {
//     const distance = calculateDistanceKm(lat, lng, event.location.lat, event.location.lng);

//     if (distance <= DISTANCE_THRESHOLD_KM) {
//       // Existing event update karo
//       event.linkedReports.push(report._id);
//       event.reportCount += 1;
//       event.lastReportedAt = new Date();

//       if (!event.sourceTypes.includes(sourceType)) {
//         event.sourceTypes.push(sourceType);
//       }
//       event.uniqueSourceCount = new Set(event.sourceTypes).size;

//       if (SEVERITY_RANK[severity] > SEVERITY_RANK[event.severity]) {
//         event.severity = severity;
//       }

//       // Media count update
//       const mediaCount = report.media?.length || 0;
//       if (mediaCount > 0) {
//         event.evidence.imageCount += report.media.filter(m => m.type === 'image').length;
//         event.evidence.videoCount += report.media.filter(m => m.type === 'video').length;
//       }

//       // Corroboration update
//       const corroboration = computeCorroboration(event.sourceTypes, event.reportCount);
//       event.corroboration = corroboration;
//       event.credibilityScore = corroboration.score;

//       // Velocity update
//       // Velocity update ke baad event save mein ye use karo:
// event.trend = {
//   reportsLast15Min: velocity.reportsLast15Min,
//   reportsLastHour: velocity.reportsLastHour,
//   reportsLast6Hours: velocity.reportsLast6Hours,
//   velocity: velocity.velocity,
//   surgeScore: velocity.score,
//   isEmerging: velocity.isEmerging,
//   growthPercentage: velocity.growthPercentage,
//   lastCalculatedAt: new Date()
// };
//       // Priority score update
//       const priority = computePriorityScore({
//         severity: event.severity,
//         credibilityScore: event.credibilityScore,
//         surgeScore: velocity.score,
//         reportCount: event.reportCount,
//         uniqueSourceCount: event.uniqueSourceCount,
//         imageCount: event.evidence.imageCount,
//         videoCount: event.evidence.videoCount,
//         isEmerging: velocity.isEmerging
//       });
//       event.priorityScore = priority.score;

      

//       // Summary generate karo (har 5th report pe)
//       if (event.reportCount % 5 === 0) {
//         const recentReports = await WeatherReport.find({
//           _id: { $in: event.linkedReports.slice(-10) }
//         });
//         const summary = await generateEventSummary(event, recentReports);
//         if (summary) event.summary = summary;
//       }

//       await event.save();
//       console.log(`[Clustering] Updated event "${event.title}" → ${event.reportCount} reports | Priority: ${event.priorityScore} | ${velocity.isEmerging ? '⚡ EMERGING' : ''}`);
//       return event;
//     }
//   }

//   // Naya event banao
//   const corroboration = computeCorroboration([sourceType], 1);
//   const title = generateEventTitle(eventType, report.location?.city);
//   const priority = computePriorityScore({
//     severity,
//     credibilityScore: corroboration.score,
//     surgeScore: 0,
//     reportCount: 1,
//     uniqueSourceCount: 1,
//     imageCount: report.media?.filter(m => m.type === 'image').length || 0,
//     videoCount: report.media?.filter(m => m.type === 'video').length || 0,
//     isEmerging: false
//   });

//   const newEvent = new WeatherEvent({
//     eventType,
//     category: EVENT_CATEGORY[eventType] || 'meteorological',
//     title,
//     location: { lat, lng },
//     severity,
//     linkedReports: [report._id],
//     reportCount: 1,
//     sourceTypes: [sourceType],
//     uniqueSourceCount: 1,
//     evidence: {
//       imageCount: report.media?.filter(m => m.type === 'image').length || 0,
//       videoCount: report.media?.filter(m => m.type === 'video').length || 0
//     },
//     corroboration,
//     credibilityScore: corroboration.score,
//     priorityScore: priority.score,
//     trend: {
//       reportsLast15Min: 0,
//       reportsLastHour: 0,
//       velocity: 'stable',
//       surgeScore: 0,
//       isEmerging: false
//     },
//     firstReportedAt: new Date(),
//     lastReportedAt: new Date()
//   });

//   await newEvent.save();
//   console.log(`[Clustering] New event: "${title}" | Priority: ${priority.score}`);
//   return newEvent;
// };

import WeatherEvent from '../models/WeatherEvent.js';
import WeatherReport from '../models/WeatherReport.js';
import { calculateDistanceKm } from '../utils/geoUtils.js';
import { computeCorroboration } from './corroborationScoring.js';
import { checkVelocity } from './velocityDetection.js';
import { computePriorityScore } from './priorityScoring.js';
import { generateEventSummary, generateEventTitle } from './summarizationService.js';

const TIME_WINDOW_HOURS = 6;
const DISTANCE_THRESHOLD_KM = 2;
const SEVERITY_RANK = { low: 1, medium: 2, high: 3 };

const EVENT_CATEGORY = {
  flood: 'hydrological',
  rainfall: 'meteorological',
  thunderstorm: 'meteorological',
  heatwave: 'climatological',
  fog: 'meteorological',
  dust_storm: 'meteorological',
  strong_wind: 'meteorological',
  wildfire: 'geophysical',
  drought: 'climatological',
  cyclone: 'meteorological',
  cold_wave: 'meteorological',
  other: 'meteorological'
};

export const findOrCreateEvent = async (report) => {
  const lat = report.location?.lat;
  const lng = report.location?.lng;
  const eventType = report.aiAnalysis?.eventType || report.eventType;
  const severity = report.aiAnalysis?.severity || report.severity;
  const sourceType = report.source?.type || report.sourceType;



  if (!lat || !lng) return null;

  const timeWindowStart = new Date(Date.now() - TIME_WINDOW_HOURS * 60 * 60 * 1000);

  const candidateEvents = await WeatherEvent.find({
    eventType,
    status: 'active',
    lastReportedAt: { $gte: timeWindowStart }
  });

  for (const event of candidateEvents) {
    const distance = calculateDistanceKm(lat, lng, event.location.lat, event.location.lng);

    if (distance <= DISTANCE_THRESHOLD_KM) {
      event.linkedReports.push(report._id);
      event.reportCount += 1;
      event.lastReportedAt = new Date();

      if (!event.sourceTypes.includes(sourceType)) {
        event.sourceTypes.push(sourceType);
      }
      event.uniqueSourceCount = new Set(event.sourceTypes).size;

      if (SEVERITY_RANK[severity] > SEVERITY_RANK[event.severity]) {
        event.severity = severity;
      }

      if (report.media?.length > 0) {
        event.evidence.imageCount += report.media.filter(m => m.type === 'image').length;
        event.evidence.videoCount += report.media.filter(m => m.type === 'video').length;
      }

      const corroboration = computeCorroboration(event.sourceTypes, event.reportCount);
      event.corroboration = corroboration;
      event.credibilityScore = corroboration.score;

      // velocity variable properly declare karo
      const velocity = await checkVelocity(event._id);

      event.trend = {
        reportsLast15Min: velocity.reportsLast15Min,
        reportsLastHour: velocity.reportsLastHour,
        reportsLast6Hours: velocity.reportsLast6Hours,
        velocity: velocity.velocity,
        surgeScore: velocity.score,
        isEmerging: velocity.isEmerging,
        growthPercentage: velocity.growthPercentage,
        lastCalculatedAt: new Date()
      };

      const priority = computePriorityScore({
        severity: event.severity,
        credibilityScore: event.credibilityScore,
        surgeScore: velocity.score,
        reportCount: event.reportCount,
        uniqueSourceCount: event.uniqueSourceCount,
        imageCount: event.evidence.imageCount,
        videoCount: event.evidence.videoCount,
        isEmerging: velocity.isEmerging
      });
      event.priorityScore = priority.score;

      if (event.reportCount % 5 === 0) {
        const recentReports = await WeatherReport.find({
          _id: { $in: event.linkedReports.slice(-10) }
        });
        const summary = await generateEventSummary(event, recentReports);
        if (summary) event.summary = summary;
      }
       
      // Ye existing event update block mein add karo, event.save() se pehle:

// aiConfidence = average of all linked reports' confidence
const linkedReportDocs = await WeatherReport.find({
  _id: { $in: event.linkedReports }
}).select('aiAnalysis.eventConfidence');

const confidences = linkedReportDocs
  .map(r => r.aiAnalysis?.eventConfidence || 0)
  .filter(c => c > 0);

event.aiConfidence = confidences.length > 0
  ? Math.round((confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100) / 100
  : 0;

      


      await event.save();
      console.log(`[Clustering] Updated "${event.title}" → ${event.reportCount} reports | Priority: ${event.priorityScore} | ${velocity.isEmerging ? '⚡ EMERGING' : 'stable'}`);
      return event;
    }
  }

  // Naya event
  const corroboration = computeCorroboration([sourceType], 1);
  const title = generateEventTitle(eventType, report.location?.city);
  const priority = computePriorityScore({
    severity,
    credibilityScore: corroboration.score,
    surgeScore: 0,
    reportCount: 1,
    uniqueSourceCount: 1,
    imageCount: report.media?.filter(m => m.type === 'image').length || 0,
    videoCount: report.media?.filter(m => m.type === 'video').length || 0,
    isEmerging: false
  });

  // Pehle report se summary bhi banao
  const initialSummary = await generateEventSummary(
    { eventType, location: { city: report.location?.city } },
    [report]
  );

  const newEvent = new WeatherEvent({
    eventType,
    category: EVENT_CATEGORY[eventType] || 'meteorological',
    title,
    summary: initialSummary || null,
    location: {
      lat,
      lng,
      city: report.location?.city || null,
      state: report.location?.state || null
    },
    severity,
    linkedReports: [report._id],
    reportCount: 1,
    sourceTypes: [sourceType],
    uniqueSourceCount: 1,
    evidence: {
      imageCount: report.media?.filter(m => m.type === 'image').length || 0,
      videoCount: report.media?.filter(m => m.type === 'video').length || 0
    },
    corroboration,
    credibilityScore: corroboration.score,
    priorityScore: priority.score,
    trend: {
      reportsLast15Min: 0,
      reportsLastHour: 0,
      reportsLast6Hours: 0,
      velocity: 'stable',
      surgeScore: 0,
      isEmerging: false,
      growthPercentage: 0,
      lastCalculatedAt: new Date()
    },
     aiConfidence: report.aiAnalysis?.eventConfidence || 0,
    firstReportedAt: new Date(),
    lastReportedAt: new Date()
  });

  updateEventLifecycle(event);

  await newEvent.save();
  console.log(`[Clustering] New event: "${title}" | ${eventType} | Priority: ${priority.score}`);
  return newEvent;
};