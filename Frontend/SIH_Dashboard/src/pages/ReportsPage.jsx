import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getReports,
  formatEventType, formatLocation, formatTimeAgo, formatDateTime,
  getSeverityColor, getSourceTypeIcon
} from '../services/api'

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 })
  const [selectedReport, setSelectedReport] = useState(null)

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
    <>
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
                className={`bg-surface-container-lowest border rounded-sm p-5 flex flex-col gap-3 cursor-pointer transition-colors hover:border-primary ${
                  report.duplicate?.isDuplicate ? 'border-outline-variant opacity-80' : 'border-outline-variant'
                } ${selectedReport?._id === report._id ? 'border-primary ring-1 ring-primary' : ''}`}
                onClick={() => setSelectedReport(report)}
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
                    {report.duplicate?.isDuplicate ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/30">
                        ⚠ DUPLICATE · {Math.round(report.duplicate.similarityScore || 0)}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        ✓ Unique
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

    {/* Report Detail Modal */}
    {selectedReport && (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedReport(null)}>
        <div
          className="bg-surface-container-lowest border border-outline-variant rounded-t-xl sm:rounded-xl shadow-xl w-full sm:w-[560px] max-h-[85vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
            <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">{getSourceTypeIcon(selectedReport.sourceType)}</span>
              Report Detail
            </h3>
            <button onClick={() => setSelectedReport(null)} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Duplicate Status — Phase 13 */}
            {selectedReport.duplicate?.isDuplicate ? (
              <div className="flex items-start gap-3 p-3 rounded bg-secondary/10 border border-secondary/30">
                <span className="material-symbols-outlined text-secondary mt-0.5">warning</span>
                <div className="flex-1">
                  <p className="font-bold text-secondary text-sm">⚠ Duplicate Report</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Similarity: <strong>{Math.round(selectedReport.duplicate.similarityScore || 0)}%</strong> match to an earlier report
                  </p>
                  {selectedReport.duplicate.originalReportId && (
                    <p className="text-xs mt-1 text-on-surface-variant">
                      Original Report ID:{' '}
                      <code className="font-mono text-[10px] bg-surface-variant px-1 py-0.5 rounded">
                        {selectedReport.duplicate.originalReportId}
                      </code>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
                <span className="material-symbols-outlined text-base">check_circle</span>
                ✓ Unique Report
              </div>
            )}

            {/* Report Text */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Report Content</p>
              <p className="text-sm text-on-surface leading-relaxed bg-surface-container-low border border-outline-variant rounded p-3">
                {selectedReport.text}
              </p>
            </div>

            {/* Source Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Source</p>
                <p className="text-sm text-on-surface font-medium">
                  {selectedReport.source?.sourceName || formatEventType(selectedReport.sourceType)}
                </p>
                <p className="text-xs text-on-surface-variant">{selectedReport.sourceType?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Location</p>
                <p className="text-sm text-on-surface">{formatLocation(selectedReport.location) || '—'}</p>
              </div>
            </div>

            {/* Timestamps — Occurred vs Received */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Occurred</p>
                <p className="text-xs text-on-surface font-mono">{formatDateTime(selectedReport.time?.reportedAt)}</p>
                <p className="text-[10px] text-on-surface-variant">({formatTimeAgo(selectedReport.time?.reportedAt)})</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Received by System</p>
                <p className="text-xs text-on-surface font-mono">{formatDateTime(selectedReport.time?.collectedAt)}</p>
                <p className="text-[10px] text-on-surface-variant">({formatTimeAgo(selectedReport.time?.collectedAt)})</p>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-container-low border border-outline-variant rounded p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Event Type</p>
                <p className="text-sm font-semibold text-on-surface mt-1">{formatEventType(selectedReport.aiAnalysis?.eventType)}</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant rounded p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Severity</p>
                <p className={`text-sm font-bold mt-1 ${getSeverityColor(selectedReport.aiAnalysis?.severity)}`}>
                  {(selectedReport.aiAnalysis?.severity || 'unknown').toUpperCase()}
                </p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant rounded p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Credibility</p>
                <p className="text-sm font-bold text-on-surface mt-1">{selectedReport.credibility?.score || 0}/100</p>
              </div>
            </div>

            {/* Source URL */}
            {selectedReport.source?.sourceUrl && (
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">Original Source</p>
                <a
                  href={selectedReport.source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline bg-primary/5 border border-primary/20 rounded px-3 py-2"
                >
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                  View Original Article / Post
                </a>
              </div>
            )}

            {/* Media */}
            {selectedReport.media && selectedReport.media.length > 0 && (
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">Media Attachments</p>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.media.map((m, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs px-2 py-1 bg-surface-container-low border border-outline-variant rounded">
                      <span className="material-symbols-outlined text-sm">{m.type === 'video' ? 'videocam' : 'image'}</span>
                      {m.type}
                      {m.url && (
                        <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">View</a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}
