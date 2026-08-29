import { useState } from 'react'

const activeEvent = {
  id: 'EV-2024-NGP',
  title: 'Nagpur Flood',
  region: 'Maharashtra Zone',
  startTime: '04:00 IST',
  severity: 'CRITICAL',
  summary: 'Significant precipitation over the last 12 hours has led to critical waterlogging in low-lying central districts. Social media sentiment indicates rising panic regarding transportation disruptions. Local municipal authorities have initiated preliminary evacuation protocols for Zone 4.',
  stats: {
    reports: 847,
    mediaItems: 312,
    affectedPop: '~1.2M',
    responseTeams: 24,
  },
}

const liveFeed = [
  {
    id: 1,
    icon: 'campaign',
    source: 'IMD Alert',
    time: '23:45 IST',
    message: 'Red alert issued for Nagpur district. Expected 200mm+ rainfall in next 6 hours.',
    severity: 'critical',
  },
  {
    id: 2,
    icon: 'groups',
    source: 'Citizen Report',
    time: '23:38 IST',
    message: 'Water level at Ambazari Lake rising rapidly. Residents near spillway area reporting concern.',
    severity: 'high',
  },
  {
    id: 3,
    icon: 'forum',
    source: 'Twitter/X API',
    time: '23:32 IST',
    message: '#NagpurFlood trending. 2,400+ posts in the last hour. Sentiment: 72% fear, 18% informational.',
    severity: 'medium',
  },
  {
    id: 4,
    icon: 'satellite_alt',
    source: 'Satellite Feed',
    time: '23:28 IST',
    message: 'INSAT-3D imagery confirms large-scale cloud cluster over Vidarbha. Convective tops exceeding 14km.',
    severity: 'high',
  },
  {
    id: 5,
    icon: 'newspaper',
    source: 'News RSS',
    time: '23:20 IST',
    message: 'NDRF deploys 6 teams to Nagpur. Rescue operations commence in Sitabuldi and Dharampeth areas.',
    severity: 'medium',
  },
  {
    id: 6,
    icon: 'api',
    source: 'Weather API',
    time: '23:15 IST',
    message: 'Sustained wind speeds at 45 kmph with gusts up to 70 kmph recorded at Sonegaon station.',
    severity: 'medium',
  },
]

const statusCards = [
  { label: 'ACTIVE EVENTS', value: '12', trend: '+3 today', icon: 'warning', color: 'error' },
  { label: 'DATA STREAMS', value: '48', trend: 'All nominal', icon: 'stream', color: 'secondary' },
  { label: 'AI CONFIDENCE', value: '94.2%', trend: 'Above threshold', icon: 'psychology', color: 'primary' },
  { label: 'ALERT QUEUE', value: '7', trend: '3 pending review', icon: 'notification_important', color: 'primary-container' },
]

function getSeverityStyle(severity) {
  switch (severity) {
    case 'critical': return 'bg-error/10 border-error text-error'
    case 'high': return 'bg-secondary/10 border-secondary text-secondary'
    default: return 'bg-surface-container-low border-outline-variant text-on-surface-variant'
  }
}

function getSeverityDot(severity) {
  switch (severity) {
    case 'critical': return 'bg-error'
    case 'high': return 'bg-secondary'
    default: return 'bg-outline'
  }
}

export default function DashboardPage() {
  const [selectedFeedItem, setSelectedFeedItem] = useState(null)

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-surface p-8 gap-8">
      {/* Status Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusCards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-2 relative overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-shadow"
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
          {/* Event Header Card */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-sm shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 bg-error text-on-error font-mono text-xs rounded font-bold tracking-wider">
                      {activeEvent.severity}
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">{activeEvent.id}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-on-surface">{activeEvent.title}</h2>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {activeEvent.region} • Started {activeEvent.startTime}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-outline-variant rounded text-xs font-semibold uppercase tracking-wider text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Full Report
                  </button>
                </div>
              </div>
              <p className="text-sm text-on-surface leading-relaxed">
                {activeEvent.summary}
              </p>
            </div>

            {/* Event Stats */}
            <div className="grid grid-cols-4 divide-x divide-outline-variant">
              <div className="p-4 text-center">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">REPORTS</p>
                <p className="text-xl font-bold text-on-surface">{activeEvent.stats.reports}</p>
              </div>
              <div className="p-4 text-center">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">MEDIA ITEMS</p>
                <p className="text-xl font-bold text-on-surface">{activeEvent.stats.mediaItems}</p>
              </div>
              <div className="p-4 text-center">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">AFFECTED POP.</p>
                <p className="text-xl font-bold text-on-surface">{activeEvent.stats.affectedPop}</p>
              </div>
              <div className="p-4 text-center">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">RESPONSE TEAMS</p>
                <p className="text-xl font-bold text-on-surface">{activeEvent.stats.responseTeams}</p>
              </div>
            </div>
          </section>

          {/* AI Situational Assessment */}
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
                <p className="text-lg font-bold text-error">ESCALATING</p>
                <p className="text-xs text-on-surface-variant mt-1">Expected to intensify over next 4-6 hours</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-sm">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">PREDICTION CONFIDENCE</p>
                <p className="text-lg font-bold text-on-surface">91.8%</p>
                <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-primary h-full w-[91.8%]"></div>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-sm">
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">RECOMMENDED ACTION</p>
                <p className="text-lg font-bold text-secondary">ELEVATE</p>
                <p className="text-xs text-on-surface-variant mt-1">Escalate to State Emergency Operations</p>
              </div>
            </div>
          </section>
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
              {liveFeed.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border-b border-outline-variant/50 hover:bg-surface-container-low/50 transition-colors cursor-pointer ${
                    selectedFeedItem === item.id ? 'bg-primary-fixed/30 border-l-2 border-l-primary' : ''
                  }`}
                  onClick={() => setSelectedFeedItem(item.id === selectedFeedItem ? null : item.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getSeverityDot(item.severity)}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-on-surface-variant">{item.icon}</span>
                          {item.source}
                        </span>
                        <span className="font-mono text-[10px] text-on-surface-variant whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
