// src/services/systemLogger.js
// In-memory circular log buffer for pipeline events.
// Not for production persistence — just exposes recent activity to the UI.

const LOG_BUFFER_MAX = 200;
const logBuffer = [];

/**
 * @param {'info'|'warn'|'error'|'success'} level
 * @param {string} stage  — e.g. 'Ingestion', 'AI Processing', 'Clustering'
 * @param {string} message
 */
export function pipelineLog(level, stage, message) {
  const entry = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    timestamp: new Date().toISOString(),
    level,
    stage,
    message,
  };
  logBuffer.unshift(entry); // newest first
  if (logBuffer.length > LOG_BUFFER_MAX) logBuffer.pop();
}

export function getRecentLogs(limit = 100) {
  return logBuffer.slice(0, limit);
}
