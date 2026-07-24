import { Genre, Mood, Movie } from '../types'

export interface Recommendation {
  movie: Movie
  matchingGenre: Genre
  matchingMood: Mood
  reason: string
}

function makeReason(movie: Movie, matchingGenre: Genre, matchingMood: Mood): string {
  const genrePhrase = movie.genres.length > 1 ? movie.genres.join(' + ') : movie.genres[0]
  const quality = movie.rating >= 8 ? 'one of the stronger matches in this set' : 'a solid fit for this selection'
  return `As a ${genrePhrase} pick with a ${matchingMood} tone, this one is ${quality}.`
}

export function getRecommendations(movies: Movie[], selectedGenres: Genre[], selectedMood: Mood): Recommendation[] {
  return movies
    .map((movie) => {
      const matchingGenre = movie.genres.find((genre) => selectedGenres.includes(genre))
      const matchingMood = movie.moods.find((mood) => mood === selectedMood)
      if (!matchingGenre || !matchingMood) {
        return null
      }

      return {
        movie,
        matchingGenre,
        matchingMood,
        reason: makeReason(movie, matchingGenre, matchingMood),
      }
    })
    .filter((item): item is Recommendation => item !== null)
    .sort((a, b) => b.movie.rating - a.movie.rating)
}
