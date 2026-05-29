import { LESSONS } from './lessons'
import { JS_LESSONS } from './javascript-lessons'
import { TS_LESSONS } from './typescript-lessons'
import type { LessonMetadata } from '@/features/curriculum/types'

export function getLessonsForStack(stackId: string): LessonMetadata[] {
  if (stackId === 'javascript') return JS_LESSONS
  if (stackId === 'typescript') return TS_LESSONS
  return LESSONS
}
