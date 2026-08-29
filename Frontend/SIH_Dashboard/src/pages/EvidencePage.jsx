import { useState } from 'react'

const evidenceItems = [
  {
    id: 1,
    title: 'SW Tarrant County',
    type: 'image',
    confidence: 96,
    time: '14:22 IST',
    event: 'Severe Thunderstorm',
    location: 'SW Tarrant County (32.7°N, 97.4°W)',
    threat: 'HIGH THREAT',
    source: 'Twitter API (Verified)',
    mediaType: 'Image (JPEG)',
    analysis: 'Distinct supercell structure with well-defined mesocyclone and wall cloud lowering. Pronounced dark, green-tinted core indicating significant hail content. No visible funnel cloud at time of capture. EXIF data confirmed; no digital manipulation detected.',
    span: 'col-span-2 row-span-2',
    bgColor: 'bg-gradient-to-br from-slate-700 to-slate-900',
    featured: true,
  },
  {
    id: 2,
    title: 'Main & 5th Flooding',
    type: 'video',
    confidence: 88,
    time: '13:45 IST',
    event: 'Flash Flooding',
    location: 'Downtown District',
    threat: 'MODERATE',
    source: 'Security Camera',
    mediaType: 'Video (MP4)',
    analysis: 'CCTV footage confirms rapid water rise at intersection. Vehicles partially submerged. Estimated water depth 1.2m based on visual markers.',
    span: 'col-span-1 row-span-1',
    bgColor: 'bg-gradient-to-br from-blue-800 to-blue-950',
  },
  {
    id: 3,
    title: 'North Austin Hail Report',
    type: 'text',
    confidence: 75,
    time: '14:05 IST',
    text: '"Hail the size of golf balls just started hitting our roof in North Austin. Cars are getting dented out here. Wind is picking up fast."',
    event: 'Severe Thunderstorm',
    location: 'North Austin, TX',
    threat: 'MODERATE',
    source: '@txweatherwatcher',
    mediaType: 'Text',
    analysis: 'Citizen report correlates with NEXRAD reflectivity data showing large hail signatures. Cross-referenced with 3 similar reports from same area.',
    span: 'col-span-1 row-span-1',
    bgColor: '',
    isText: true,
  },
  {
    id: 4,
    title: 'North Austin',
    type: 'image',
    confidence: 91,
    time: '14:10 IST',
    event: 'Hailstorm',
    location: 'North Austin, TX',
    threat: 'HIGH THREAT',
    source: 'Citizen Upload',
    mediaType: 'Image (JPEG)',
    analysis: 'Hailstones measurement confirmed at 4.5cm diameter. Multiple impact points visible on vehicle surfaces.',
    span: 'col-span-1 row-span-1',
    bgColor: 'bg-gradient-to-br from-gray-600 to-gray-800',
  },
  {
    id: 5,
    title: 'NEXRAD Overlay',
    type: 'image',
    confidence: 99,
    time: '14:20 IST',
    event: 'Severe Thunderstorm',
    location: 'Central Texas Region',
    threat: 'EXTREME',
    source: 'NEXRAD System',
    mediaType: 'Image (PNG)',
    analysis: 'Maximum reflectivity exceeding 65 dBZ with rotation signature detected. Hail core confirmed with satellite correlation.',
    span: 'col-span-1 row-span-1',
    bgColor: 'bg-gradient-to-br from-purple-900 to-indigo-950',
  },
]

const eventTypes = [
  { label: 'Severe Thunderstorm', checked: true },
  { label: 'Flash Flooding', checked: true },
  { label: 'Tornado Warning', checked: false },
  { label: 'Winter Storm', checked: false },
]

const mediaTypes = ['Image', 'Video', 'Text/News']

function getConfBadgeStyle(conf) {
  if (conf >= 95) return 'bg-error text-on-error border-error'
  if (conf >= 85) return 'bg-surface/90 text-on-surface border-outline-variant'
  return 'bg-surface-container-high text-on-surface border-outline-variant'
}

function getTypeIcon(type) {
  switch (type) {
    case 'image': return 'image'
    case 'video': return 'videocam'
    case 'text': return 'article'
    default: return 'image'
  }
}

export default function EvidencePage() {
  const [selectedItem, setSelectedItem] = useState(evidenceItems[0])
  const [filters, setFilters] = useState({
    eventTypes: eventTypes.map(e => ({ ...e })),
    credibility: 70,
    activeMedia: 'Image',
  })

  const toggleEventType = (index) => {
    setFilters(prev => {
      const newTypes = [...prev.eventTypes]
      newTypes[index] = { ...newTypes[index], checked: !newTypes[index].checked }
      return { ...prev, eventTypes: newTypes }
    })
  }

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      {/* Filter Sidebar */}
      <aside className="w-72 bg-surface border-r border-outline-variant flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10 flex justify-between items-center">
          <h2 className="font-semibold text-xl text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">filter_alt</span>
            Filters
          </h2>
          <button className="text-primary font-semibold text-xs uppercase tracking-widest hover:underline">RESET</button>
        </div>
        <div className="p-4 space-y-6">
          {/* Event Type */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-on-surface-variant mb-3">EVENT TYPE</h3>
            <div className="space-y-2">
              {filters.eventTypes.map((item, index) => (
                <label key={item.label} className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleEventType(index)}
                    className="rounded-sm border-outline text-primary focus:ring-primary w-4 h-4 accent-primary"
                  />
                  <span className="group-hover:text-primary transition-colors text-on-surface">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Credibility */}
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest text-on-surface-variant mb-3">CREDIBILITY SCORE</h3>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.credibility}
                onChange={(e) => setFilters(prev => ({ ...prev, credibility: parseInt(e.target.value) }))}
                className="w-full h-1 bg-surface-variant rounded-sm appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between font-mono text-xs text-on-surface-variant mt-2">
                <span>0</span>
                <span>&gt; {filters.credibility}</span>
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
                  onClick={() => setFilters(prev => ({ ...prev, activeMedia: type }))}
                  className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider border flex items-center gap-1 transition-colors ${
                    filters.activeMedia === type
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

      {/* Evidence Grid */}
      <section className="flex-1 p-6 overflow-y-auto bg-surface-container-lowest relative">
        <div className="flex justify-between items-end mb-6 border-b border-outline-variant pb-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface mb-1">Recent Submissions</h2>
            <p className="text-sm text-on-surface-variant">Displaying 142 items matching current filters from the past 24 hours.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-outline-variant rounded bg-surface-container-lowest text-on-surface font-semibold text-xs uppercase tracking-wider flex items-center gap-1 hover:bg-surface-container-low">
              <span className="material-symbols-outlined text-base">sort</span>
              Newest First
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-[160px]">
          {evidenceItems.map((item) => (
            <div
              key={item.id}
              className={`${item.span} rounded overflow-hidden relative cursor-pointer group transition-all duration-200 ${
                selectedItem?.id === item.id
                  ? 'border-2 border-primary shadow-sm'
                  : 'border border-outline-variant hover:border-primary'
              } ${item.isText ? 'bg-surface-container-lowest flex flex-col' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              {item.isText ? (
                /* Text Item */
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant font-mono text-[10px] rounded border border-outline-variant">TEXT</span>
                      <span className="px-2 py-0.5 bg-surface-container-high text-on-surface font-mono text-[10px] rounded border border-outline-variant">{item.confidence}% CONF</span>
                    </div>
                    <p className="text-xs text-on-surface line-clamp-3">{item.text}</p>
                  </div>
                  <div className="mt-2 border-t border-outline-variant/50 pt-2 flex justify-between items-center">
                    <p className="font-mono text-[9px] text-on-surface-variant">{item.source}</p>
                  </div>
                </div>
              ) : (
                /* Image/Video Item */
                <>
                  <div className={`w-full h-full ${item.bgColor} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-white/20 text-6xl">{getTypeIcon(item.type)}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10 pointer-events-none"></div>
                  <div className="absolute top-2 left-2 z-20 flex gap-1">
                    <span className={`px-2 py-0.5 font-mono text-[10px] rounded border ${getConfBadgeStyle(item.confidence)}`}>
                      {item.confidence}% CONF
                    </span>
                    <span className="px-2 py-0.5 bg-surface/90 text-on-surface font-mono text-[10px] rounded flex items-center gap-1 border border-outline-variant">
                      <span className="material-symbols-outlined text-[10px]">{getTypeIcon(item.type)}</span>
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent z-20">
                    <p className="font-semibold text-xs uppercase tracking-wider text-white truncate">{item.title}</p>
                    <p className="font-mono text-[9px] text-white/70">{item.time}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Right Detail Panel */}
      {selectedItem && (
        <aside className="w-[360px] bg-surface border-l border-outline-variant flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10 flex justify-between items-center">
            <h2 className="font-semibold text-xl text-on-surface">Investigation Detail</h2>
            <button
              className="text-on-surface-variant hover:text-on-surface"
              onClick={() => setSelectedItem(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Preview */}
          <div className={`w-full h-56 relative flex items-center justify-center ${selectedItem.bgColor || 'bg-surface-container-high'}`}>
            <span className="material-symbols-outlined text-white/20 text-7xl">{getTypeIcon(selectedItem.type)}</span>
            <div className="absolute top-2 right-2 flex gap-2">
              <button className="p-1 bg-surface-container-lowest rounded text-on-surface hover:bg-surface border border-outline-variant">
                <span className="material-symbols-outlined text-base">fullscreen</span>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* Header Status */}
            <div className="flex justify-between items-start border-b border-outline-variant pb-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-1">{selectedItem.event || selectedItem.title}</h3>
                <p className="font-mono text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {selectedItem.location}
                </p>
              </div>
              <span className={`px-2 py-1 font-semibold text-[10px] uppercase tracking-wider rounded border ${
                selectedItem.threat === 'HIGH THREAT' || selectedItem.threat === 'EXTREME'
                  ? 'bg-surface-container-lowest text-error border-error'
                  : 'bg-surface-container-lowest text-secondary border-secondary'
              }`}>
                {selectedItem.threat}
              </span>
            </div>

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
                  <span className="text-sm text-on-surface-variant">Event Detected:</span>
                  <span className="font-mono text-xs text-on-surface font-bold">{selectedItem.event}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Overall AI Confidence:</span>
                  <span className="font-mono text-xs text-primary font-bold">{selectedItem.confidence}%</span>
                </div>
                <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-primary h-full transition-all duration-500" style={{ width: `${selectedItem.confidence}%` }}></div>
                </div>
              </div>
              <div className="bg-surface-container-low p-3 rounded border border-outline-variant">
                <p className="text-xs text-on-surface leading-relaxed">
                  <strong>Analysis:</strong> {selectedItem.analysis}
                </p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-on-surface-variant mb-3 border-b border-outline-variant pb-1">
                COLLECTION METADATA
              </h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                <div>
                  <p className="font-mono text-[10px] text-on-surface-variant mb-1">SOURCE</p>
                  <p className="text-sm text-on-surface truncate">{selectedItem.source}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-on-surface-variant mb-1">TIME IST</p>
                  <p className="text-sm text-on-surface">{selectedItem.time}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-on-surface-variant mb-1">MEDIA TYPE</p>
                  <p className="text-sm text-on-surface">{selectedItem.mediaType}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-on-surface-variant mb-1">LOCATION</p>
                  <p className="text-sm text-on-surface truncate">{selectedItem.location}</p>
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
