import { LESSONS } from './lessons'
import { JS_LESSONS } from './javascript-lessons'
import { TS_LESSONS } from './typescript-lessons'
import { ALGORITHMS_LESSONS } from './algorithms-lessons'
import { AI_LESSONS } from './ai-lessons'
import { CSS_LESSONS } from './css-lessons'
import { HTML_LESSONS } from './html-lessons'
import { REGEX_LESSONS } from './regex-lessons'
import { PACKAGE_MANAGERS_LESSONS } from './package-managers-lessons'
import { GIT_LESSONS } from './git-lessons'
import { FRONTEND_ARCHITECTURE_LESSONS } from './frontend-architecture-lessons'
import { TYPESCRIPT_ESSENTIALS_LESSONS } from './typescript-essentials-lessons'
import { CSS_ESSENTIALS_LESSONS } from './css-essentials-lessons'
import { JAVASCRIPT_ESSENTIALS_LESSONS } from './javascript-essentials-lessons'
import { REACT_ESSENTIALS_LESSONS } from './react-essentials-lessons'
import type { LessonMetadata } from '@/features/curriculum/types'

export function getLessonsForStack(stackId: string): LessonMetadata[] {
  if (stackId === 'javascript') return JS_LESSONS
  if (stackId === 'typescript') return TS_LESSONS
  if (stackId === 'algorithms') return ALGORITHMS_LESSONS
  if (stackId === 'ai') return AI_LESSONS
  if (stackId === 'css') return CSS_LESSONS
  if (stackId === 'html') return HTML_LESSONS
  if (stackId === 'regex') return REGEX_LESSONS
  if (stackId === 'package-managers') return PACKAGE_MANAGERS_LESSONS
  if (stackId === 'git') return GIT_LESSONS
  if (stackId === 'frontend-architecture') return FRONTEND_ARCHITECTURE_LESSONS
  if (stackId === 'typescript-essentials') return TYPESCRIPT_ESSENTIALS_LESSONS
  if (stackId === 'css-essentials') return CSS_ESSENTIALS_LESSONS
  if (stackId === 'javascript-essentials') return JAVASCRIPT_ESSENTIALS_LESSONS
  if (stackId === 'react-essentials') return REACT_ESSENTIALS_LESSONS
  return LESSONS
}
