import { LESSONS } from './lessons'
import { JS_LESSONS } from './javascript-lessons'
import type { LessonMetadata } from '@/features/curriculum/types'

export function getLessonsForStack(stackId: string): LessonMetadata[] {
  if (stackId === 'javascript') return JS_LESSONS
  return LESSONS
}
