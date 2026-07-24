import { useState } from 'react'
import { useCinematch } from '../context/CinematchContext'
import MovieCard from '../components/MovieCard'
import { Link } from 'react-router-dom'

type SortOption = 'rating-desc' | 'year-desc' | 'title-asc'

export default function FavoritesPage() {
  const { favorites, movies, clearFavorites } = useCinematch()
  const [localSearch, setLocalSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc')
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  // Map IDs to actual Movie objects
  const favoritedMovies = movies.filter((m) => favorites.includes(m.id))

  // Filter based on local search
  const filteredFavorites = favoritedMovies.filter(
    (m) =>
      m.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(localSearch.toLowerCase())) ||
      m.director.toLowerCase().includes(localSearch.toLowerCase())
  )

  // Sort based on selected option
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortBy === 'rating-desc') {
      return b.rating - a.rating
    }
    if (sortBy === 'year-desc') {
      return b.year - a.year
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  const handleClearAll = () => {
    clearFavorites()
    setShowConfirmClear(false)
  }

  return (
    <div className="space-y-8 rounded-[32px] border border-white/5 bg-slate-900/10 p-6 sm:p-8 backdrop-blur-xl animate-fadeIn">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-[0.2em]" style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}>
            Your Watchlist
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Saved Movies ({favoritedMovies.length})</h1>
        </div>
        
        {favoritedMovies.length > 0 && (
          <div className="flex gap-2">
            {showConfirmClear ? (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-1 px-3">
                <span className="text-[10px] font-bold text-red-400">Are you sure?</span>
                <button
                  onClick={handleClearAll}
                  className="rounded bg-red-500 hover:bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white transition"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="text-[10px] font-bold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition"
              >
                Clear All Favorites
              </button>
            )}
          </div>
        )}
      </div>

      {favoritedMovies.length > 0 ? (
        <div className="space-y-6">
          {/* Controls: Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between bg-slate-950/20 rounded-2xl border border-white/5 p-4">
            {/* Local Search input */}
            <input
              type="text"
              placeholder="Search in favorites..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500/40"
            />

            {/* Sorting Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-[10px] uppercase font-bold tracking-wider text-slate-500 shrink-0">Sort By</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-violet-500/40"
              >
                <option value="rating-desc">Rating: High to Low</option>
                <option value="year-desc">Release Year: Newest First</option>
                <option value="title-asc">Title: A to Z</option>
              </select>
            </div>
          </div>

          {/* Grid list of favorited movies */}
          {sortedFavorites.length > 0 ? (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {sortedFavorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl">
              <p className="text-xs text-slate-400">No favorites match your query "{localSearch}".</p>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center p-8">
          <svg className="h-12 w-12 text-slate-500 animate-pulse mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-white">Your watchlist is empty</h2>
          <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
            Movies you save will appear here. Find titles matching your mood and genres and save them to your personal watchlist!
          </p>
          <Link
            to="/"
            className="mt-6 rounded-xl px-5 py-3 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 1), #2563eb)' }}
          >
            Discover Movies Now
          </Link>
        </div>
      )}
    </div>
  )
}
