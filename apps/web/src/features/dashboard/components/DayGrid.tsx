import { useNavigate } from 'react-router'
import { useProgressStore } from '@/features/progress/store/progressStore'
import { getLessonsForStack } from '@/features/curriculum/data/index'
import { cn } from '@academy/ui'
import type { LessonMetadata } from '@/features/curriculum/types'

function getPlaceholderLesson(day: number): LessonMetadata {
  const week = day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 4
  return {
    id: `day-${String(day).padStart(2, '0')}`,
    day,
    week: week as 1 | 2 | 3 | 4,
    title: `Dia ${day}`,
    slug: `day-${day}`,
    topics: [],
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    prerequisites: day > 1 ? [`day-${String(day - 1).padStart(2, '0')}`] : [],
    hasVisualizer: false,
    hasChallenge: false,
    xpReward: 100,
  }
}

const WEEK_LABELS = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']

interface DayCardProps {
  lesson: LessonMetadata
  isCompleted: boolean
  isInProgress: boolean
  onClick: () => void
}

function formatPrereq(id: string): string {
  const n = id.replace(/^day-/, '')
  return `Dia ${n}`
}

function DayCard({ lesson, isCompleted, isInProgress, onClick }: DayCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full text-left rounded-xl p-4 border transition-all duration-200',
        isCompleted && 'bg-green-900/30 border-green-700 hover:border-green-500',
        isInProgress && !isCompleted && 'bg-blue-900/20 border-blue-700 hover:border-blue-500',
        !isCompleted && !isInProgress && 'bg-gray-900 border-gray-700 hover:border-gray-500 hover:bg-gray-800',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs text-gray-500 font-mono">DIA {String(lesson.day).padStart(2, '0')}</div>
        {isCompleted && <span className="text-green-400 text-sm">✓</span>}
        {isInProgress && !isCompleted && <span className="text-blue-400 text-xs">em progresso</span>}
      </div>
      <div className={cn(
        'text-sm font-medium mt-1 leading-tight',
        isCompleted ? 'text-green-100' : 'text-gray-100'
      )}>
        {lesson.title}
      </div>
      <div className="text-xs text-gray-600 mt-1">~{lesson.estimatedMinutes}min</div>
      {lesson.prerequisites.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mt-2" title={`Requer: ${lesson.prerequisites.map(formatPrereq).join(', ')}`}>
          <span className="text-[10px] text-gray-600">🔗</span>
          {lesson.prerequisites.map(prereq => (
            <span
              key={prereq}
              className="text-[10px] text-gray-400 bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 leading-none"
            >
              {formatPrereq(prereq)}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

export function DayGrid({ stackId }: { stackId: string }) {
  const navigate = useNavigate()
  const lessonProgress = useProgressStore(state => state.lessonProgress)

  const stackLessons = getLessonsForStack(stackId)
  const allLessons: LessonMetadata[] = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    return stackLessons.find(l => l.day === day) ?? getPlaceholderLesson(day)
  })

  return (
    <div className="space-y-8">
      {[1, 2, 3, 4].map(week => {
        const weekLessons = allLessons.filter(l => l.week === week)
        return (
          <div key={week}>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {WEEK_LABELS[week - 1]}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weekLessons.map(lesson => {
                const progress = lessonProgress[lesson.id]
                return (
                  <DayCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={progress?.status === 'completed'}
                    isInProgress={progress?.status === 'in-progress'}
                    onClick={() => navigate(`/${stackId}/day/${lesson.id}/theory`)}
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
