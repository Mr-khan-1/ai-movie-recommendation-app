import { Recommendation } from '../utils/recommend'
import MovieCard from './MovieCard'

interface RecommendationListProps {
  recommendations: Recommendation[]
  highlightedId: string | null
}

export default function RecommendationList({ recommendations, highlightedId }: RecommendationListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
      {recommendations.map((rec, index) => (
        <div 
          key={rec.movie.id}
          style={{ animationDelay: `${index * 80}ms` }}
          className="animate-fadeIn opacity-0 fill-mode-forwards"
        >
          <MovieCard
            movie={rec.movie}
            reason={rec.reason}
            highlighted={highlightedId === rec.movie.id}
            genre={rec.matchingGenre}
            mood={rec.matchingMood}
          />
        </div>
      ))}
    </div>
  )
}
