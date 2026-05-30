import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/css-essentials/day-01-seletores-cascata-especificidade/metadata.json'
import day02 from '@/content/css-essentials/day-02-box-model-display-position/metadata.json'
import day03 from '@/content/css-essentials/day-03-valores-unidades-cores-tipografia/metadata.json'
import day04 from '@/content/css-essentials/day-04-flexbox/metadata.json'
import day05 from '@/content/css-essentials/day-05-grid/metadata.json'
import day06 from '@/content/css-essentials/day-06-responsividade/metadata.json'
import day07 from '@/content/css-essentials/day-07-projeto-final-landing/metadata.json'

export const CSS_ESSENTIALS_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
].map(l => l as LessonMetadata)

export function getCssEssentialsLessonById(id: string): LessonMetadata | undefined {
  return CSS_ESSENTIALS_LESSONS.find(l => l.id === id)
}

export function getCssEssentialsLessonsByWeek(week: number): LessonMetadata[] {
  return CSS_ESSENTIALS_LESSONS.filter(l => l.week === week)
}
