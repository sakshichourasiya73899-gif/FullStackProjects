import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SEVERITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e'
};

const EVENT_ICONS = {
  flood: '🌊', rainfall: '🌧️', thunderstorm: '⛈️',
  heatwave: '🔥', fog: '🌫️', dust_storm: '🌪️',
  strong_wind: '💨', wildfire: '🔥', drought: '☀️',
  cyclone: '🌀', cold_wave: '❄️', other: '🌡️'
};

// Naye events aane pe map auto-fit karta hai
const MapController = ({ events }) => {
  const map = useMap();
  useEffect(() => {
    if (events.length > 0) {
      const validEvents = events.filter(e => e.location?.lat && e.location?.lng);
      if (validEvents.length > 0) {
        const bounds = validEvents.map(e => [e.location.lat, e.location.lng]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
      }
    }
  }, []);
  return null;
};

export default function MapView({ events, selectedEvent, onEventClick }) {
  const validEvents = events.filter(e => e.location?.lat && e.location?.lng);

  return (
    <MapContainer
      center={[22.5, 80.0]}
      zoom={5}
      style={{ height: '100%', width: '100%', background: '#f3f4f6' }}
      zoomControl={true}
    >
      {/* Light themed official map tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      <MapController events={validEvents} />

      {validEvents.map((event) => {
        const isSelected = selectedEvent?._id === event._id;
        const radius = Math.min(8 + (event.reportCount || 1) * 2, 30);
        const color = SEVERITY_COLORS[event.severity] || '#94a3b8';
        const isEmerging = event.trend?.isEmerging;

        return (
          <CircleMarker
            key={event._id}
            center={[event.location.lat, event.location.lng]}
            radius={isSelected ? radius + 5 : radius}
            fillColor={color}
            color={isEmerging ? '#a855f7' : isSelected ? '#ffffff' : color}
            weight={isEmerging ? 3 : isSelected ? 3 : 1}
            fillOpacity={isSelected ? 0.95 : 0.75}
            eventHandlers={{ click: () => onEventClick(event) }}
          >
            <Tooltip permanent={false} direction="top">
              <div style={{
                minWidth: 180,
                fontFamily: 'system-ui, sans-serif',
                fontSize: 13
              }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>
                  {EVENT_ICONS[event.eventType]} {event.title || event.eventType}
                </div>
                <div>📍 {event.location?.city || 'Unknown'}{event.location?.state ? `, ${event.location.state}` : ''}</div>
                <div>📊 {event.reportCount} reports · {event.severity} severity</div>
                <div>🎯 Priority: {event.priorityScore}/100</div>
                {isEmerging && (
                  <div style={{ color: '#a855f7', fontWeight: 700, marginTop: 4 }}>
                    ⚡ EMERGING EVENT
                  </div>
                )}
              </div>
            </Tooltip>

            <Popup>
              <div style={{ minWidth: 220, fontFamily: 'system-ui, sans-serif' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 15 }}>
                  {EVENT_ICONS[event.eventType]} {event.title}
                </h3>
                <p style={{ margin: '2px 0', fontSize: 13 }}>
                  📍 {event.location?.city}, {event.location?.state}
                </p>
                <p style={{ margin: '2px 0', fontSize: 13 }}>
                  📊 {event.reportCount} reports from {event.uniqueSourceCount} sources
                </p>
                <p style={{ margin: '2px 0', fontSize: 13 }}>
                  🔒 Confidence: {event.corroboration?.level} ({event.corroboration?.score}/100)
                </p>
                <p style={{ margin: '2px 0', fontSize: 13 }}>
                  🎯 Priority: {event.priorityScore}/100
                </p>
                {event.summary && (
                  <p style={{
                    margin: '8px 0 4px',
                    fontSize: 12,
                    color: '#666',
                    fontStyle: 'italic',
                    borderTop: '1px solid #eee',
                    paddingTop: 6
                  }}>
                    "{event.summary}"
                  </p>
                )}
                <button
                  onClick={() => onEventClick(event)}
                  style={{
                    marginTop: 8,
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '5px 14px',
                    borderRadius: 5,
                    cursor: 'pointer',
                    fontSize: 13,
                    width: '100%'
                  }}
                >
                  View Full Intelligence →
                </button>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}