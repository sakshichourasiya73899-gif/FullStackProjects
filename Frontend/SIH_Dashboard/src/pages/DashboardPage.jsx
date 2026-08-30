import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import {
  getActiveEvents, getAnalyticsSummary,
  formatEventType, formatLocation, formatTimeAgo,
  getTrendLabel, getSafeSummary, getSourceTypeIcon, getSeverityColor
} from '../services/api'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
const socket = io(SOCKET_URL)

function getSeverityDot(severity) {
  switch (severity) {
    case 'high': return 'bg-error'
    case 'medium': return 'bg-secondary'
    default: return 'bg-outline'
  }
}

function SummaryCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-2 relative overflow-hidden rounded-sm shadow-sm animate-pulse">
      <div className="h-3 bg-surface-variant rounded w-3/4" />
      <div className="h-8 bg-surface-variant rounded w-1/2 mt-1" />
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [selectedFeedItem, setSelectedFeedItem] = useState(null)
  const [events, setEvents] = useState([])
  const [summary, setSummary] = useState(null)
  const [topEvent, setTopEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const [eventsData, summaryData] = await Promise.all([
          getActiveEvents({ limit: 20 }),
          getAnalyticsSummary()
        ])
        setEvents(eventsData)
        setSummary(summaryData)
        setTopEvent(eventsData[0] || null) // highest priority event
      } catch (err) {
        console.error('[Dashboard] Failed to load data:', err)
        setError('Unable to load weather intelligence data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
    // Auto-refresh every 60 seconds
    const interval = setInterval(load, 60000)

    // Socket.io for realtime updates
    socket.on('newEvent', (event) => {
      setEvents(prev => {
        const newEvents = [event, ...prev].sort((a, b) => b.priorityScore - a.priorityScore)
        setTopEvent(newEvents[0])
        return newEvents
      })
      // We don't fetch full analytics summary here to save requests, just wait for the 60s interval or user reload.
    })

    socket.on('eventUpdated', (updated) => {
      setEvents(prev => {
        const newEvents = prev.map(e => e._id === updated._id ? updated : e).sort((a, b) => b.priorityScore - a.priorityScore)
        setTopEvent(newEvents[0])
        return newEvents
      })
    })

    return () => {
      clearInterval(interval)
      socket.off('newEvent')
      socket.off('eventUpdated')
    }
  }, [])

  const statusCards = summary ? [
    {
      label: 'ACTIVE EVENTS',
      value: summary.activeCount ?? '—',
      trend: summary.activeCount > 0 ? 'Currently active' : 'No active events',
      icon: 'warning',
      color: 'error',
      link: '/events'
    },
    {
      label: 'EMERGING THREATS',
      value: summary.emergingCount ?? '—',
      trend: summary.emergingCount > 0 ? '⚡ Needs attention' : 'None detected',
      icon: 'trending_up',
      color: 'secondary',
      link: '/events?isEmerging=true'
    },
    {
      label: 'HIGH PRIORITY',
      value: summary.highPriorityCount ?? '—',
      trend: 'Score ≥ 70',
      icon: 'priority_high',
      color: 'primary',
      link: '/events?minPriority=70'
    },
    {
      label: 'VERIFIED',
      value: summary.verifiedCount ?? '—',
      trend: 'Confirmed events',
      icon: 'verified',
      color: 'primary-container',
      link: '/events?status=verified'
    },
  ] : null

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-surface p-8 gap-8">

      {/* Error State */}
      {error && (
        <div className="bg-error/10 border border-error text-error rounded p-4 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {/* Status Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading || !statusCards
          ? [0, 1, 2, 3].map(i => <SummaryCardSkeleton key={i} />)
          : statusCards.map((card) => (
            <div
              key={card.label}
              onClick={() => card.link && navigate(card.link)}
              className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-2 relative overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${card.color}`}></div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs tracking-widest uppercase text-on-surface-variant">{card.label}</span>
                <span className={`material-symbols-outlined text-lg text-${card.color}`}>{card.icon}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">{card.value}</span>
                <span className="font-mono text-xs text-on-surface-variant">{card.trend}</span>
              </div>
            </div>
          ))}
      </section>

      {/* Main Content: Active Event + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Active Event Detail */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Top Event Header Card */}
          {loading ? (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-sm shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-surface-variant rounded w-1/3 mb-3" />
              <div className="h-10 bg-surface-variant rounded w-2/3 mb-2" />
              <div className="h-4 bg-surface-variant rounded w-full mt-4" />
              <div className="h-4 bg-surface-variant rounded w-5/6 mt-2" />
            </section>
          ) : topEvent ? (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-sm shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 font-mono text-xs rounded font-bold tracking-wider ${
                        topEvent.severity === 'high' ? 'bg-error text-on-error' :
                        topEvent.severity === 'medium' ? 'bg-secondary text-on-secondary' :
                        'bg-primary text-on-primary'
                      }`}>
                        {(topEvent.severity || 'UNKNOWN').toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-on-surface-variant">
                        Priority: {topEvent.priorityScore}/100
                      </span>
                      {topEvent.trend?.isEmerging && (
                        <span className="px-2 py-0.5 bg-error/10 text-error border border-error font-mono text-xs rounded font-bold">
                          ⚡ EMERGING
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl font-bold text-on-surface">{topEvent.title || formatEventType(topEvent.eventType)}</h2>
                    <p className="text-sm text-on-surface-variant mt-1">
                      {formatLocation(topEvent.location)} · Last report {formatTimeAgo(topEvent.lastReportedAt)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-on-surface leading-relaxed">
                  {getSafeSummary(topEvent.summary) || `${formatEventType(topEvent.eventType)} event detected with ${topEvent.reportCount || 0} reports from ${topEvent.uniqueSourceCount || 1} unique source(s).`}
                </p>
              </div>

              {/* Event Stats */}
              <div className="grid grid-cols-4 divide-x divide-outline-variant">
                <div className="p-4 text-center">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">REPORTS</p>
                  <p className="text-xl font-bold text-on-surface">{topEvent.reportCount || 0}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">SOURCES</p>
                  <p className="text-xl font-bold text-on-surface">{topEvent.uniqueSourceCount || 1}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">CREDIBILITY</p>
                  <p className="text-xl font-bold text-on-surface">{topEvent.credibilityScore ?? topEvent.corroboration?.score ?? '—'}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">AI CONFIDENCE</p>
                  <p className="text-xl font-bold text-on-surface">
                    {topEvent.aiConfidence ? `${Math.round(topEvent.aiConfidence * 100)}%` : '—'}
                  </p>
                </div>
              </div>
            </section>
          ) : !error && (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-sm shadow-sm p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-3 block">cloud_off</span>
              <p className="font-semibold">No active weather events</p>
              <p className="text-sm mt-1">Events will appear here as the system processes incoming data.</p>
            </section>
          )}

          {/* AI Situational Assessment */}
          {topEvent && (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-sm shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-outline-variant pb-3">
                <span className="material-symbols-outlined text-primary">memory</span>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-on-surface">AI Situational Assessment</h3>
                <span className="ml-auto font-mono text-xs text-secondary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  Live Analysis
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-container-low p-4 rounded-sm">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">THREAT TRAJECTORY</p>
                  <p className={`text-lg font-bold ${getTrendLabel(topEvent.trend).color}`}>
                    {getTrendLabel(topEvent.trend).label.replace('⚡ ', '').toUpperCase() || 'STABLE'}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {topEvent.trend?.reportsLast15Min > 0
                      ? `${topEvent.trend.reportsLast15Min} reports in last 15 min`
                      : 'Monitoring ongoing'}
                  </p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-sm">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">AI CONFIDENCE</p>
                  <p className="text-lg font-bold text-on-surface">
                    {topEvent.aiConfidence ? `${Math.round(topEvent.aiConfidence * 100)}%` : 'N/A'}
                  </p>
                  {topEvent.aiConfidence && (
                    <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-2">
                      <div className="bg-primary h-full" style={{ width: `${Math.round(topEvent.aiConfidence * 100)}%` }}></div>
                    </div>
                  )}
                </div>
                <div className="bg-surface-container-low p-4 rounded-sm">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">CORROBORATION</p>
                  <p className="text-lg font-bold text-secondary capitalize">
                    {topEvent.corroboration?.level || 'Low'}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Score: {topEvent.corroboration?.score ?? '—'}/100
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Live Intelligence Feed */}
        <div className="lg:col-span-1">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-sm shadow-sm h-full flex flex-col">
            <div className="p-4 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface-container-lowest z-10">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-secondary">feed</span>
                Live Intelligence Feed
              </h3>
              <span className="flex items-center gap-1 font-mono text-xs text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                LIVE
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                [0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="p-4 border-b border-outline-variant/50 animate-pulse">
                    <div className="h-3 bg-surface-variant rounded w-2/3 mb-2" />
                    <div className="h-3 bg-surface-variant rounded w-full" />
                  </div>
                ))
              ) : events.length === 0 ? (
                <div className="p-8 text-center text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-3xl block mb-2">inbox</span>
                  No active events match current filters.
                </div>
              ) : (
                events.map((event) => {
                  const trendInfo = getTrendLabel(event.trend)
                  return (
                    <div
                      key={event._id}
                      className={`p-4 border-b border-outline-variant/50 hover:bg-surface-container-low/50 transition-colors cursor-pointer ${
                        selectedFeedItem === event._id ? 'bg-primary-fixed/30 border-l-2 border-l-primary' : ''
                      }`}
                      onClick={() => setSelectedFeedItem(event._id === selectedFeedItem ? null : event._id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getSeverityDot(event.severity)}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm text-on-surface-variant">
                                {getSourceTypeIcon(event.sourceTypes?.[0])}
                              </span>
                              {formatEventType(event.eventType)}
                            </span>
                            <span className="font-mono text-[10px] text-on-surface-variant whitespace-nowrap">
                              {formatTimeAgo(event.lastReportedAt)}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-on-surface truncate">{event.title}</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
                            {formatLocation(event.location)} · {event.reportCount} report{event.reportCount !== 1 ? 's' : ''}
                          </p>
                          {event.trend?.isEmerging && (
                            <span className="text-[10px] text-error font-bold mt-1 block">⚡ EMERGING</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
