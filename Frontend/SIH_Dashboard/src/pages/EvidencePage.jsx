import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getActiveEvents, getEventReports, formatEventType, formatLocation, formatTimeAgo, getSafeSummary, getSourceTypeIcon } from '../services/api'

function getConfBadgeStyle(conf) {
  if (conf >= 95) return 'bg-error text-on-error border-error'
  if (conf >= 85) return 'bg-surface/90 text-on-surface border-outline-variant'
  return 'bg-surface-container-high text-on-surface border-outline-variant'
}

function getTypeIcon(sourceType) {
  switch (sourceType) {
    case 'news_rss': return 'newspaper'
    case 'social_mock': return 'forum'
    case 'weather_api': return 'api'
    case 'citizen': return 'groups'
    case 'satellite': return 'satellite_alt'
    default: return 'article'
  }
}

const mediaTypes = ['All', 'Text', 'Image', 'Video']

export default function EvidencePage() {
  const [searchParams] = useSearchParams()
  const initialEventId = searchParams.get('eventId')

  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingReports, setLoadingReports] = useState(false)
  const [error, setError] = useState(null)
  const [credibilityFilter, setCredibilityFilter] = useState(0)
  const [activeMedia, setActiveMedia] = useState('All')

  // Load events list
  useEffect(() => {
    async function load() {
      try {
        setLoadingEvents(true)
        setError(null)
        const eventsData = await getActiveEvents({ limit: 50 })
        setEvents(eventsData)
        if (eventsData.length > 0) {
          if (initialEventId) {
            const ev = eventsData.find(e => e._id === initialEventId)
            setSelectedEvent(ev || eventsData[0])
          } else {
            setSelectedEvent(eventsData[0])
          }
        }
      } catch (err) {
        console.error('[Evidence] Failed to load events:', err)
        setError('Unable to load evidence data. Please try again.')
      } finally {
        setLoadingEvents(false)
      }
    }
    load()
  }, [])

  // Load reports when event is selected
  useEffect(() => {
    if (!selectedEvent) return
    async function loadReports() {
      try {
        setLoadingReports(true)
        setSelectedReport(null)
        const reportsData = await getEventReports(selectedEvent._id)
        setReports(reportsData)
        if (reportsData.length > 0) setSelectedReport(reportsData[0])
      } catch (err) {
        console.error('[Evidence] Failed to load reports:', err)
        setReports([])
      } finally {
        setLoadingReports(false)
      }
    }
    loadReports()
  }, [selectedEvent])

  const filteredReports = reports.filter(r => {
    const credScore = r.credibility?.score ?? 0
    if (credScore < credibilityFilter) return false
    if (activeMedia === 'Image' && !(r.media?.some(m => m.type === 'image'))) return false
    if (activeMedia === 'Video' && !(r.media?.some(m => m.type === 'video'))) return false
    if (activeMedia === 'Text' && r.media?.length > 0) return false
    return true
  })

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      {/* Filter Sidebar */}
      <aside className="w-72 bg-surface border-r border-outline-variant flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10 flex justify-between items-center">
          <h2 className="font-semibold text-xl text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">filter_alt</span>
            Filters
          </h2>
          <button
            className="text-primary font-semibold text-xs uppercase tracking-widest hover:underline"
            onClick={() => { setCredibilityFilter(0); setActiveMedia('All') }}
          >
            RESET
          </button>
        </div>
        <div className="p-4 space-y-6">
          {/* Active Event Filter */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-on-surface-variant mb-3">ACTIVE EVENT</h3>
            {loadingEvents ? (
              <div className="space-y-2">
                {[0, 1, 2].map(i => <div key={i} className="h-8 bg-surface-variant rounded animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {events.map(event => (
                  <button
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className={`w-full text-left px-3 py-2 rounded text-xs transition-colors ${
                      selectedEvent?._id === event._id
                        ? 'bg-primary text-on-primary font-semibold'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="font-semibold truncate">{event.title || formatEventType(event.eventType)}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{formatLocation(event.location)} · {event.reportCount} reports</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Credibility */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-on-surface-variant mb-3">CREDIBILITY SCORE</h3>
            <div className="px-2">
              <input
                type="range" min="0" max="100" value={credibilityFilter}
                onChange={(e) => setCredibilityFilter(parseInt(e.target.value))}
                className="w-full h-1 bg-surface-variant rounded-sm appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between font-mono text-xs text-on-surface-variant mt-2">
                <span>0</span>
                <span>&gt; {credibilityFilter}</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Media Type */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-on-surface-variant mb-3">MEDIA TYPE</h3>
            <div className="flex flex-wrap gap-2">
              {mediaTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveMedia(type)}
                  className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider border flex items-center gap-1 transition-colors ${
                    activeMedia === type
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {type === 'Image' ? 'image' : type === 'Video' ? 'videocam' : 'article'}
                  </span>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Reports Grid */}
      <section className="flex-1 p-6 overflow-y-auto bg-surface-container-lowest relative">
        <div className="flex justify-between items-end mb-6 border-b border-outline-variant pb-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface mb-1">
              {selectedEvent ? (selectedEvent.title || formatEventType(selectedEvent.eventType)) : 'Evidence Center'}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {loadingReports
                ? 'Loading reports...'
                : `${filteredReports.length} report${filteredReports.length !== 1 ? 's' : ''} for this event`}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error rounded p-4 text-sm mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        {/* Grid */}
        {loadingReports ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-[160px]">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="rounded border border-outline-variant bg-surface-variant animate-pulse" />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 block">folder_open</span>
            <p className="font-semibold">No reports match the current filters.</p>
            <p className="text-sm mt-1">Try adjusting the credibility threshold or media type filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-[160px]">
            {filteredReports.map((report) => {
              const credScore = report.credibility?.score ?? 0
              const hasMedia = report.media && report.media.length > 0
              return (
                <div
                  key={report._id}
                  className={`rounded overflow-hidden relative cursor-pointer group transition-all duration-200 flex flex-col bg-surface-container-lowest ${
                    selectedReport?._id === report._id
                      ? 'border-2 border-primary shadow-sm'
                      : 'border border-outline-variant hover:border-primary'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  {hasMedia ? (
                    <>
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white/20 text-5xl">
                          {report.media[0]?.type === 'video' ? 'videocam' : 'image'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 pointer-events-none"></div>
                      <div className="absolute top-2 left-2 z-20 flex gap-1">
                        <span className={`px-2 py-0.5 font-mono text-[10px] rounded border ${getConfBadgeStyle(credScore)}`}>
                          {credScore}% CONF
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent z-20">
                        <p className="font-semibold text-xs uppercase tracking-wider text-white truncate">
                          {formatEventType(report.aiAnalysis?.eventType || report.sourceType)}
                        </p>
                        <p className="font-mono text-[9px] text-white/70">{formatTimeAgo(report.time?.reportedAt)}</p>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant font-mono text-[10px] rounded border border-outline-variant uppercase">
                            {report.sourceType?.replace('_', ' ') || 'TEXT'}
                          </span>
                          <span className="px-2 py-0.5 bg-surface-container-high text-on-surface font-mono text-[10px] rounded border border-outline-variant">
                            {credScore}% CONF
                          </span>
                        </div>
                        <p className="text-xs text-on-surface line-clamp-3">{report.text || '—'}</p>
                      </div>
                      <div className="mt-2 border-t border-outline-variant/50 pt-2 flex justify-between items-center">
                        <p className="font-mono text-[9px] text-on-surface-variant">{report.source?.sourceName || report.source?.platform || report.sourceType}</p>
                        <p className="font-mono text-[9px] text-on-surface-variant">{formatTimeAgo(report.time?.reportedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Right Detail Panel */}
      {selectedReport && (
        <aside className="w-[360px] bg-surface border-l border-outline-variant flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10 flex justify-between items-center">
            <h2 className="font-semibold text-xl text-on-surface">Report Detail</h2>
            <button className="text-on-surface-variant hover:text-on-surface" onClick={() => setSelectedReport(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Preview */}
          <div className="w-full h-56 relative flex items-center justify-center bg-surface-container-high">
            <span className="material-symbols-outlined text-white/20 text-7xl">
              {getTypeIcon(selectedReport.sourceType)}
            </span>
          </div>

          <div className="p-5 space-y-6">
            {/* Header Status */}
            <div className="flex justify-between items-start border-b border-outline-variant pb-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-1">
                  {formatEventType(selectedReport.aiAnalysis?.eventType || selectedReport.sourceType)}
                </h3>
                <p className="font-mono text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {formatLocation(selectedReport.location)}
                </p>
              </div>
              <span className={`px-2 py-1 font-semibold text-[10px] uppercase tracking-wider rounded border ${
                selectedReport.aiAnalysis?.severity === 'high'
                  ? 'bg-surface-container-lowest text-error border-error'
                  : 'bg-surface-container-lowest text-secondary border-secondary'
              }`}>
                {(selectedReport.aiAnalysis?.severity || 'unknown').toUpperCase()}
              </span>
            </div>

            {/* Report Text */}
            {selectedReport.text && (
              <div className="bg-surface-container-low p-3 rounded border border-outline-variant">
                <p className="text-xs text-on-surface leading-relaxed">"{selectedReport.text}"</p>
              </div>
            )}

            {/* AI Evidence Analysis Panel */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary">memory</span>
                  AI EVIDENCE ANALYSIS
                </h4>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Event Type:</span>
                  <span className="font-mono text-xs text-on-surface font-bold">
                    {formatEventType(selectedReport.aiAnalysis?.eventType)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Weather Related:</span>
                  <span className="font-mono text-xs text-on-surface font-bold">
                    {selectedReport.aiAnalysis?.isWeatherRelated ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Overall AI Confidence:</span>
                  <span className="font-mono text-xs text-primary font-bold">
                    {selectedReport.credibility?.score ?? selectedReport.aiAnalysis?.relevanceScore ?? '—'}%
                  </span>
                </div>
                <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${selectedReport.credibility?.score ?? 0}%` }}
                  ></div>
                </div>
              </div>
              {selectedReport.credibility?.reasons?.length > 0 && (
                <div className="bg-surface-container-low p-3 rounded border border-outline-variant">
                  <p className="text-xs text-on-surface leading-relaxed">
                    <strong>Credibility Reasons:</strong> {selectedReport.credibility.reasons.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Metadata Grid */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-on-surface-variant mb-3 border-b border-outline-variant pb-1">
                COLLECTION METADATA
              </h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                <div>
                  <p className="font-mono text-[10px] text-on-surface-variant mb-1">SOURCE</p>
                  <p className="text-sm text-on-surface truncate">
                    {selectedReport.source?.sourceName || selectedReport.source?.platform || selectedReport.sourceType || '—'}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-on-surface-variant mb-1">TIME IST</p>
                  <p className="text-sm text-on-surface">{formatTimeAgo(selectedReport.time?.reportedAt)}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-on-surface-variant mb-1">MEDIA</p>
                  <p className="text-sm text-on-surface">
                    {selectedReport.media?.length > 0 ? `${selectedReport.media.length} item(s)` : 'Text only'}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-on-surface-variant mb-1">VERIFICATION</p>
                  <p className="text-sm text-on-surface capitalize">
                    {selectedReport.credibility?.verificationStatus || selectedReport.duplicate?.isDuplicate ? 'Duplicate' : 'Unverified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-outline-variant flex flex-col gap-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-on-surface-variant mb-1">OFFICER ACTIONS</h4>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-primary text-on-primary rounded font-semibold text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors border border-primary">
                  VERIFY
                </button>
                <button className="flex-1 py-2 bg-surface-container-lowest border border-outline-variant text-on-surface rounded font-semibold text-xs uppercase tracking-wider hover:bg-surface-container-low transition-colors">
                  REJECT
                </button>
                <button className="flex-1 py-2 bg-surface-container-lowest border border-outline-variant text-error rounded font-semibold text-xs uppercase tracking-wider hover:bg-error/10 transition-colors">
                  FLAG
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
