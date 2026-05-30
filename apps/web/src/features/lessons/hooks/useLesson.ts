import { getLessonsForStack } from '@/features/curriculum/data/index'
import { getStackById } from '@/features/stacks/data/stacks'
import type { LessonMetadata } from '@/features/curriculum/types'

function getPlaceholderLesson(id: string, maxDay = 30): LessonMetadata | undefined {
  const match = id.match(/^day-(\d+)$/)
  if (!match) return undefined
  const day = parseInt(match[1])
  if (day < 1 || day > maxDay) return undefined
  const week = day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 4
  return {
    id,
    day,
    week: week as 1 | 2 | 3 | 4,
    title: `Dia ${day}`,
    slug: id,
    topics: [],
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    prerequisites: day > 1 ? [`day-${String(day - 1).padStart(2, '0')}`] : [],
    hasVisualizer: false,
    hasChallenge: false,
    xpReward: 100,
  }
}

export function useLesson(lessonId: string, stackId = 'react'): LessonMetadata | undefined {
  const lessons = getLessonsForStack(stackId)
  const found = lessons.find(l => l.id === lessonId)
  if (found) return found
  const totalDays = getStackById(stackId)?.totalDays ?? 30
  return getPlaceholderLesson(lessonId, totalDays)
}

export type LessonStep = 'theory' | 'visualizer' | 'challenge' | 'quiz' | 'complete'

export function getLessonSteps(lesson: LessonMetadata): LessonStep[] {
  const steps: LessonStep[] = ['theory']
  if (lesson.hasVisualizer) steps.push('visualizer')
  if (lesson.hasChallenge) steps.push('challenge')
  steps.push('quiz', 'complete')
  return steps
}
