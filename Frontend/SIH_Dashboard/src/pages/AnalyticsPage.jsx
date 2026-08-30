import { useState, useEffect } from 'react'
import { getAnalyticsSummary, getActiveEvents, formatEventType, formatTimeAgo, formatLocation, getSafeSummary } from '../services/api'

function getSeverityDot(severity) {
  switch (severity) {
    case 'high': return 'bg-error'
    case 'medium': return 'bg-secondary'
    default: return 'bg-secondary'
  }
}

const pipelineSteps = [
  { icon: 'input', label: 'Data\nIngestion', borderColor: 'border-primary', bgColor: 'bg-primary-fixed', textColor: 'text-primary' },
  { icon: 'filter_alt', label: 'Relevance\nFilter', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'content_copy', label: 'Duplicate\nDetection', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'category', label: 'Event\nClassification', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'warning_amber', label: 'Severity\nAssessment', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'verified', label: 'Credibility\nScoring', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'location_on', label: 'Location\nMapping', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'hub', label: 'Event\nClustering', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'timeline', label: 'Trend\nAnalysis', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'model_training', label: 'Emerging\nSynthesis', borderColor: 'border-primary', bgColor: 'bg-primary', textColor: 'text-on-primary', isFinal: true },
]

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null)
  const [emergingEvents, setEmergingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const [summaryData, emerging] = await Promise.all([
          getAnalyticsSummary(),
          getActiveEvents({ isEmerging: true, limit: 10 })
        ])
        setSummary(summaryData)
        setEmergingEvents(emerging)
      } catch (err) {
        console.error('[Analytics] Failed to load data:', err)
        setError('Unable to load analytics data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [])

  const summaryCards = summary ? [
    {
      label: 'TOTAL ACTIVE EVENTS',
      value: summary.activeCount ?? '—',
      trend: 'Currently active',
      trendIcon: 'warning',
      color: 'secondary'
    },
    {
      label: 'HIGH SEVERITY',
      value: summary.highSeverityCount ?? '—',
      trend: 'Critical',
      trendIcon: 'warning',
      color: 'error'
    },
    {
      label: 'EMERGING EVENTS',
      value: summary.emergingCount ?? '—',
      trend: 'Needs attention',
      trendIcon: 'trending_up',
      color: 'primary'
    },
    {
      label: 'VERIFIED EVENTS',
      value: summary.verifiedCount ?? '—',
      trend: 'Confirmed',
      trendIcon: 'check_circle',
      color: 'secondary'
    },
  ] : null

  // Build source distribution from byType data
  const sourceIconMap = {
    flood: 'water', rainfall: 'water_drop', thunderstorm: 'thunderstorm',
    heatwave: 'thermostat', cyclone: 'cyclone', fog: 'foggy',
    dust_storm: 'air', strong_wind: 'air', drought: 'wb_sunny',
    cold_wave: 'ac_unit', wildfire: 'local_fire_department', other: 'help'
  }
  const colorList = ['bg-primary', 'bg-secondary', 'bg-primary-container', 'bg-outline', 'bg-outline-variant']
  const typeDistribution = summary?.byType
    ? Object.entries(summary.byType)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([type, count], i) => {
          const total = Object.values(summary.byType).reduce((a, b) => a + b, 0) || 1
          return {
            icon: sourceIconMap[type] || 'help',
            label: formatEventType(type),
            value: Math.round((count / total) * 100),
            color: colorList[i % colorList.length],
            delay: `${i * 0.1}s`
          }
        })
    : []

  // pipeline step counts from real data
  const pipelineWithCounts = pipelineSteps.map((step, i) => {
    if (i === 0) return { ...step, count: summary?.totalReports?.toString() || null, countBg: 'bg-primary' }
    if (i === 7) return { ...step, count: summary?.activeCount?.toString() || null, countBg: 'bg-primary-container' }
    if (i === 9) return { ...step, count: summary?.emergingCount?.toString() || null, countBg: 'bg-error' }
    return { ...step, count: null }
  })

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-surface p-8 gap-8">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Operational Pipeline View</h2>
          <p className="text-base text-on-surface-variant mt-1">Real-time data ingestion, processing throughput, and synthesized event surfacing.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-secondary text-on-surface font-semibold text-xs uppercase tracking-wider rounded flex items-center gap-2 hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-lg">history</span> View Logs
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-on-primary font-semibold text-xs uppercase tracking-wider rounded flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">refresh</span> Force Sync
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error text-error rounded p-4 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading || !summaryCards
          ? [0, 1, 2, 3].map(i => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-2 relative overflow-hidden rounded-sm shadow-sm animate-pulse">
                <div className="h-3 bg-surface-variant rounded w-3/4" />
                <div className="h-8 bg-surface-variant rounded w-1/2 mt-1" />
              </div>
            ))
          : summaryCards.map((card) => (
            <div key={card.label} className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-2 relative overflow-hidden rounded-sm shadow-sm">
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${card.color}`}></div>
              <span className="font-semibold text-xs uppercase tracking-widest text-on-surface-variant">{card.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">{card.value}</span>
                <span className={`font-mono text-xs text-${card.color} flex items-center`}>
                  {card.trendIcon && <span className="material-symbols-outlined text-sm">{card.trendIcon}</span>}
                  {card.trend}
                </span>
              </div>
            </div>
          ))}
      </section>

      {/* Pipeline Visualization */}
      <section className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-6 shadow-sm rounded-sm">
        <div className="flex justify-between items-end border-b border-outline-variant pb-2">
          <h3 className="font-semibold text-xl text-on-surface">Live Pipeline Throughput</h3>
          <span className="font-mono text-xs text-secondary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Operating Nominally
          </span>
        </div>
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex items-start gap-4 min-w-max relative pt-4">
            <div className="absolute top-[2.5rem] left-[5rem] right-[5rem] h-[2px] bg-outline-variant/30 z-0 hidden lg:block"></div>
            {pipelineWithCounts.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-2 z-10 w-28">
                <div className={`w-16 h-16 rounded-full border-2 ${step.borderColor} ${step.bgColor} flex items-center justify-center ${step.textColor} shadow-sm relative ${step.isFinal ? 'shadow-md' : ''}`}>
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                  {step.count && (
                    <div className={`absolute -top-2 -right-2 ${step.countBg} text-white text-[10px] font-mono px-1.5 py-0.5 rounded-sm ${step.isFinal ? 'font-bold shadow-sm' : ''}`}>
                      {step.count}
                    </div>
                  )}
                </div>
                <span className={`font-semibold text-[10px] text-center leading-tight uppercase tracking-wider whitespace-pre-line ${step.isFinal ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics & Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Event Type Distribution */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <section className="bg-surface-container-lowest border border-outline-variant p-5 shadow-sm rounded-sm">
            <h3 className="font-semibold text-xl text-on-surface mb-4">Event Type Distribution</h3>
            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-3 bg-surface-variant rounded w-full mb-1" />
                    <div className="h-1.5 bg-surface-variant rounded w-full" />
                  </div>
                ))}
              </div>
            ) : typeDistribution.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">No event data available.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {typeDistribution.map((source) => (
                  <div key={source.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">{source.icon}</span>
                        {source.label}
                      </span>
                      <span className="font-mono text-xs">{source.value}%</span>
                    </div>
                    <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${source.color} h-full animate-bar`}
                        style={{ width: `${source.value}%`, animationDelay: source.delay }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Severity Summary */}
          <section className="bg-surface-container-lowest border border-outline-variant p-5 shadow-sm rounded-sm">
            <h3 className="font-semibold text-xl text-on-surface mb-4">Severity Breakdown</h3>
            {loading ? (
              <div className="grid grid-cols-2 gap-4 animate-pulse">
                {[0, 1, 2].map(i => <div key={i} className="h-16 bg-surface-variant rounded" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-error/10 border border-error/30 p-3 rounded-sm text-center">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">HIGH</p>
                  <p className="text-2xl font-bold text-error">{summary?.bySeverity?.high ?? 0}</p>
                </div>
                <div className="bg-secondary/10 border border-secondary/30 p-3 rounded-sm text-center">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">MEDIUM</p>
                  <p className="text-2xl font-bold text-secondary">{summary?.bySeverity?.medium ?? 0}</p>
                </div>
                <div className="bg-primary/10 border border-primary/30 p-3 rounded-sm text-center col-span-2">
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">LOW</p>
                  <p className="text-2xl font-bold text-primary">{summary?.bySeverity?.low ?? 0}</p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Col: Live Emerging Events Table */}
        <div className="lg:col-span-2">
          <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-sm h-full flex flex-col">
            <div className="flex justify-between items-end border-b border-outline-variant p-5 pb-3">
              <div>
                <h3 className="font-semibold text-xl text-on-surface">Live Emerging Events</h3>
                <p className="text-sm text-on-surface-variant">Synthesized anomalies currently surfacing in the pipeline.</p>
              </div>
            </div>
            <div className="overflow-x-auto flex-1">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="h-4 bg-surface-variant rounded w-16" />
                      <div className="h-4 bg-surface-variant rounded flex-1" />
                      <div className="h-4 bg-surface-variant rounded w-20" />
                    </div>
                  ))}
                </div>
              ) : emergingEvents.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-3xl block mb-2">check_circle</span>
                  No emerging events detected at this time.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant whitespace-nowrap">PRIORITY</th>
                      <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant w-1/3">EVENT</th>
                      <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant w-1/4">LOCATION</th>
                      <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant text-right">REPORTS</th>
                      <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant w-32">CREDIBILITY</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {emergingEvents.map((event, index) => (
                      <tr
                        key={event._id}
                        className={`${index < emergingEvents.length - 1 ? 'border-b border-outline-variant' : ''} hover:bg-surface-container-low/50 transition-colors`}
                      >
                        <td className={`p-4 py-3 font-mono text-xs font-bold align-top pt-4 ${event.severity === 'high' ? 'text-error' : 'text-on-surface'}`}>
                          {event.priorityScore ?? '—'}
                        </td>
                        <td className="p-4 py-3 align-top pt-4">
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full ${getSeverityDot(event.severity)} mt-1 flex-shrink-0`}></div>
                            <div>
                              <span className="font-semibold text-on-surface block leading-tight">{event.title || formatEventType(event.eventType)}</span>
                              <span className="text-xs text-on-surface-variant mt-1 block">{formatEventType(event.eventType)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 py-3 align-top pt-4 text-xs text-on-surface-variant">
                          {formatLocation(event.location)}
                        </td>
                        <td className="p-4 py-3 text-right font-mono text-xs align-top pt-4">
                          {event.reportCount ?? 0}
                        </td>
                        <td className="p-4 py-3 align-top pt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: `${event.credibilityScore ?? event.corroboration?.score ?? 0}%` }}></div>
                            </div>
                            <span className="font-mono text-xs">{event.credibilityScore ?? event.corroboration?.score ?? 0}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
