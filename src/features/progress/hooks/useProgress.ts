import { useEffect } from 'react'
import { useProgressStore, useLessonProgressById, useUserStats, useProgressActions, useIsProgressLoaded } from '../store/progressStore'
import { LESSONS } from '@/features/curriculum/data/lessons'

export function useInitProgress() {
  const { loadProgress } = useProgressStore(s => s.actions)
  const isLoaded = useIsProgressLoaded()

  useEffect(() => {
    if (!isLoaded) {
      loadProgress()
    }
  }, [isLoaded, loadProgress])

  return { isLoaded }
}

export function useLessonUnlockStatus(day: number): boolean {
  return useProgressStore(state => state.actions.isLessonUnlocked(day))
}

export function useCompletedDaysCount(): number {
  return useProgressStore(state =>
    Object.values(state.lessonProgress).filter(p => p.status === 'completed').length
  )
}

export function useWeekProgress(week: number): { completed: number; total: number } {
  const lessonProgress = useProgressStore(state => state.lessonProgress)
  const weekLessons = LESSONS.filter(l => l.week === week)
  const completed = weekLessons.filter(l => lessonProgress[l.id]?.status === 'completed').length
  return { completed, total: weekLessons.length }
}

export { useLessonProgressById, useUserStats, useProgressActions, useIsProgressLoaded }
