import { NavLink } from 'react-router-dom'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/' },
  { icon: 'map', label: 'Intelligence Map', to: '/map' },
  { icon: 'event', label: 'Events', to: '/events' },
  { icon: 'description', label: 'Reports', to: '/reports' },
  { icon: 'analytics', label: 'Analytics', to: '/analytics' },
  { icon: 'folder_shared', label: 'Evidence Center', to: '/evidence' },
]

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-primary text-on-primary flex flex-col border-r border-outline-variant z-40">
      {/* Brand */}
      <div className="p-4 border-b border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">thunderstorm</span>
          </div>
          <div>
            <h1 className="font-semibold text-xl text-on-primary truncate leading-tight">National Weather</h1>
            <p className="text-sm text-on-primary/70">Official Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `mx-2 my-1 px-4 py-3 flex items-center gap-3 rounded transition-all duration-150 group ${
                    isActive
                      ? 'text-on-primary-fixed bg-primary-fixed font-bold scale-[0.98]'
                      : 'text-on-primary-fixed-variant hover:bg-on-primary-fixed-variant/10'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-symbols-outlined group-hover:scale-95 transition-transform ${isActive ? 'icon-filled' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="text-base">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-on-primary-fixed-variant/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-primary truncate">Officer Admin</p>
            <p className="text-xs text-on-primary/50">Level 4 Access</p>
          </div>
        </div>
      </div>
    </nav>
  )
}
