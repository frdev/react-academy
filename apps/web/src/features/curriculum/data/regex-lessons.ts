import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/regex/day-01-o-que-e-por-que/metadata.json'
import day02 from '@/content/regex/day-02-regex-na-pratica/metadata.json'
import day03 from '@/content/regex/day-03-boas-praticas-cheatsheet/metadata.json'

export const REGEX_LESSONS: LessonMetadata[] = [
  day01, day02, day03,
].map(l => l as LessonMetadata)

export function getRegexLessonById(id: string): LessonMetadata | undefined {
  return REGEX_LESSONS.find(l => l.id === id)
}

export function getRegexLessonsByWeek(week: number): LessonMetadata[] {
  return REGEX_LESSONS.filter(l => l.week === week)
}
