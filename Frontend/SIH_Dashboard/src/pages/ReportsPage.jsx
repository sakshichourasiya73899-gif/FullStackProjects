import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getReports,
  formatEventType, formatLocation, formatTimeAgo,
  getSeverityColor, getSourceTypeIcon
} from '../services/api'

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 })

  const filters = {
    sourceType: searchParams.get('sourceType') || 'all',
    eventType: searchParams.get('eventType') || 'all',
    severity: searchParams.get('severity') || 'all',
    hasMedia: searchParams.get('hasMedia') || 'all',
    page: parseInt(searchParams.get('page')) || 1
  }

  const setFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    if (key !== 'page') newParams.delete('page') // Reset to page 1 on filter change
    setSearchParams(newParams)
  }

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const data = await getReports(filters)
        if (active) {
          setReports(data.reports || [])
          setPagination({ page: data.page, total: data.total, pages: data.pages })
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [searchParams])

  return (
    <div className="flex-1 flex flex-col h-full bg-surface p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Raw Intelligence Reports</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Unfiltered incoming ground reports across all source networks
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-sm flex flex-wrap gap-4 mb-6 items-center">
        <select 
          className="bg-surface border border-outline-variant text-on-surface text-sm rounded px-3 py-2"
          value={filters.sourceType}
          onChange={e => setFilter('sourceType', e.target.value)}
        >
          <option value="all">All Sources</option>
          <option value="social_mock">Social Media</option>
          <option value="news_rss">News / RSS</option>
          <option value="weather_api">Weather API</option>
          <option value="citizen">Citizen Reports</option>
        </select>

        <select 
          className="bg-surface border border-outline-variant text-on-surface text-sm rounded px-3 py-2"
          value={filters.eventType}
          onChange={e => setFilter('eventType', e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="flood">Flood</option>
          <option value="rainfall">Rainfall</option>
          <option value="dust_storm">Dust Storm</option>
          <option value="heatwave">Heatwave</option>
          <option value="fog">Fog</option>
          <option value="thunderstorm">Thunderstorm</option>
        </select>

        <select 
          className="bg-surface border border-outline-variant text-on-surface text-sm rounded px-3 py-2"
          value={filters.severity}
          onChange={e => setFilter('severity', e.target.value)}
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        <select 
          className="bg-surface border border-outline-variant text-on-surface text-sm rounded px-3 py-2"
          value={filters.hasMedia}
          onChange={e => setFilter('hasMedia', e.target.value)}
        >
          <option value="all">Media: Any</option>
          <option value="true">Has Media</option>
          <option value="false">No Media</option>
        </select>
        
        <span className="text-sm text-on-surface-variant ml-auto">
          {pagination.total} reports found
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant h-32 rounded-sm animate-pulse"></div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 text-outline-variant">find_in_page</span>
            <p>No reports found matching your criteria.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reports.map(report => (
              <div 
                key={report._id} 
                className={`bg-surface-container-lowest border border-outline-variant rounded-sm p-5 flex flex-col gap-3 ${
                  report.duplicate?.isDuplicate ? 'opacity-70' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant" title={report.sourceType}>
                      {getSourceTypeIcon(report.sourceType)}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase text-on-surface-variant">
                        {report.source?.sourceName || formatEventType(report.sourceType)}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">{formatTimeAgo(report.time?.reportedAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {report.duplicate?.isDuplicate && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant border border-outline-variant">
                        DUPLICATE ({Math.round(report.duplicate.similarityScore || 0)}%)
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      report.aiAnalysis?.severity === 'high' ? 'bg-error text-on-error' :
                      report.aiAnalysis?.severity === 'medium' ? 'bg-secondary text-on-secondary' :
                      'bg-primary text-on-primary'
                    }`}>
                      {report.aiAnalysis?.severity || 'UNKNOWN'}
                    </span>
                  </div>
                </div>

                <p className="text-on-surface text-sm leading-relaxed">{report.text}</p>
                
                <div className="flex items-center gap-4 border-t border-outline-variant pt-3 mt-1 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {formatLocation(report.location)}
                  </span>
                  
                  <span className="flex items-center gap-1 ml-auto">
                    <span className="material-symbols-outlined text-sm">category</span>
                    {formatEventType(report.aiAnalysis?.eventType)}
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm" title="Credibility Score">verified_user</span>
                    {report.credibility?.score || 0}/100
                  </span>
                  
                  {report.media && report.media.length > 0 && (
                    <span className="flex items-center gap-1 text-secondary font-medium">
                      <span className="material-symbols-outlined text-sm">perm_media</span>
                      {report.media.length} Attachment(s)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            disabled={pagination.page <= 1}
            onClick={() => setFilter('page', pagination.page - 1)}
            className="p-2 border border-outline-variant rounded disabled:opacity-50 text-on-surface hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined block">chevron_left</span>
          </button>
          <span className="text-sm text-on-surface-variant font-mono">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button 
            disabled={pagination.page >= pagination.pages}
            onClick={() => setFilter('page', pagination.page + 1)}
            className="p-2 border border-outline-variant rounded disabled:opacity-50 text-on-surface hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined block">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  )
}
