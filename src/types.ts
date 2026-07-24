export type Genre =
  | 'Comedy'
  | 'Drama'
  | 'Sci-Fi'
  | 'Horror'
  | 'Romance'
  | 'Action'
  | 'Animation'
  | 'Thriller'

export type Mood =
  | 'light and funny'
  | 'intense'
  | 'feel-good'
  | 'mind-bending'
  | 'heartwarming'
  | 'dark'

export interface Movie {
  id: string
  title: string
  year: number
  genres: Genre[]
  moods: Mood[]
  description: string
  rating: number
  backdropUrl: string
  posterUrl: string
  director: string
  cast: string[]
  runtime: number
  trailerUrl: string
  popularity: number
  releaseDate: string
  tagline: string
}
