import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
const socket = io(SOCKET_URL)

export default function TopAppBar() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    socket.on('newEvent', (event) => {
      setNotifications(prev => [{
        id: event._id,
        message: `New event detected: ${event.title || event.eventType}`,
        time: new Date(),
        link: `/events`
      }, ...prev].slice(0, 5))
    })

    socket.on('eventUpdated', (event) => {
      if (event.trend?.isEmerging) {
        setNotifications(prev => [{
          id: event._id + '-emerging',
          message: `Event escalating: ${event.title || event.eventType}`,
          time: new Date(),
          link: `/events?isEmerging=true`
        }, ...prev].slice(0, 5))
      }
    })

    return () => {
      socket.off('newEvent')
      socket.off('eventUpdated')
    }
  }, [])

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/events?city=${encodeURIComponent(searchValue.trim())}`)
      setSearchValue('')
    }
  }

  return (
    <header className="flex justify-between items-center w-full px-8 py-4 sticky top-0 z-30 bg-surface-container-lowest border-b border-outline-variant">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-on-surface-variant hidden md:block cursor-pointer hover:text-on-surface transition-colors">menu</span>
        <h1 className="text-2xl font-bold text-primary tracking-tight uppercase">
          NATIONAL WEATHER INTELLIGENCE PLATFORM
        </h1>
      </div>
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden lg:block w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            className="w-full pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant"
            placeholder="Search city..."
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-on-surface-variant relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="hover:bg-surface-container-low transition-all p-2 rounded flex items-center justify-center opacity-80 hover:opacity-100 duration-200 relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute top-full mt-2 right-0 w-80 bg-surface-container-lowest border border-outline-variant rounded shadow-lg z-50 overflow-hidden">
              <div className="p-3 border-b border-outline-variant font-bold text-sm text-on-surface">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-on-surface-variant">No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className="p-3 border-b border-outline-variant hover:bg-surface-container-low cursor-pointer transition-colors"
                      onClick={() => {
                        navigate(n.link)
                        setShowNotifications(false)
                        setNotifications(prev => prev.filter(x => x.id !== n.id))
                      }}
                    >
                      <div className="text-xs text-on-surface">{n.message}</div>
                      <div className="text-[10px] text-on-surface-variant mt-1">Just now</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button className="hover:bg-surface-container-low transition-all p-2 rounded flex items-center justify-center opacity-80 hover:opacity-100 duration-200">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-8 h-8 rounded border border-outline-variant bg-surface-container-high flex items-center justify-center ml-2 cursor-pointer hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
          </div>
        </div>
      </div>
    </header>
  )
}
