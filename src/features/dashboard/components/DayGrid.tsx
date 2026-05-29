import { useNavigate } from 'react-router'
import { useProgressStore } from '@/features/progress/store/progressStore'
import { LESSONS } from '@/features/curriculum/data/lessons'
import { cn } from '@/shared/lib/cn'
import type { LessonMetadata } from '@/features/curriculum/types'
import { useDevStore } from '@/features/dev/devStore'

const WEEK_2_TITLES = ['useMemo', 'useCallback', 'useRef em Profundidade', 'Custom Hooks', 'useReducer', 'Context Performance', 'useLayoutEffect vs useEffect']
const WEEK_3_TITLES = ['Feature-Based Architecture', 'Compound Components', 'Headless Components', 'State Machines', 'Global State', 'Server State', 'Error Boundaries']
const WEEK_4_TITLES = ['React.memo', 'Lazy Loading', 'Suspense', 'Concurrent Features', 'TanStack Query', 'Testing', 'Accessibility', 'Design Patterns', 'Projeto Final']

function getPlaceholderLesson(day: number): LessonMetadata {
  const week = day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 4
  const titles = week === 2 ? WEEK_2_TITLES : week === 3 ? WEEK_3_TITLES : WEEK_4_TITLES
  const weekDay = week === 2 ? day - 7 : week === 3 ? day - 14 : day - 21
  const title = titles[weekDay - 1] ?? `Dia ${day}`
  return {
    id: `day-${String(day).padStart(2, '0')}`,
    day,
    week: week as 1 | 2 | 3 | 4,
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    topics: [],
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    prerequisites: day > 1 ? [`day-${String(day - 1).padStart(2, '0')}`] : [],
    hasVisualizer: false,
    hasChallenge: true,
    xpReward: 100,
  }
}

const ALL_LESSONS: LessonMetadata[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  return LESSONS.find(l => l.day === day) ?? getPlaceholderLesson(day)
})

const WEEK_LABELS = ['Semana 1 — Fundamentos', 'Semana 2 — Hooks', 'Semana 3 — Arquitetura', 'Semana 4 — Performance']

interface DayCardProps {
  lesson: LessonMetadata
  isUnlocked: boolean
  isCompleted: boolean
  isInProgress: boolean
  onClick: () => void
}

function DayCard({ lesson, isUnlocked, isCompleted, isInProgress, onClick }: DayCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={!isUnlocked}
      className={cn(
        'relative w-full text-left rounded-xl p-4 border transition-all duration-200',
        isCompleted && 'bg-green-900/30 border-green-700 hover:border-green-500',
        isInProgress && !isCompleted && 'bg-blue-900/20 border-blue-700 hover:border-blue-500',
        !isCompleted && !isInProgress && isUnlocked && 'bg-gray-900 border-gray-700 hover:border-gray-500 hover:bg-gray-800',
        !isUnlocked && 'bg-gray-900/50 border-gray-800 cursor-not-allowed opacity-60',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs text-gray-500 font-mono">DIA {String(lesson.day).padStart(2, '0')}</div>
        {isCompleted && <span className="text-green-400 text-sm">✓</span>}
        {!isUnlocked && <span className="text-gray-600 text-sm">🔒</span>}
        {isInProgress && !isCompleted && <span className="text-blue-400 text-xs">em progresso</span>}
      </div>
      <div className={cn(
        'text-sm font-medium mt-1 leading-tight',
        isCompleted ? 'text-green-100' : isUnlocked ? 'text-gray-100' : 'text-gray-500'
      )}>
        {lesson.title}
      </div>
      <div className="text-xs text-gray-600 mt-1">~{lesson.estimatedMinutes}min</div>
    </button>
  )
}

export function DayGrid() {
  const navigate = useNavigate()
  const lessonProgress = useProgressStore(state => state.lessonProgress)
  const isLessonUnlocked = useProgressStore(state => state.actions.isLessonUnlocked)
  const unlockAll = useDevStore(state => state.unlockAll)

  return (
    <div className="space-y-8">
      {[1, 2, 3, 4].map(week => {
        const weekLessons = ALL_LESSONS.filter(l => l.week === week)
        return (
          <div key={week}>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {WEEK_LABELS[week - 1]}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weekLessons.map(lesson => {
                const progress = lessonProgress[lesson.id]
                const unlocked = unlockAll || isLessonUnlocked(lesson.day)
                return (
                  <DayCard
                    key={lesson.id}
                    lesson={lesson}
                    isUnlocked={unlocked}
                    isCompleted={progress?.status === 'completed'}
                    isInProgress={progress?.status === 'in-progress'}
                    onClick={() => navigate(`/day/${lesson.id}/theory`)}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
