import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/html/day-01-anatomia-do-documento/metadata.json'
import day02 from '@/content/html/day-02-tags-semanticas-landmarks/metadata.json'
import day03 from '@/content/html/day-03-texto-listas-links/metadata.json'
import day04 from '@/content/html/day-04-imagens-midia-acessivel/metadata.json'
import day05 from '@/content/html/day-05-formularios-validacao/metadata.json'
import day06 from '@/content/html/day-06-aria-quando-necessario/metadata.json'
import day07 from '@/content/html/day-07-teclado-wcag/metadata.json'

export const HTML_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
].map(l => l as LessonMetadata)

export function getHtmlLessonById(id: string): LessonMetadata | undefined {
  return HTML_LESSONS.find(l => l.id === id)
}

export function getHtmlLessonsByWeek(week: number): LessonMetadata[] {
  return HTML_LESSONS.filter(l => l.week === week)
}
