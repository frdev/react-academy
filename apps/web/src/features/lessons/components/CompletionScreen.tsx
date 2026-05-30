import { useParams, useNavigate } from 'react-router'
import { useLesson } from '../hooks/useLesson'
import { useLessonProgressById } from '@/features/progress/hooks/useProgress'
import { getStackById } from '@/features/stacks/data/stacks'
import { Button } from '@academy/ui'

export function CompletionScreen() {
  const { stackId = 'react', dayId } = useParams<{ stackId: string; dayId: string }>()
  const navigate = useNavigate()
  const lesson = useLesson(dayId ?? '', stackId)
  const progress = useLessonProgressById(dayId ?? '')

  const totalDays = getStackById(stackId)?.totalDays ?? 30
  const isLastDay = !lesson || lesson.day >= totalDays
  const nextDay = !isLastDay ? `day-${String(lesson.day + 1).padStart(2, '0')}` : null

  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-6">{isLastDay ? '🎓' : '✅'}</div>
      <h2 className="text-3xl font-bold text-white mb-3">
        {isLastDay ? 'Curso Completo!' : `Dia ${lesson?.day} Concluído!`}
      </h2>
      <p className="text-gray-400 mb-2">{lesson?.title}</p>
      {progress?.quizScore !== undefined && (
        <p className="text-blue-400 text-sm mb-8">Quiz: {progress.quizScore}%</p>
      )}

      <div className="flex gap-4 justify-center">
        <Button variant="secondary" onClick={() => navigate(`/${stackId}`)}>
          Ver Dashboard
        </Button>
        {!isLastDay && nextDay && (
          <Button onClick={() => navigate(`/${stackId}/day/${nextDay}/theory`)}>
            Próximo Dia →
          </Button>
        )}
      </div>
    </div>
  )
}
