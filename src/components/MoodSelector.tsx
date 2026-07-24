import { Mood } from '../types'

interface MoodSelectorProps {
  moods: Mood[]
  selected: Mood | ''
  onChange: (mood: Mood | '') => void
}

const moodLabels: Record<Mood, string> = {
  'light and funny': 'Light & Funny',
  'intense': 'Intense & Thrilling',
  'feel-good': 'Feel-Good',
  'mind-bending': 'Mind-Bending',
  'heartwarming': 'Heartwarming',
  'dark': 'Dark & Suspenseful',
}

export default function MoodSelector({ moods, selected, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Choose a Mood (Select one)
      </span>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
        {moods.map((mood) => {
          const isSelected = selected === mood
          const label = moodLabels[mood]
          
          return (
            <button
              key={mood}
              type="button"
              onClick={() => onChange(isSelected ? '' : mood)}
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
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
