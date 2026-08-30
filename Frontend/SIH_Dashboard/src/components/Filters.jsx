export default function Filters({ filters, setFilters }) {
  return (
    <div className="filters-bar bg-white border-b border-gray-200 px-6 py-2 flex gap-4 items-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative">
      <div className="filter-group flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Type:</label>
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.eventType}
          onChange={(e) => setFilters(f => ({ ...f, eventType: e.target.value }))}
        >
          <option value="all">All Types</option>
          <option value="flood">Flood</option>
          <option value="rainfall">Heavy Rainfall</option>
          <option value="cyclone">Cyclone</option>
          <option value="heatwave">Heatwave</option>
          <option value="earthquake">Earthquake</option>
        </select>
      </div>

      <div className="filter-group flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Severity:</label>
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={filters.severity}
          onChange={(e) => setFilters(f => ({ ...f, severity: e.target.value }))}
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="filter-group flex items-center gap-2 ml-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            checked={filters.isEmerging}
            onChange={(e) => setFilters(f => ({ ...f, isEmerging: e.target.checked }))}
          />
          ⚡ Emerging Only
        </label>
      </div>
    </div>
  );
}
