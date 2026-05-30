import { useEffect, useState } from 'react'
import { useProgressStore, useLessonProgressById, useUserStats, useProgressActions, useIsProgressLoaded } from '../store/progressStore'
import { getCompletedCountsByStack } from '../db/progressDb'
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

/** Loads the number of completed lessons per stack from IndexedDB (for the stack selector). */
export function useCompletedCountsByStack(): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({})
  useEffect(() => {
    let active = true
    getCompletedCountsByStack().then(c => {
      if (active) setCounts(c)
    })
    return () => {
      active = false
    }
  }, [])
  return counts
}

export function useWeekProgress(week: number): { completed: number; total: number } {
  const lessonProgress = useProgressStore(state => state.lessonProgress)
  const currentStackId = useProgressStore(state => state.currentStackId)
  const weekLessons = getLessonsForStack(currentStackId).filter(l => l.week === week)
  const completed = weekLessons.filter(l => lessonProgress[l.id]?.status === 'completed').length
  return { completed, total: weekLessons.length }
}

export { useLessonProgressById, useUserStats, useProgressActions, useIsProgressLoaded }
