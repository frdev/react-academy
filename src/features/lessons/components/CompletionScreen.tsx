import { useParams, useNavigate } from 'react-router'
import { useLesson } from '../hooks/useLesson'
import { useLessonProgressById } from '@/features/progress/hooks/useProgress'
import { Button } from '@/shared/components/ui/Button'

export function CompletionScreen() {
  const { dayId } = useParams<{ dayId: string }>()
  const navigate = useNavigate()
  const lesson = useLesson(dayId ?? '')
  const progress = useLessonProgressById(dayId ?? '')

  const nextDay = lesson ? `day-${String(lesson.day + 1).padStart(2, '0')}` : null
  const isLastDay = lesson?.day === 30

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
        <Button variant="secondary" onClick={() => navigate('/')}>
          Ver Dashboard
        </Button>
        {!isLastDay && nextDay && (
          <Button onClick={() => navigate(`/day/${nextDay}/theory`)}>
            Próximo Dia →
          </Button>
        )}
      </div>
    </div>
  )
}
