import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import MapView from '../components/MapView';
import EventFeed from '../components/EventFeed';
import EventDetail from '../components/EventDetail';
import StatsBar from '../components/StatsBar';
import Filters from '../components/Filters';
import './MapPage.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const socket = io(SOCKET_URL);

export default function MapPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    eventType: 'all',
    severity: 'all',
    isEmerging: false
  });
  const [view, setView] = useState('feed');
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    fetchEvents();
    fetchStats();

    socket.on('newEvent', (event) => {
      setEvents(prev => [event, ...prev]);
      setLiveCount(c => c + 1);
      fetchStats();
    });

    socket.on('eventUpdated', (updated) => {
      setEvents(prev => prev.map(e => e._id === updated._id ? updated : e));
    });

    return () => {
      socket.off('newEvent');
      socket.off('eventUpdated');
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const params = { limit: 200 };
      if (filters.eventType !== 'all') params.eventType = filters.eventType;
      if (filters.severity !== 'all') params.severity = filters.severity;
      if (filters.isEmerging) params.isEmerging = true;
      const res = await axios.get(`${API}/events`, { params });
      setEvents(res.data.events || []);
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/events/analytics/summary`);
      setStats(res.data.summary || {});
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEvents(); }, [filters]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setView('detail');
  };

  return (
    <div className="map-page-container flex flex-col h-full bg-white">
      <header className="map-header flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
        <div className="header-left flex items-center gap-3">
          <span className="logo text-blue-800 text-3xl">🏛️</span>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">National Weather Ground Intelligence Platform</h1>
            <p className="subtitle text-sm text-gray-500">AI-Powered Real-Time Disaster Intelligence · India</p>
          </div>
        </div>
        <div className="header-right flex items-center gap-2">
          {liveCount > 0 && (
            <span className="new-badge bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold mr-2">+{liveCount} new</span>
          )}
          <span className="live-dot text-red-600 animate-pulse text-lg">●</span>
          <span className="live-text font-bold text-red-600 tracking-wide text-sm">LIVE FEED</span>
        </div>
      </header>

      <StatsBar stats={stats} />
      <Filters filters={filters} setFilters={setFilters} />

      <div className="main-layout flex flex-1 overflow-hidden bg-gray-100">
        <div className="map-panel flex-1 relative z-0">
          <MapView
            events={events}
            selectedEvent={selectedEvent}
            onEventClick={handleEventClick}
          />

          {/* Map legend */}
          <div className="map-legend absolute bottom-6 left-4 z-[1000] bg-white/95 backdrop-blur-md border border-gray-300 shadow-md rounded px-4 py-3 flex gap-4 text-xs font-medium text-gray-700">
            <div className="legend-item flex items-center gap-2">
              <span className="legend-dot w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
              High Severity
            </div>
            <div className="legend-item flex items-center gap-2">
              <span className="legend-dot w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
              Medium
            </div>
            <div className="legend-item flex items-center gap-2">
              <span className="legend-dot w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
              Low
            </div>
            <div className="legend-item flex items-center gap-2">
              <span className="legend-dot w-3 h-3 rounded-full" style={{ background: '#a855f7', border: '2px solid #9333ea' }} />
              ⚡ Emerging
            </div>
          </div>
        </div>

        <div className="side-panel w-[400px] bg-white border-l border-gray-200 overflow-y-auto z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          {view === 'detail' && selectedEvent ? (
            <EventDetail
              event={selectedEvent}
              onClose={() => { setView('feed'); setSelectedEvent(null); }}
              apiBase={API}
            />
          ) : (
            <EventFeed
              events={events}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
