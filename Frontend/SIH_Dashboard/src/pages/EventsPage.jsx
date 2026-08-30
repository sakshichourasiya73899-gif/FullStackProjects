import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  getActiveEvents,
  formatEventType, formatLocation, formatTimeAgo,
  getTrendLabel, getSeverityColor, getSourceTypeIcon, updateEventStatus
} from '../services/api'

export default function EventsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const filters = {
    status: searchParams.get('status') || 'all',
    eventType: searchParams.get('eventType') || 'all',
    severity: searchParams.get('severity') || 'all',
    isEmerging: searchParams.get('isEmerging') === 'true',
    minPriority: searchParams.get('minPriority') || ''
  }

  const setFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const data = await getActiveEvents(filters)
        if (active) setEvents(data)
      } catch (err) {
        console.error(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [searchParams])

  const handleAction = async (e, id, action) => {
    e.stopPropagation()
    try {
      const updated = await updateEventStatus(id, action)
      setEvents(prev => prev.map(ev => ev._id === updated._id ? updated : ev))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-surface p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Intelligence Events</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Real-time clustered weather anomalies and synthesized events
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-sm flex flex-wrap gap-4 mb-6">
        <select 
          className="bg-surface border border-outline-variant text-on-surface text-sm rounded px-3 py-2"
          value={filters.eventType}
          onChange={e => setFilter('eventType', e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="flood">Flood</option>
          <option value="rainfall">Rainfall</option>
          <option value="dust_storm">Dust Storm</option>
          <option value="heatwave">Heatwave</option>
          <option value="fog">Fog</option>
          <option value="thunderstorm">Thunderstorm</option>
        </select>

        <select 
          className="bg-surface border border-outline-variant text-on-surface text-sm rounded px-3 py-2"
          value={filters.severity}
          onChange={e => setFilter('severity', e.target.value)}
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select 
          className="bg-surface border border-outline-variant text-on-surface text-sm rounded px-3 py-2"
          value={filters.status}
          onChange={e => setFilter('status', e.target.value)}
        >
          <option value="all">All Active Statuses</option>
          <option value="detected">Detected</option>
          <option value="emerging">Emerging</option>
          <option value="high_priority">High Priority</option>
          <option value="verified">Verified</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-on-surface bg-surface border border-outline-variant px-3 py-2 rounded cursor-pointer">
          <input 
            type="checkbox" 
            checked={filters.isEmerging} 
            onChange={e => setFilter('isEmerging', e.target.checked ? 'true' : null)}
          />
          Emerging Only
        </label>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant h-48 rounded-sm animate-pulse"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 text-outline-variant">inbox</span>
            <p>No events found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div 
                key={event._id} 
                className="bg-surface-container-lowest border border-outline-variant rounded-sm p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                onClick={() => navigate(`/evidence?eventId=${event._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    event.severity === 'high' ? 'bg-error text-on-error' :
                    event.severity === 'medium' ? 'bg-secondary text-on-secondary' :
                    'bg-primary text-on-primary'
                  }`}>
                    {event.severity || 'Unknown'}
                  </span>
                  <div className="flex gap-2">
                    {event.verificationStatus === 'verified' && (
                      <span className="material-symbols-outlined text-primary" title="Verified">verified</span>
                    )}
                    {event.trend?.isEmerging && (
                      <span className="material-symbols-outlined text-error" title="Emerging Threat">trending_up</span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-on-surface mb-1 truncate">{event.title || formatEventType(event.eventType)}</h3>
                <p className="text-sm text-on-surface-variant mb-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {formatLocation(event.location)}
                </p>

                <div className="grid grid-cols-2 gap-y-4 mb-4 mt-auto">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Reports</p>
                    <p className="font-semibold text-on-surface">{event.reportCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Priority</p>
                    <p className="font-semibold text-on-surface">{event.priorityScore}/100</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">AI Confidence</p>
                    <p className="font-semibold text-on-surface">{event.aiConfidence ? Math.round(event.aiConfidence*100)+'%' : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Last Activity</p>
                    <p className="font-semibold text-on-surface text-sm truncate">{formatTimeAgo(event.lastReportedAt)}</p>
                  </div>
                </div>

                <div className="border-t border-outline-variant pt-3 flex gap-2 justify-end">
                  {event.verificationStatus !== 'verified' && (
                    <button 
                      onClick={(e) => handleAction(e, event._id, 'verify')}
                      className="text-xs font-semibold px-3 py-1.5 border border-primary text-primary hover:bg-primary/10 rounded transition-colors"
                    >
                      Verify
                    </button>
                  )}
                  {event.verificationStatus !== 'rejected' && (
                    <button 
                      onClick={(e) => handleAction(e, event._id, 'reject')}
                      className="text-xs font-semibold px-3 py-1.5 border border-outline text-on-surface-variant hover:bg-surface-variant rounded transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  {event.status !== 'under_review' && (
                    <button 
                      onClick={(e) => handleAction(e, event._id, 'flag')}
                      className="text-xs font-semibold px-3 py-1.5 border border-error text-error hover:bg-error/10 rounded transition-colors"
                    >
                      Flag
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
