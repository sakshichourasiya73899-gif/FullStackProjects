const EVENT_ICONS = {
  flood: '🌊', rainfall: '🌧️', thunderstorm: '⛈️',
  heatwave: '🔥', fog: '🌫️', dust_storm: '🌪️',
  strong_wind: '💨', wildfire: '🔥', drought: '☀️',
  cyclone: '🌀', cold_wave: '❄️', earthquake: '🌋', other: '🌡️'
};

export default function EventDetail({ event, onClose }) {
  if (!event) return null;
  const typeIcon = EVENT_ICONS[event.eventType] || '📌';

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-start sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>{typeIcon}</span> Event Intelligence
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 p-1 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold"
        >
          ✕
        </button>
      </div>
      
      <div className="p-5 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{event.title || event.eventType}</h1>
          <p className="text-gray-600 mb-1">📍 {event.location?.city}, {event.location?.state}</p>
          <div className="flex gap-2 mt-3">
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border ${
              event.severity === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
              event.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
              'bg-green-100 text-green-800 border-green-200'
            }`}>
              {event.severity} Severity
            </span>
            {event.trend?.isEmerging && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wide border border-purple-200">
                ⚡ Emerging
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-500 uppercase font-semibold">Priority Score</div>
            <div className="text-2xl font-bold text-gray-900">{event.priorityScore || 0}/100</div>
          </div>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <div className="text-xs text-gray-500 uppercase font-semibold">Total Reports</div>
            <div className="text-2xl font-bold text-blue-600">{event.reportCount || 0}</div>
          </div>
        </div>

        {event.summary && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-2 border-b pb-1">AI Intelligence Summary</h3>
            <p className="text-gray-700 text-sm leading-relaxed italic bg-blue-50 p-3 rounded border border-blue-100">
              "{event.summary}"
            </p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-2 border-b pb-1">Confidence & Sources</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex justify-between border-b border-gray-100 pb-1">
              <span>Unique Sources:</span> <strong>{event.uniqueSourceCount || 1}</strong>
            </li>
            <li className="flex justify-between border-b border-gray-100 pb-1">
              <span>Corroboration Level:</span> 
              <strong className="capitalize">{event.corroboration?.level || 'Low'}</strong>
            </li>
            <li className="flex justify-between pb-1">
              <span>Confidence Score:</span> <strong>{event.corroboration?.score || 0}/100</strong>
            </li>
          </ul>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase mb-2 border-b pb-1">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50 mt-auto">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          View Full Report
        </button>
      </div>
    </div>
  );
}
