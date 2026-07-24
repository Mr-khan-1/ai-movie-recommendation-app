import React, { createContext, useContext, useState, useEffect } from 'react'
import { Movie, Genre, Mood } from '../types'
import { MOVIES } from '../data/movies'
import { getRecommendations, Recommendation } from '../utils/recommend'

export interface Review {
  id: string
  rating: number
  text: string
  date: string
  author: string
}

interface CinematchContextType {
  movies: Movie[]
  favorites: string[]
  reviews: Record<string, Review[]>
  searchQuery: string
  selectedGenres: Genre[]
  selectedMood: Mood | ''
  recommendations: Recommendation[]
  themeColor: 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber'
  toggleFavorite: (movieId: string) => void
  addReview: (movieId: string, review: Omit<Review, 'id' | 'date'>) => void
  deleteReview: (movieId: string, reviewId: string) => void
  setSearchQuery: (query: string) => void
  setSelectedGenres: (genres: Genre[]) => void
  setSelectedMood: (mood: Mood | '') => void
  setThemeColor: (theme: 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber') => void
  clearFavorites: () => void
}

const CinematchContext = createContext<CinematchContextType | undefined>(undefined)

export const CinematchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('cinematch_favorites')
    return saved ? JSON.parse(saved) : []
  })

  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => {
    const saved = localStorage.getItem('cinematch_reviews')
    return saved ? JSON.parse(saved) : {}
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([])
  const [selectedMood, setSelectedMood] = useState<Mood | ''>('')
  const [themeColor, setThemeColorState] = useState<'violet' | 'cyan' | 'emerald' | 'rose' | 'amber'>(() => {
    const saved = localStorage.getItem('cinematch_theme')
    return (saved as any) || 'violet'
  })

  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('cinematch_favorites', JSON.stringify(favorites))
  }, [favorites])

  // Persist reviews
  useEffect(() => {
    localStorage.setItem('cinematch_reviews', JSON.stringify(reviews))
  }, [reviews])

  // Update theme in CSS custom properties
  useEffect(() => {
    localStorage.setItem('cinematch_theme', themeColor)
    const root = document.documentElement
    
    // Set theme variables
    let primary = '124, 58, 237' // Violet-600
    let primarySoft = '167, 139, 250' // Violet-400
    
    if (themeColor === 'cyan') {
      primary = '6, 182, 212' // Cyan-500
      primarySoft = '103, 232, 249' // Cyan-300
    } else if (themeColor === 'emerald') {
      primary = '16, 185, 129' // Emerald-500
      primarySoft = '110, 231, 183' // Emerald-300
    } else if (themeColor === 'rose') {
      primary = '244, 63, 94' // Rose-500
      primarySoft = '253, 164, 175' // Rose-300
    } else if (themeColor === 'amber') {
      primary = '245, 158, 11' // Amber-500
      primarySoft = '253, 230, 138' // Amber-200
    }

    root.style.setProperty('--accent-rgb', primary)
    root.style.setProperty('--accent-soft-rgb', primarySoft)
  }, [themeColor])

  // Re-run recommendations when filters change
  useEffect(() => {
    if (selectedGenres.length > 0 && selectedMood) {
      const matches = getRecommendations(MOVIES, selectedGenres, selectedMood)
      setRecommendations(matches)
    } else {
      setRecommendations([])
    }
  }, [selectedGenres, selectedMood])

  const toggleFavorite = (movieId: string) => {
    setFavorites((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    )
  }

  const addReview = (movieId: string, newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }

    setReviews((prev) => {
      const movieReviews = prev[movieId] ? [...prev[movieId]] : []
      return {
        ...prev,
        [movieId]: [review, ...movieReviews],
      }
    })
  }

  const deleteReview = (movieId: string, reviewId: string) => {
    setReviews((prev) => {
      if (!prev[movieId]) return prev
      return {
        ...prev,
        [movieId]: prev[movieId].filter((r) => r.id !== reviewId),
      }
    })
  }

  const setThemeColor = (color: 'violet' | 'cyan' | 'emerald' | 'rose' | 'amber') => {
    setThemeColorState(color)
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <CinematchContext.Provider
      value={{
        movies: MOVIES,
        favorites,
        reviews,
        searchQuery,
        selectedGenres,
        selectedMood,
        recommendations,
        themeColor,
        toggleFavorite,
        addReview,
        deleteReview,
        setSearchQuery,
        setSelectedGenres,
        setSelectedMood,
        setThemeColor,
        clearFavorites,
      }}
    >
      {children}
    </CinematchContext.Provider>
  )
}

export const useCinematch = () => {
  const context = useContext(CinematchContext)
  if (context === undefined) {
    throw new Error('useCinematch must be used within a CinematchProvider')
  }
  return context
}
