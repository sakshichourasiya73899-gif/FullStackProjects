import WeatherEvent from '../models/WeatherEvent.js';
import { calculateDistanceKm } from '../utils/geoUtils.js';

const TIME_WINDOW_HOURS = 6;
const DISTANCE_THRESHOLD_KM = 2;

// Naya report aane par ye function decide karta hai:
// existing event mein add karo, ya naya event banao
export const findOrCreateEvent = async (report) => {
  // Sirf resolved location wali reports cluster ho sakti hain
  if (!report.location?.resolved || !report.location?.lat || !report.location?.lng) {
    return null;
  }

  const timeWindowStart = new Date(Date.now() - TIME_WINDOW_HOURS * 60 * 60 * 1000);

  // Same event type ke active events dhoondo jo recent time window mein hain
  const candidateEvents = await WeatherEvent.find({
    eventType: report.eventType,
    status: 'active',
    lastReportedAt: { $gte: timeWindowStart }
  });

  // Har candidate ka distance check karo
  for (const event of candidateEvents) {
    const distance = calculateDistanceKm(
      report.location.lat,
      report.location.lng,
      event.location.lat,
      event.location.lng
    );

    if (distance <= DISTANCE_THRESHOLD_KM) {
      // Match mil gaya — is event mein report add karo
      event.linkedReports.push(report._id);
      event.reportCount += 1;
      event.lastReportedAt = new Date();

      if (!event.sourceTypes.includes(report.sourceType)) {
        event.sourceTypes.push(report.sourceType);
      }

      // Severity upgrade karo agar naya report zyada severe hai
      const severityRank = { low: 1, medium: 2, high: 3 };
      if (severityRank[report.severity] > severityRank[event.severity]) {
        event.severity = report.severity;
      }

      await event.save();
      console.log(`[EventClustering] Report added to existing event ${event._id} (now ${event.reportCount} reports)`);
      return event;
    }
  }

  // Koi match nahi mila — naya event banao
  const newEvent = new WeatherEvent({
    eventType: report.eventType,
    location: {
      lat: report.location.lat,
      lng: report.location.lng
    },
    severity: report.severity,
    linkedReports: [report._id],
    reportCount: 1,
    sourceTypes: [report.sourceType],
    firstReportedAt: new Date(),
    lastReportedAt: new Date()
  });

  await newEvent.save();
  console.log(`[EventClustering] New event created: ${newEvent.eventType} at ${report.location.lat},${report.location.lng}`);
  return newEvent;
};