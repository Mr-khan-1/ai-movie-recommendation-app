import { useState } from 'react'
import { useCinematch } from '../context/CinematchContext'
import GenreSelector from '../components/GenreSelector'
import MoodSelector from '../components/MoodSelector'
import RecommendationList from '../components/RecommendationList'
import SurpriseButton from '../components/SurpriseButton'
import MovieCard from '../components/MovieCard'
import { Link } from 'react-router-dom'
import { Mood } from '../types'

export default function HomePage() {
  const {
    movies,
    searchQuery,
    selectedGenres,
    setSelectedGenres,
    selectedMood,
    setSelectedMood,
    recommendations,
    favorites,
    toggleFavorite
  } = useCinematch()

  const [highlightedRecId, setHighlightedRecId] = useState<string | null>(null)

  // Filter lists based on categories
  const trendingMovies = [...movies].sort((a, b) => b.popularity - a.popularity).slice(0, 6)
  const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6)
  const popularMovies = movies.filter(m => m.popularity >= 80).slice(0, 6)
  const upcomingMovies = movies.filter(m => m.year === 2024).slice(0, 6)

  // Filter movies for search query
  const searchResults = searchQuery
    ? movies.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : []

  // Featured Spotlight Movie (Top Rated / Popular)
  const featuredMovie = movies.find(m => m.id === 'm02') || movies[0]
  const isFeaturedFavorited = favorites.includes(featuredMovie.id)

  const handleClearFilters = () => {
    setSelectedGenres([])
    setSelectedMood('')
  }

  const moodsList: Mood[] = [
    'light and funny',
    'intense',
    'feel-good',
    'mind-bending',
    'heartwarming',
    'dark',
  ]

  return (
    <div className="space-y-12">
      {/* 1. SEARCH ACTIVE VIEW */}
      {searchQuery ? (
        <section className="space-y-6 min-h-[60vh] animate-fadeIn">
          <div className="relative border-b border-white/5 pb-4">
            <span className="text-xs uppercase font-bold tracking-[0.2em]" style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}>
              Search Results
            </span>
            <h2 className="text-3xl font-black text-white">
              Showing matches for "{searchQuery}"
            </h2>
            {/* Scanner line visual effect */}
            <div 
              className="absolute bottom-0 left-0 h-[2px] w-full animate-pulse" 
              style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.8), transparent)' }}
            />
          </div>

          {searchResults.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {searchResults.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/20 p-8 text-center backdrop-blur-xl">
              <svg className="h-10 w-10 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <h3 className="mt-4 text-lg font-bold text-white">No movies found</h3>
              <p className="mt-2 text-sm text-slate-400 max-w-sm">
                We couldn't find any titles, genres, or directors matching "{searchQuery}". Try something else!
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* 2. cinematic HERO BANNER */}
          <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 shadow-2xl">
            {/* Backdrop Image */}
            <div className="absolute inset-0 opacity-40">
              <img
                src={featuredMovie.backdropUrl}
                alt={featuredMovie.title}
                className="h-full w-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b14] via-[#090b14]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090b14] via-[#090b14]/30 to-transparent" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-20 lg:px-12 flex flex-col gap-6">
              <span 
                className="inline-flex max-w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300"
                style={{ borderColor: 'rgba(var(--accent-rgb), 0.3)', backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
              >
                Spotlight Featured Film
              </span>
              
              <div className="max-w-2xl space-y-4">
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl uppercase">
                  {featuredMovie.title}
                </h1>
                <p className="text-xs font-semibold uppercase italic" style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}>
                  {featuredMovie.tagline}
                </p>
                <p className="text-sm text-slate-300 sm:text-base leading-relaxed line-clamp-3">
                  {featuredMovie.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1 text-amber-400">
                  <svg className="h-3 w-3 fill-current text-amber-400" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{featuredMovie.rating.toFixed(1)} Rating</span>
                </span>
                <span>•</span>
                <span>{featuredMovie.runtime} min</span>
                <span>•</span>
                <span className="rounded bg-white/5 px-2 py-0.5">{featuredMovie.year}</span>
                <span>•</span>
                <span>Dir: {featuredMovie.director}</span>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to={`/movies/${featuredMovie.id}`}
                  className="rounded-xl px-5 py-3 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                  style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 1), #2563eb)' }}
                >
                  View Details & Reviews
                </Link>
                <button
                  onClick={() => toggleFavorite(featuredMovie.id)}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-xs font-bold transition-all duration-200 hover:bg-white/10 hover:text-white ${
                    isFeaturedFavorited 
                      ? 'border-red-500 bg-red-500/10 text-red-500' 
                      : 'border-white/10 bg-white/5 text-slate-200'
                  }`}
                >
                  <svg className={`h-4 w-4 ${isFeaturedFavorited ? 'fill-current' : 'stroke-current'}`} fill={isFeaturedFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFeaturedFavorited ? 'Saved in Watchlist' : 'Add to Watchlist'}
                </button>
                <SurpriseButton />
              </div>
            </div>
          </section>

          {/* 3. DUAL-COLUMN RECOMMANDATION ENGINE */}
          <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
            {/* Left: Finder Console filters */}
            <aside className="rounded-3xl border border-white/5 bg-slate-900/30 p-6 backdrop-blur-xl h-fit space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(var(--accent-soft-rgb), 1)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span>CineMatch Engine</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust filters to find matches aligned with your interest.
                </p>
              </div>

              <div className="space-y-6 border-t border-white/5 pt-6">
                <GenreSelector 
                  selected={selectedGenres} 
                  onChange={setSelectedGenres} 
                />
                
                <MoodSelector 
                  moods={moodsList} 
                  selected={selectedMood} 
                  onChange={setSelectedMood} 
                />
              </div>

              {(selectedGenres.length > 0 || selectedMood) && (
                <button
                  onClick={handleClearFilters}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Clear Selection
                </button>
              )}
            </aside>

            {/* Right: Recommendations or Default Browse Lists */}
            <div className="space-y-8 min-h-[400px]">
              {selectedGenres.length > 0 && selectedMood ? (
                /* Matches List */
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Match Analyzer</span>
                      <h2 className="text-2xl font-black text-white mt-1">
                        We Found {recommendations.length} Match{recommendations.length !== 1 && 'es'}
                      </h2>
                    </div>
                    {recommendations.length > 0 && (
                      <p className="text-xs text-slate-400">
                        Hover cards to see details. Top matches displayed first.
                      </p>
                    )}
                  </div>

                  {recommendations.length > 0 ? (
                    <RecommendationList 
                      recommendations={recommendations} 
                      highlightedId={highlightedRecId} 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-900/10 p-10 text-center py-20">
                      <svg className="h-10 w-10 text-slate-500 animate-bounce mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <h3 className="mt-4 text-base font-bold text-white">No perfect match</h3>
                      <p className="mt-2 text-xs text-slate-400 max-w-sm leading-relaxed">
                        No movies match both the selected genres and mood combination. Try adjusting your mood or selecting other genres!
                      </p>
                      <button
                        onClick={handleClearFilters}
                        className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/10 hover:bg-violet-500/20 text-xs font-bold px-4 py-2 transition text-white"
                        style={{ borderColor: 'rgba(var(--accent-rgb), 0.2)', backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
                      >
                        Reset Engine
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Default Browse Dashboard: horizontal scroll lists */
                <div className="space-y-10">
                  {/* Informational Prompt */}
                  <div className="rounded-3xl bg-slate-900/20 border border-white/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white">Need a quick recommendation?</h3>
                      <p className="text-xs text-slate-400">Select at least one genre and a mood on the left to start the match analysis.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedGenres(['Action', 'Sci-Fi'])
                          setSelectedMood('intense')
                        }}
                        className="rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 px-3 py-1.5 text-[10px] font-bold text-white transition uppercase tracking-wider"
                      >
                        Try Demo Fit
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Lists */}
                  <div className="space-y-10">
                    {/* Trending Row */}
                    <div className="space-y-3">
                      <h2 className="text-lg font-black tracking-wider uppercase text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        Trending Movies
                      </h2>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                        {trendingMovies.map(movie => (
                          <MovieCard key={movie.id} movie={movie} />
                        ))}
                      </div>
                    </div>

                    {/* Popular Row */}
                    <div className="space-y-3">
                      <h2 className="text-lg font-black tracking-wider uppercase text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        Popular Choices
                      </h2>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                        {popularMovies.map(movie => (
                          <MovieCard key={movie.id} movie={movie} />
                        ))}
                      </div>
                    </div>

                    {/* Top Rated Row */}
                    <div className="space-y-3">
                      <h2 className="text-lg font-black tracking-wider uppercase text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Top Critic Picks
                      </h2>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                        {topRatedMovies.map(movie => (
                          <MovieCard key={movie.id} movie={movie} />
                        ))}
                      </div>
                    </div>

                    {/* Upcoming Row */}
                    <div className="space-y-3">
                      <h2 className="text-lg font-black tracking-wider uppercase text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        2024 New Releases
                      </h2>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                        {upcomingMovies.map(movie => (
                          <MovieCard key={movie.id} movie={movie} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
