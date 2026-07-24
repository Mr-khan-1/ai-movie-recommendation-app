import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useCinematch } from '../context/CinematchContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { 
    favorites, 
    searchQuery, 
    setSearchQuery, 
    themeColor, 
    setThemeColor 
  } = useCinematch()
  
  const navigate = useNavigate()
  const location = useLocation()
  const [showSearch, setShowSearch] = useState(false)

  // Redirect to homepage if user starts typing search query on another page
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (location.pathname !== '/') {
      navigate('/')
    }
  }

  // Clear search on navigation (optional, but let's keep it clean or only if navigating away from search context)
  useEffect(() => {
    if (location.pathname !== '/' && searchQuery) {
      // Keep search query but show search active
      setShowSearch(true)
    }
  }, [location.pathname])

  const themes: { name: typeof themeColor; class: string; glow: string }[] = [
    { name: 'violet', class: 'bg-violet-500 hover:bg-violet-600', glow: 'shadow-[0_0_8px_rgba(139,92,246,0.5)]' },
    { name: 'cyan', class: 'bg-cyan-500 hover:bg-cyan-600', glow: 'shadow-[0_0_8px_rgba(6,182,212,0.5)]' },
    { name: 'emerald', class: 'bg-emerald-500 hover:bg-emerald-600', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]' },
    { name: 'rose', class: 'bg-rose-500 hover:bg-rose-600', glow: 'shadow-[0_0_8px_rgba(244,63,94,0.5)]' },
    { name: 'amber', class: 'bg-amber-500 hover:bg-amber-600', glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]' }
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070a13]/90 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white transition hover:opacity-90">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 text-xl font-bold shadow-glow ring-2 ring-white/10">
            C
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-white">CineMatch</p>
            <p className="text-xs font-medium text-slate-400">Smart Film Discovery</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                isActive 
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => 
              `flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                isActive 
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            Favorites
            {favorites.length > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md">
                {favorites.length}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Actions (Search & Theme Picker) */}
        <div className="flex items-center gap-4">
          {/* Dynamic Search Bar */}
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                  className="w-40 sm:w-56 rounded-full border border-white/10 bg-slate-950/80 px-4 py-1.5 text-xs text-white placeholder-slate-500 outline-none ring-1 ring-violet-500/20 focus:border-violet-500 focus:ring-violet-500/50"
                />
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setShowSearch(false)
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white transition hover:bg-white/10 active:scale-95"
              >
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </button>
            )}
          </div>

          {/* Theme Color Picker */}
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 p-1">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setThemeColor(theme.name)}
                className={`h-4.5 w-4.5 rounded-full transition-all duration-200 active:scale-75 ${theme.class} ${
                  themeColor === theme.name 
                    ? `scale-125 ring-2 ring-white ${theme.glow}` 
                    : 'opacity-60 hover:opacity-100'
                }`}
                title={`Switch to ${theme.name} theme`}
                aria-label={`Switch to ${theme.name} theme`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
