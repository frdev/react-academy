import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/typescript-essentials/day-01-tipos-e-inferencia/metadata.json'
import day02 from '@/content/typescript-essentials/day-02-interfaces-e-narrowing/metadata.json'
import day03 from '@/content/typescript-essentials/day-03-generics-e-utility-types/metadata.json'

export const TYPESCRIPT_ESSENTIALS_LESSONS: LessonMetadata[] = [
  day01, day02, day03,
].map(l => l as LessonMetadata)

export function getTypeScriptEssentialsLessonById(id: string): LessonMetadata | undefined {
  return TYPESCRIPT_ESSENTIALS_LESSONS.find(l => l.id === id)
}

export function getTypeScriptEssentialsLessonsByWeek(week: number): LessonMetadata[] {
  return TYPESCRIPT_ESSENTIALS_LESSONS.filter(l => l.week === week)
}
