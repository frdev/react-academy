import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/package-managers/day-01-o-que-e/metadata.json'
import day02 from '@/content/package-managers/day-02-npm-na-pratica/metadata.json'
import day03 from '@/content/package-managers/day-03-npm-yarn-pnpm/metadata.json'

export const PACKAGE_MANAGERS_LESSONS: LessonMetadata[] = [
  day01, day02, day03,
].map(l => l as LessonMetadata)

export function getPackageManagersLessonById(id: string): LessonMetadata | undefined {
  return PACKAGE_MANAGERS_LESSONS.find(l => l.id === id)
}

export function getPackageManagersLessonsByWeek(week: number): LessonMetadata[] {
  return PACKAGE_MANAGERS_LESSONS.filter(l => l.week === week)
}
