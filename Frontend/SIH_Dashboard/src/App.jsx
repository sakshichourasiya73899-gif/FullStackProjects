import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopAppBar from './components/TopAppBar'
import DashboardPage from './pages/DashboardPage'
import EvidencePage from './pages/EvidencePage'
import AnalyticsPage from './pages/AnalyticsPage'
import MapPage from './pages/MapPage'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-full bg-background relative">
        <TopAppBar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/events" element={<PlaceholderPage title="Events" icon="event" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" icon="description" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function PlaceholderPage({ title, icon }) {
  return (
    <div className="flex-1 flex items-center justify-center h-full bg-surface">
      <div className="text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">{icon}</span>
        <h2 className="text-2xl font-bold text-on-surface mb-2">{title}</h2>
        <p className="text-on-surface-variant">This module is under development.</p>
      </div>
    </div>
  )
}
