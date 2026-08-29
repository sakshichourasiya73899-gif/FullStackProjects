const summaryCards = [
  { label: 'TOTAL EVENTS PROCESSED (24H)', value: '142,854', trend: '+12%', trendIcon: 'trending_up', color: 'secondary' },
  { label: 'HIGH SEVERITY ANOMALIES', value: '47', trend: 'Critical', trendIcon: 'warning', color: 'error' },
  { label: 'AVERAGE AI CONFIDENCE', value: '92.4%', trend: 'Stable', trendIcon: '', color: 'primary' },
  { label: 'SYSTEM LATENCY', value: '124ms', trend: 'Optimal', trendIcon: 'check_circle', color: 'secondary' },
]

const pipelineSteps = [
  { icon: 'input', label: 'Data\nIngestion', count: '1,485', countBg: 'bg-primary', borderColor: 'border-primary', bgColor: 'bg-primary-fixed', textColor: 'text-primary' },
  { icon: 'filter_alt', label: 'Relevance\nFilter', count: '1,102', countBg: 'bg-secondary', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'content_copy', label: 'Duplicate\nDetection', count: '-238', countBg: 'bg-outline', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'category', label: 'Event\nClassification', count: '864', countBg: 'bg-primary', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'warning_amber', label: 'Severity\nAssessment', count: null, borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'verified', label: 'Credibility\nScoring', count: null, borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'location_on', label: 'Location\nMapping', count: null, borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'hub', label: 'Event\nClustering', count: '126', countBg: 'bg-primary-container', borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'timeline', label: 'Trend\nAnalysis', count: null, borderColor: 'border-secondary', bgColor: 'bg-surface-container-lowest', textColor: 'text-secondary' },
  { icon: 'model_training', label: 'Emerging\nSynthesis', count: '12', countBg: 'bg-error', borderColor: 'border-primary', bgColor: 'bg-primary', textColor: 'text-on-primary', isFinal: true },
]

const sourceDistribution = [
  { icon: 'groups', label: 'Citizen Reports', value: 42, color: 'bg-primary', delay: '0s' },
  { icon: 'forum', label: 'Social Media', value: 28, color: 'bg-secondary', delay: '0.1s' },
  { icon: 'api', label: 'Weather APIs', value: 15, color: 'bg-primary-container', delay: '0.2s' },
  { icon: 'newspaper', label: 'News Outlets', value: 10, color: 'bg-outline', delay: '0.3s' },
  { icon: 'rss_feed', label: 'RSS Feeds', value: 5, color: 'bg-outline-variant', delay: '0.4s' },
]

const emergingEvents = [
  {
    id: 'EV-9942',
    cluster: 'Anomalous Monsoonal Trough Formation',
    region: 'Western Ghats Sector',
    signal: '+240% increase in localized reports (1hr)',
    signalDetail: 'Corroborated by 3 independent satellite API feeds indicating rapid pressure drop.',
    priority: 98.4,
    confidence: 95,
    severity: 'critical',
  },
  {
    id: 'EV-9940',
    cluster: 'Localized Urban Heat Island Spike',
    region: 'NCR Region',
    signal: 'Social sentiment shift detected',
    signalDetail: 'High volume of citizen keywords relating to extreme localized heat overriding regional forecasts.',
    priority: 82.1,
    confidence: 88,
    severity: 'high',
  },
  {
    id: 'EV-9938',
    cluster: 'Cyclonic Circulation Degradation',
    region: 'Bay of Bengal (Coastal)',
    signal: 'Model divergence flag',
    signalDetail: 'Primary prediction models diverging significantly from recent buoy data ingest.',
    priority: 76.5,
    confidence: 91,
    severity: 'medium',
  },
]

function getSeverityDot(severity) {
  switch (severity) {
    case 'critical': return 'bg-error'
    case 'high': return 'bg-secondary'
    default: return 'bg-secondary'
  }
}

export default function AnalyticsPage() {
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
          <button className="px-4 py-2 bg-primary text-on-primary font-semibold text-xs uppercase tracking-wider rounded flex items-center gap-2 hover:bg-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">refresh</span> Force Sync
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
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
          <h3 className="font-semibold text-xl text-on-surface">Live Pipeline Throughput (Last 1hr)</h3>
          <span className="font-mono text-xs text-secondary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Operating Nominally
          </span>
        </div>
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex items-start gap-4 min-w-max relative pt-4">
            {/* Connection Line */}
            <div className="absolute top-[2.5rem] left-[5rem] right-[5rem] h-[2px] bg-outline-variant/30 z-0 hidden lg:block"></div>
            {pipelineSteps.map((step, index) => (
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
        {/* Left Col: System Analytics */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Source Distribution */}
          <section className="bg-surface-container-lowest border border-outline-variant p-5 shadow-sm rounded-sm">
            <h3 className="font-semibold text-xl text-on-surface mb-4">Source Distribution</h3>
            <div className="flex flex-col gap-3">
              {sourceDistribution.map((source) => (
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
          </section>

          {/* Processing Performance */}
          <section className="bg-surface-container-lowest border border-outline-variant p-5 shadow-sm rounded-sm">
            <h3 className="font-semibold text-xl text-on-surface mb-4">Processing Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-3 rounded-sm flex flex-col items-center justify-center text-center">
                <span className="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">P95 Latency</span>
                <span className="text-2xl font-bold text-on-surface">148ms</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-sm flex flex-col items-center justify-center text-center">
                <span className="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">False Positives</span>
                <span className="text-2xl font-bold text-on-surface">&lt; 0.4%</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-sm flex flex-col items-center justify-center text-center col-span-2">
                <span className="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Inference Confidence Ratio</span>
                <div className="w-full h-2 flex rounded-sm overflow-hidden mt-2">
                  <div className="bg-primary h-full" style={{ width: '75%' }} title="High Confidence (>90%)"></div>
                  <div className="bg-secondary h-full" style={{ width: '20%' }} title="Medium Confidence (70-90%)"></div>
                  <div className="bg-error h-full" style={{ width: '5%' }} title="Low Confidence (<70%)"></div>
                </div>
                <div className="w-full flex justify-between mt-1 px-1">
                  <span className="text-[10px] font-mono text-primary">High 75%</span>
                  <span className="text-[10px] font-mono text-error">Review 5%</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Col: Emerging Events Table */}
        <div className="lg:col-span-2">
          <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-sm h-full flex flex-col">
            <div className="flex justify-between items-end border-b border-outline-variant p-5 pb-3">
              <div>
                <h3 className="font-semibold text-xl text-on-surface">Live Emerging Events</h3>
                <p className="text-sm text-on-surface-variant">Synthesized anomalies currently surfacing in the pipeline.</p>
              </div>
              <button className="text-secondary font-semibold text-xs uppercase tracking-wider hover:underline flex items-center gap-1">
                View Full Dashboard <span className="material-symbols-outlined text-base">arrow_right_alt</span>
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant whitespace-nowrap">ID</th>
                    <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant w-1/4">EVENT CLUSTER</th>
                    <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant w-1/3">EMERGENCE SIGNAL (WHY)</th>
                    <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant text-right">PRIORITY SCORE</th>
                    <th className="p-4 py-3 font-semibold text-xs uppercase tracking-wider text-on-surface-variant w-32">CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {emergingEvents.map((event, index) => (
                    <tr
                      key={event.id}
                      className={`${index < emergingEvents.length - 1 ? 'border-b border-outline-variant' : ''} hover:bg-surface-container-low/50 transition-colors`}
                    >
                      <td className="p-4 py-3 font-mono text-xs text-on-surface-variant align-top pt-4">{event.id}</td>
                      <td className="p-4 py-3 align-top pt-4">
                        <div className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full ${getSeverityDot(event.severity)} mt-1 flex-shrink-0`}></div>
                          <div>
                            <span className="font-semibold text-on-surface block leading-tight">{event.cluster}</span>
                            <span className="text-xs text-on-surface-variant mt-1 block">{event.region}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="text-on-surface font-semibold text-xs">
                            {event.severity === 'critical' && <span className="text-error font-bold">{event.signal.split(' ')[0]}</span>}
                            {event.severity === 'critical' ? event.signal.substring(event.signal.indexOf(' ')) : event.signal}
                          </span>
                          <span className="text-xs text-on-surface-variant">{event.signalDetail}</span>
                        </div>
                      </td>
                      <td className={`p-4 py-3 text-right font-mono text-xs font-bold align-top pt-4 text-base ${
                        event.severity === 'critical' ? 'text-error' : 'text-on-surface'
                      }`}>
                        {event.priority}
                      </td>
                      <td className="p-4 py-3 align-top pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${event.confidence}%` }}></div>
                          </div>
                          <span className="font-mono text-xs">{event.confidence}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
