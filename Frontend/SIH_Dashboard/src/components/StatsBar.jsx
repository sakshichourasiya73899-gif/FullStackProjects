export default function StatsBar({ stats }) {
  return (
    <div className="stats-bar bg-white border-b border-gray-200 px-6 py-3 flex gap-8 items-center shadow-sm z-10">
      <div className="stat-item flex flex-col">
        <span className="stat-label text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Events</span>
        <span className="stat-value text-xl font-bold text-gray-900">{stats.activeCount || 0}</span>
      </div>
      <div className="stat-item flex flex-col">
        <span className="stat-label text-xs font-semibold text-gray-500 uppercase tracking-wider">High Severity</span>
        <span className="stat-value text-xl font-bold text-red-600">{stats.highSeverityCount || 0}</span>
      </div>
      <div className="stat-item flex flex-col">
        <span className="stat-label text-xs font-semibold text-gray-500 uppercase tracking-wider">Emerging Threats</span>
        <span className="stat-value text-xl font-bold text-purple-600">{stats.emergingCount || 0}</span>
      </div>
      <div className="stat-item flex flex-col">
        <span className="stat-label text-xs font-semibold text-gray-500 uppercase tracking-wider">Reports Analyzed</span>
        <span className="stat-value text-xl font-bold text-blue-600">{stats.totalReports || 0}</span>
      </div>
    </div>
  );
}
