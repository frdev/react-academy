import { useLessonProgressById, useProgressActions } from '@/features/progress/hooks/useProgress'

export function useLessonActions(lessonId: string) {
  const progress = useLessonProgressById(lessonId)
  const actions = useProgressActions()

  return {
    progress,
    markTheoryRead: () => actions.markTheoryRead(lessonId),
    completeChallenge: (score?: number) => actions.completeChallenge(lessonId, score),
    submitQuiz: (score: number) => actions.submitQuiz(lessonId, score),
  }
}
