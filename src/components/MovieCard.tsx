import { Link } from 'react-router-dom'
import { Movie } from '../types'
import { useCinematch } from '../context/CinematchContext'

interface MovieCardProps {
  movie: Movie
  genre?: string
  mood?: string
  highlighted?: boolean
  reason?: string
}

export default function MovieCard({ movie, highlighted = false, reason }: MovieCardProps) {
  const { favorites, toggleFavorite, selectedGenres, selectedMood } = useCinematch()
  const isFavorited = favorites.includes(movie.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault() // Stop navigation to detail page
    e.stopPropagation()
    toggleFavorite(movie.id)
  }

  // Calculate a matching percentage dynamically if recommendations are active
  const calculateMatchScore = () => {
    if (selectedGenres.length === 0 && !selectedMood) return null
    
    let score = 50 // Base score for being shown
    
    // Genre match overlap
    const matchingGenres = movie.genres.filter(g => selectedGenres.includes(g))
    if (selectedGenres.length > 0 && matchingGenres.length > 0) {
      score += Math.round((matchingGenres.length / selectedGenres.length) * 25)
    }
    
    // Mood match
    if (selectedMood && movie.moods.includes(selectedMood)) {
      score += 20
    }
    
    // Rating bonus
    score += Math.round(movie.rating * 0.5)
    
    return Math.min(score, 99) // Cap at 99%
  }

  const matchScore = calculateMatchScore()

  return (
    <Link 
      to={`/movies/${movie.id}`} 
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-slate-900/60 hover:shadow-2xl ${
        highlighted ? 'ring-2 ring-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)] bg-slate-900/70 border-violet-500/20' : ''
      }`}
      style={highlighted ? { borderColor: 'rgba(var(--accent-rgb), 0.3)' } : undefined}
      id={`movie-card-${movie.id}`}
    >
      <div className="space-y-3">
        {/* Poster Wrapper */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-950">
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            loading="lazy"
          />
          
          {/* Top Badge row */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
            {/* Rating Badge */}
            <span className="flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-extrabold text-amber-400 backdrop-blur-md shadow-sm">
              <svg className="h-2.5 w-2.5 fill-current text-amber-400" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>{movie.rating.toFixed(1)}</span>
            </span>
            
            {/* Match Score Badge (Optional) */}
            {matchScore !== null && (
              <span 
                className="rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-extrabold text-green-400 backdrop-blur-md shadow-sm"
                style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}
              >
                {matchScore}% Match
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 ${
              isFavorited ? 'text-red-500 shadow-md ring-1 ring-red-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
          >
            <svg
              className={`h-4.5 w-4.5 transition-transform duration-300 ${isFavorited ? 'fill-current scale-110 pulse-heart' : 'stroke-current'}`}
              fill={isFavorited ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="space-y-1.5 px-1">
          <div className="flex items-start justify-between gap-1">
            <h3 className="line-clamp-1 text-sm font-bold text-slate-100 group-hover:text-white transition">
              {movie.title}
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">
              {movie.year}
            </span>
          </div>

          <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed font-light">
            {movie.description}
          </p>
        </div>
      </div>

      {/* Recommended Reason or Details Button */}
      <div className="mt-3 px-1">
        {reason ? (
          <div className="rounded-xl bg-violet-500/10 p-2.5 border border-violet-500/10 flex items-start gap-1.5" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.05)', borderColor: 'rgba(var(--accent-rgb), 0.1)' }}>
            <svg className="h-3 w-3 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] font-medium leading-normal text-violet-300" style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}>
              {reason}
            </p>
          </div>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 transition group-hover:text-white uppercase tracking-wider">
            View Details
            <svg className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </Link>
  )
}
