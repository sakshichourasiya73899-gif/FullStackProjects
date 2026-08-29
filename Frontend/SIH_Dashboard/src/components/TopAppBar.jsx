import { useState } from 'react'

export default function TopAppBar() {
  const [searchValue, setSearchValue] = useState('')

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
            placeholder="Search intelligence..."
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-on-surface-variant">
          <button className="hover:bg-surface-container-low transition-all p-2 rounded flex items-center justify-center opacity-80 hover:opacity-100 duration-200 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          </button>
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
