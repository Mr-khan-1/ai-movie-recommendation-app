import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCinematch, Review } from '../context/CinematchContext'
import MovieCard from '../components/MovieCard'

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { movies, favorites, toggleFavorite, reviews, addReview, deleteReview } = useCinematch()
  
  const movie = movies.find((m) => m.id === id)
  const isFavorited = movie ? favorites.includes(movie.id) : false

  // Form State
  const [author, setAuthor] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [formError, setFormError] = useState('')

  // Video State
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  if (!movie) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 rounded-3xl bg-slate-900/40 p-10 text-center backdrop-blur-xl border border-white/5">
        <svg className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <h1 className="text-3xl font-black text-white">Movie Not Found</h1>
        <p className="max-w-md text-slate-400">
          The movie ID is invalid or does not exist in our system. Return to discover more films.
        </p>
        <Link to="/" className="rounded-xl px-5 py-2.5 text-xs font-bold text-white transition bg-gradient-to-r from-violet-600 to-sky-500">
          Return to Home
        </Link>
      </div>
    )
  }

  // Get similar movies (movies sharing at least one genre, excluding current)
  const similarMovies = movies
    .filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)))
    .slice(0, 3)

  // Get reviews
  const movieReviews = reviews[movie.id] || []

  // Handle Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !text.trim()) {
      setFormError('Please fill out both your name and review comment.')
      return
    }
    
    addReview(movie.id, {
      author: author.trim(),
      rating,
      text: text.trim()
    })

    setAuthor('')
    setText('')
    setRating(5)
    setFormError('')
  }

  // Handle Trailer Video Playback
  const handlePlayTrailer = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch(err => {
          console.error("Video play failed:", err)
        })
      }
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Cinematic Backdrop Banner */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 shadow-2xl min-h-[300px] sm:min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="h-full w-full object-cover scale-100 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b14] via-[#090b14]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090b14]/90 via-[#090b14]/30 to-transparent" />
        </div>

        {/* Content Details Over Backdrop */}
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12 flex flex-col md:flex-row gap-8 items-end justify-between">
          <div className="space-y-4 max-w-3xl">
            {/* Genre Pills */}
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((g) => (
                <span 
                  key={g} 
                  className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-[9px] font-bold text-violet-300 uppercase tracking-widest"
                  style={{ color: 'rgba(var(--accent-soft-rgb), 1)', borderColor: 'rgba(var(--accent-rgb), 0.2)', backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
                >
                  {g}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl uppercase">
              {movie.title}
            </h1>
            
            <p className="text-xs font-semibold uppercase italic" style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}>
              "{movie.tagline}"
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1 text-amber-400 text-sm">
                <svg className="h-3.5 w-3.5 fill-current text-amber-400" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span>{movie.rating.toFixed(1)} Rating</span>
              </span>
              <span>•</span>
              <span>{movie.runtime} min</span>
              <span>•</span>
              <span>Released {movie.year}</span>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => toggleFavorite(movie.id)}
              className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                isFavorited 
                  ? 'border-red-500 bg-red-500/10 text-red-500' 
                  : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className={`h-4 w-4 ${isFavorited ? 'fill-current' : 'stroke-current'}`} fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isFavorited ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Back to Browse
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Main details Grid */}
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        
        {/* Left Column: Synopsis, Director, Cast, Reviews */}
        <div className="space-y-8">
          {/* Plot & Crew */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/20 p-6 sm:p-8 space-y-6 backdrop-blur-xl">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">Storyline</h2>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {movie.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t border-white/5 pt-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Director</span>
                <p className="text-sm font-semibold text-slate-200">{movie.director}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Popularity Score</span>
                <p className="text-sm font-semibold text-slate-200">{movie.popularity}% Popularity</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-white/5 pt-6">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Starring Cast</span>
              <div className="flex flex-wrap gap-1.5">
                {movie.cast.map((actor) => (
                  <span 
                    key={actor}
                    className="rounded-lg bg-white/5 border border-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-white/5 pt-6">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Tonal Mood Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {movie.moods.map((mood) => (
                  <span 
                    key={mood}
                    className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 capitalize"
                  >
                    {mood}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* User Reviews Section */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/20 p-6 sm:p-8 space-y-6 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white">
              User Reviews & Notes ({movieReviews.length})
            </h2>

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="space-y-4 bg-slate-950/40 rounded-2xl border border-white/5 p-4 sm:p-6">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Share Your Review</span>
              
              {formError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs font-semibold text-red-400">
                  {formError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div className="space-y-1">
                  <label htmlFor="author-input" className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Your Name</label>
                  <input
                    id="author-input"
                    type="text"
                    placeholder="Enter your name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500/40"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Rating score</span>
                  <div className="flex items-center gap-1 py-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition hover:scale-110 active:scale-95"
                      >
                        <svg 
                          className={`h-5 w-5 ${star <= rating ? 'fill-current text-amber-400' : 'stroke-current text-slate-600'}`}
                          fill={star <= rating ? 'currentColor' : 'none'} 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.58 1.849l-3.97 2.879a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.878a1 1 0 00-1.176 0l-3.97 2.878c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.878c-.78-.597-.38-1.849.58-1.849h4.907a1 1 0 00.95-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="comment-input" className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Your Written Review</label>
                <textarea
                  id="comment-input"
                  rows={3}
                  placeholder="What did you think of the plot, casting, or soundtrack?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500/40 resize-none"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl px-5 py-2.5 text-xs font-bold text-white transition active:scale-95 shadow-md"
                style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 1), #2563eb)' }}
              >
                Save Review
              </button>
            </form>

            {/* List Reviews */}
            <div className="space-y-4">
              {movieReviews.length > 0 ? (
                movieReviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="border-b border-white/5 pb-4 last:border-none last:pb-0 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-white">{rev.author}</span>
                        <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                          <svg className="h-2.5 w-2.5 fill-current text-amber-400" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span>{rev.rating}/5</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">{rev.date}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {rev.text}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteReview(movie.id, rev.id)}
                      className="text-slate-500 hover:text-red-400 transition"
                      title="Delete review"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-xs text-slate-400">No user notes or reviews yet. Be the first to share one!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Simulated HTML5 Video Player */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Preview Trailer</span>
            </h2>

            {/* Video Box */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-md group">
              <video
                ref={videoRef}
                src={movie.trailerUrl}
                loop
                playsInline
                onClick={handlePlayTrailer}
                className="h-full w-full object-cover cursor-pointer"
              />

              {/* Play state overlays */}
              {!isPlaying && (
                <div 
                  onClick={handlePlayTrailer}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 cursor-pointer transition duration-300 group-hover:bg-slate-950/60"
                >
                  <button
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 1), #2563eb)' }}
                  >
                    <svg className="h-6 w-6 fill-current pl-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    Play Preview Trailer
                  </span>
                </div>
              )}

              {/* Minimal visual playing indicator */}
              {isPlaying && (
                <div 
                  onClick={handlePlayTrailer}
                  className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur-sm cursor-pointer hover:bg-slate-900"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>Streaming Live Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Similar Recommendations Slider */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-lg font-bold text-white">More Like This</h2>
            
            {similarMovies.length > 0 ? (
              <div className="space-y-4">
                {similarMovies.map((similar) => (
                  <Link
                    key={similar.id}
                    to={`/movies/${similar.id}`}
                    className="group flex gap-3.5 rounded-2xl border border-white/5 bg-slate-950/20 p-2.5 transition-all duration-200 hover:border-white/10 hover:bg-slate-900/30"
                  >
                    <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-950 border border-white/5">
                      <img 
                        src={similar.posterUrl} 
                        alt={similar.title} 
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
                      />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-bold text-slate-200 group-hover:text-white transition line-clamp-1">
                          {similar.title}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-semibold">{similar.year}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400">
                          <svg className="h-2.5 w-2.5 fill-current text-amber-400" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span>{similar.rating.toFixed(1)}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 truncate line-clamp-1 max-w-[120px]">{similar.genres.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No similar movies found.</p>
            )}
          </div>

        </div>

      </section>
    </div>
  )
}
