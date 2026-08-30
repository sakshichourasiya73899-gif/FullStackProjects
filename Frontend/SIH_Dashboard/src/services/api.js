// src/services/api.js
// Central API service layer — all backend calls go through here

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatEventType(type) {
  if (!type) return 'Unknown';
  return type
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function formatSeverity(severity) {
  if (!severity) return 'Unknown';
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

export function formatVelocity(velocity) {
  if (!velocity) return 'Stable';
  return velocity
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function formatLocation(location) {
  if (!location) return 'Unknown Location';
  const parts = [location.city, location.state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
      hour12: true, timeZone: 'Asia/Kolkata'
    });
  } catch {
    return '—';
  }
}

export function formatTimeAgo(dateStr) {
  if (!dateStr) return '—';
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return '—';
  }
}

export function getSafeSummary(summary) {
  if (!summary) return null;
  // Strip any AI reasoning tags that may have leaked through
  if (summary.includes('<think>') || summary.includes('</think>')) {
    return 'AI summary is being generated.';
  }
  return summary;
}

export function getTrendLabel(trend) {
  if (!trend) return { label: 'Stable', icon: 'trending_flat', color: 'text-on-surface-variant' };
  if (trend.isEmerging) return { label: '⚡ Emerging', icon: 'trending_up', color: 'text-error' };
  const v = trend.velocity || '';
  if (v.includes('increasing')) return { label: 'Increasing', icon: 'trending_up', color: 'text-secondary' };
  if (v.includes('decreasing')) return { label: 'Decreasing', icon: 'trending_down', color: 'text-primary' };
  return { label: 'Stable', icon: 'trending_flat', color: 'text-on-surface-variant' };
}

export function getSeverityColor(severity) {
  switch (severity) {
    case 'high': return 'text-error';
    case 'medium': return 'text-secondary';
    case 'low': return 'text-primary';
    default: return 'text-on-surface-variant';
  }
}

export function getSourceTypeIcon(sourceType) {
  switch (sourceType) {
    case 'news_rss': return 'newspaper';
    case 'social_mock': return 'forum';
    case 'weather_api': return 'api';
    case 'citizen': return 'groups';
    case 'satellite': return 'satellite_alt';
    default: return 'source';
  }
}

// ─── API Functions ─────────────────────────────────────────────────────────────

/**
 * Fetch active weather events with optional filters.
 * @param {Object} filters - { eventType, severity, isEmerging, minPriority, city, state, limit }
 */
export async function getActiveEvents(filters = {}) {
  const params = { limit: filters.limit || 200 };
  if (filters.eventType && filters.eventType !== 'all') params.eventType = filters.eventType;
  if (filters.severity && filters.severity !== 'all') params.severity = filters.severity;
  if (filters.isEmerging) params.isEmerging = true;
  if (filters.minPriority) params.minPriority = filters.minPriority;
  if (filters.city) params.city = filters.city;
  if (filters.state) params.state = filters.state;
  if (filters.status) params.status = filters.status;

  const res = await api.get('/events', { params });
  return res.data.events || [];
}

/**
 * Fetch a single event by ID.
 */
export async function getEventById(id) {
  const res = await api.get(`/events/${id}`);
  return res.data.event;
}

/**
 * Fetch linked WeatherReports for an event.
 */
export async function getEventReports(id) {
  const res = await api.get(`/events/${id}/reports`);
  return res.data.reports || [];
}

/**
 * Fetch analytics summary for dashboard.
 */
export async function getAnalyticsSummary() {
  const res = await api.get('/events/analytics/summary');
  return res.data.summary || {};
}

/**
 * Fetch reports with optional filters.
 * @param {Object} filters - { sourceType, eventType, severity, city, state, isDuplicate, hasMedia, limit, page }
 */
export async function getReports(filters = {}) {
  const params = { limit: filters.limit || 50, page: filters.page || 1 };
  if (filters.sourceType && filters.sourceType !== 'all') params.sourceType = filters.sourceType;
  if (filters.eventType && filters.eventType !== 'all') params.eventType = filters.eventType;
  if (filters.severity && filters.severity !== 'all') params.severity = filters.severity;
  if (filters.city) params.city = filters.city;
  if (filters.state) params.state = filters.state;
  if (filters.isDuplicate !== undefined && filters.isDuplicate !== 'all') params.isDuplicate = filters.isDuplicate;
  if (filters.hasMedia !== undefined && filters.hasMedia !== 'all') params.hasMedia = filters.hasMedia;

  const res = await api.get('/reports', { params });
  return res.data;
}

/**
 * Verify, reject, or flag an event.
 * @param {string} id - Event ID
 * @param {string} action - 'verify', 'reject', or 'flag'
 */
export async function updateEventStatus(id, action) {
  if (action === 'flag') {
    const res = await api.post(`/events/${id}/flag`);
    return res.data.event;
  } else {
    const res = await api.post(`/events/${id}/verify`, { action });
    return res.data.event;
  }
}

export default api;
