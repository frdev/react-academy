import { LESSONS } from './lessons'
import { JS_LESSONS } from './javascript-lessons'
import { TS_LESSONS } from './typescript-lessons'
import { ALGORITHMS_LESSONS } from './algorithms-lessons'
import { AI_LESSONS } from './ai-lessons'
import { CSS_LESSONS } from './css-lessons'
import type { LessonMetadata } from '@/features/curriculum/types'

export function getLessonsForStack(stackId: string): LessonMetadata[] {
  if (stackId === 'javascript') return JS_LESSONS
  if (stackId === 'typescript') return TS_LESSONS
  if (stackId === 'algorithms') return ALGORITHMS_LESSONS
  if (stackId === 'ai') return AI_LESSONS
  if (stackId === 'css') return CSS_LESSONS
  return LESSONS
}
