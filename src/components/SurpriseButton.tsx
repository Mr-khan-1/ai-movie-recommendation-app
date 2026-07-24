import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCinematch } from '../context/CinematchContext'
import { Movie } from '../types'

export default function SurpriseButton() {
  const { movies, favorites, toggleFavorite } = useCinematch()
  const [showModal, setShowModal] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<Movie | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spinCountRef = useRef(0)
  const currentIntervalRef = useRef(60)

  const isFavorited = winner ? favorites.includes(winner.id) : false

  const startRoulette = () => {
    if (movies.length === 0) return
    setIsSpinning(true)
    setWinner(null)
    setShowModal(true)
    spinCountRef.current = 0
    currentIntervalRef.current = 60
    
    // Pick winner immediately but reveal later
    const randomIndex = Math.floor(Math.random() * movies.length)
    const chosenWinner = movies[randomIndex]
    
    runCycle(chosenWinner)
  }

  const runCycle = (finalWinner: Movie) => {
    // Total steps to slow down and stop (around 25-30 items)
    const totalSteps = 28
    
    if (spinCountRef.current >= totalSteps) {
      // End spin, set actual winner
      setWinner(finalWinner)
      setIsSpinning(false)
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    spinCountRef.current += 1
    
    // Decelerate as we approach the end
    if (spinCountRef.current > 20) {
      currentIntervalRef.current += 50 // Slower
    } else if (spinCountRef.current > 12) {
      currentIntervalRef.current += 20 // Moderate slowdown
    }

    // Cycle through indexes
    setCurrentIndex((prev) => (prev + 1) % movies.length)

    timerRef.current = setTimeout(() => {
      runCycle(finalWinner)
    }, currentIntervalRef.current)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Currently displayed movie during spin
  const currentMovie = movies[currentIndex]

  return (
    <>
      <button
        onClick={startRoulette}
        className="surprise-button flex items-center justify-center gap-2 font-bold transition hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm"
        style={{ 
          background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 1), #2563eb)',
          boxShadow: '0 8px 24px rgba(var(--accent-rgb), 0.3)'
        }}
        type="button"
      >
        <svg className="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Surprise Roulette</span>
      </button>

      {/* Roulette Modal */}
      {showModal && currentMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-glow backdrop-blur-2xl sm:p-8 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="mb-6 text-center">
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]" style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}>
                {isSpinning ? 'Selecting a film...' : 'Your Recommendation!'}
              </span>
              <h2 className="text-2xl font-black text-white">
                {isSpinning ? 'CineMatch Roulette' : 'Spotlight Revealed'}
              </h2>
            </div>

            {/* Spinner Showcase */}
            <div className="flex flex-col items-center">
              {isSpinning ? (
                /* Spin view */
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="relative h-72 w-48 overflow-hidden rounded-2xl border-4 border-violet-500/50 bg-slate-950 shadow-2xl animate-pulse" style={{ borderColor: 'rgba(var(--accent-rgb), 0.5)' }}>
                    <img 
                      src={currentMovie.posterUrl} 
                      alt="Roulette slot" 
                      className="h-full w-full object-cover grayscale-30" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" style={{ backgroundColor: 'rgba(var(--accent-rgb), 1)' }} />
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: 'rgba(var(--accent-rgb), 1)' }} />
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: 'rgba(var(--accent-rgb), 1)' }} />
                  </div>
                  <p className="text-sm font-semibold text-slate-200 text-center uppercase tracking-widest">{currentMovie.title}</p>
                </div>
              ) : (
                /* Reveal Winner view */
                winner && (
                  <div className="w-full space-y-6 py-2">
                    <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
                      {/* Winner Poster */}
                      <div className="relative mx-auto h-56 w-36 overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-md">
                        <img 
                          src={winner.posterUrl} 
                          alt={winner.title} 
                          className="h-full w-full object-cover" 
                        />
                        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-slate-950/80 px-2 py-0.5 text-[9px] font-extrabold text-amber-400 backdrop-blur-sm shadow-sm">
                          <svg className="h-2.5 w-2.5 fill-current text-amber-400" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span>{winner.rating.toFixed(1)}</span>
                        </span>
                      </div>
                      
                      {/* Winner Info */}
                      <div className="space-y-3 text-center sm:text-left">
                        <div>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <h3 className="text-xl font-bold text-white leading-tight">{winner.title}</h3>
                            <span className="text-xs text-slate-500">({winner.year})</span>
                          </div>
                          <p className="mt-1 text-xs italic font-medium" style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}>
                            {winner.tagline}
                          </p>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-4">
                          {winner.description}
                        </p>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-1">
                          {winner.genres.map(g => (
                            <span key={g} className="rounded-full bg-white/5 border border-white/5 px-2.5 py-0.5 text-[9px] font-semibold text-slate-300">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                      <button
                        onClick={() => toggleFavorite(winner.id)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 active:scale-95 sm:flex-1 ${
                          isFavorited 
                            ? 'border-red-500 bg-red-500/10 text-red-500' 
                            : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <svg className={`h-4 w-4 ${isFavorited ? 'fill-current' : 'stroke-current'}`} fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {isFavorited ? 'Saved in Favorites' : 'Add to Favorites'}
                      </button>

                      <Link
                        to={`/movies/${winner.id}`}
                        onClick={() => setShowModal(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl text-center text-xs font-bold text-white transition-all duration-200 active:scale-95 sm:flex-1 py-2.5"
                        style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 1), #2563eb)' }}
                      >
                        <span>Full Details</span>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Modal Controls */}
            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
              <button
                onClick={startRoulette}
                disabled={isSpinning}
                className="text-xs font-bold tracking-wide uppercase transition hover:text-white text-slate-400 disabled:opacity-50 flex items-center gap-1.5"
              >
                {!isSpinning && winner && (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" />
                    </svg>
                    <span>Spin Again</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowModal(false)}
                disabled={isSpinning}
                className="rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition"
              >
                Close
              </button>
            </div>
            
          </div>
        </div>
      )}
    </>
  )
}
