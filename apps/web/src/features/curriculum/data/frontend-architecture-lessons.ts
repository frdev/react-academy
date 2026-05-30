import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/frontend-architecture/day-01-codigo-limpo/metadata.json'
import day02 from '@/content/frontend-architecture/day-02-componentizacao-e-estado/metadata.json'
import day03 from '@/content/frontend-architecture/day-03-arquitetura-por-feature/metadata.json'

export const FRONTEND_ARCHITECTURE_LESSONS: LessonMetadata[] = [
  day01, day02, day03,
].map(l => l as LessonMetadata)

export function getFrontendArchitectureLessonById(id: string): LessonMetadata | undefined {
  return FRONTEND_ARCHITECTURE_LESSONS.find(l => l.id === id)
}

export function getFrontendArchitectureLessonsByWeek(week: number): LessonMetadata[] {
  return FRONTEND_ARCHITECTURE_LESSONS.filter(l => l.week === week)
}
