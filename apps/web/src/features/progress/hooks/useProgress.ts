import { useEffect } from 'react'
import { useProgressStore, useLessonProgressById, useUserStats, useProgressActions, useIsProgressLoaded } from '../store/progressStore'
import { getLessonsForStack } from '@/features/curriculum/data/index'

export function useInitProgress(stackId?: string) {
  const { setStackId, loadProgress } = useProgressStore(s => s.actions)
  const currentStackId = useProgressStore(s => s.currentStackId)
  const isLoaded = useIsProgressLoaded()

  useEffect(() => {
    if (stackId && stackId !== currentStackId) {
      setStackId(stackId)
    } else if (!isLoaded) {
      loadProgress()
    }
  }, [stackId, currentStackId, isLoaded, setStackId, loadProgress])

  return { isLoaded }
}

export function useCompletedDaysCount(): number {
  return useProgressStore(state =>
    Object.values(state.lessonProgress).filter(p => p.status === 'completed').length
  )
}

export function useWeekProgress(week: number): { completed: number; total: number } {
  const lessonProgress = useProgressStore(state => state.lessonProgress)
  const currentStackId = useProgressStore(state => state.currentStackId)
  const weekLessons = getLessonsForStack(currentStackId).filter(l => l.week === week)
  const completed = weekLessons.filter(l => lessonProgress[l.id]?.status === 'completed').length
  return { completed, total: weekLessons.length }
}

export { useLessonProgressById, useUserStats, useProgressActions, useIsProgressLoaded }
