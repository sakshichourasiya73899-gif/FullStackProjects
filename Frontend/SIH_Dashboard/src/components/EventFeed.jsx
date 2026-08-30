const EVENT_ICONS = {
  flood: '🌊', rainfall: '🌧️', thunderstorm: '⛈️',
  heatwave: '🔥', fog: '🌫️', dust_storm: '🌪️',
  strong_wind: '💨', wildfire: '🔥', drought: '☀️',
  cyclone: '🌀', cold_wave: '❄️', earthquake: '🌋', other: '🌡️'
};

const SEVERITY_COLORS = {
  high: 'bg-red-50 border-red-200 text-red-700',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  low: 'bg-green-50 border-green-200 text-green-700'
};

export default function EventFeed({ events, onEventClick }) {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No active events found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-800">Intelligence Feed</h2>
        <p className="text-sm text-gray-500">{events.length} events logged</p>
      </div>
      <div className="overflow-y-auto p-4 flex flex-col gap-3">
        {events.map(event => {
          const typeIcon = EVENT_ICONS[event.eventType] || '📌';
          const severityClass = SEVERITY_COLORS[event.severity] || 'bg-gray-50 border-gray-200 text-gray-700';

          return (
            <div 
              key={event._id} 
              className={`border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${severityClass}`}
              onClick={() => onEventClick(event)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>{typeIcon}</span> {event.title || event.eventType}
                </div>
                {event.trend?.isEmerging && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-bold border border-purple-200">
                    ⚡ EMERGING
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                📍 {event.location?.city || 'Unknown'}{event.location?.state ? `, ${event.location.state}` : ''}
              </div>
              <div className="text-xs text-gray-500 flex justify-between items-center mt-2 pt-2 border-t border-black/10">
                <span>{event.reportCount || 1} Reports</span>
                <span>Priority: {event.priorityScore || 0}/100</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
