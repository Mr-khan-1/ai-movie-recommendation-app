import { Genre } from '../types'

interface GenreSelectorProps {
  selected: Genre[]
  onChange: (genres: Genre[]) => void
}

const genres: Genre[] = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Animation',
  'Thriller',
]

export default function GenreSelector({ selected, onChange }: GenreSelectorProps) {
  function toggleGenre(genre: Genre) {
    onChange(selected.includes(genre) ? selected.filter((value) => value !== genre) : [...selected, genre])
  }

  return (
    <div className="space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Choose Genres (Select multiple)
      </span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2">
        {genres.map((name) => {
          const isSelected = selected.includes(name)
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggleGenre(name)}
              className={`flex items-center justify-center rounded-xl border py-2.5 px-3 text-center text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'border-violet-500 bg-violet-500/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)] font-bold'
                  : 'border-white/5 bg-slate-900/40 text-slate-300 hover:border-white/10 hover:bg-slate-900/60'
              }`}
              style={
                isSelected 
                  ? { 
                      borderColor: 'rgba(var(--accent-rgb), 1)', 
                      backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                      boxShadow: '0 0 15px rgba(var(--accent-rgb), 0.15)' 
                    } 
                  : undefined
              }
            >
              <span className="truncate">{name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
