import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/css/day-01-layout-intrinseco/metadata.json'
import day02 from '@/content/css/day-02-subgrid-masonry/metadata.json'
import day03 from '@/content/css/day-03-container-queries/metadata.json'
import day04 from '@/content/css/day-04-propriedades-logicas/metadata.json'
import day05 from '@/content/css/day-05-custom-properties-at-property/metadata.json'
import day06 from '@/content/css/day-06-cascade-layers/metadata.json'
import day07 from '@/content/css/day-07-has-is-where/metadata.json'
import day08 from '@/content/css/day-08-cor-moderna/metadata.json'
import day09 from '@/content/css/day-09-tipografia-fluida/metadata.json'
import day10 from '@/content/css/day-10-nesting-scope/metadata.json'
import day11 from '@/content/css/day-11-ui-moderna/metadata.json'
import day12 from '@/content/css/day-12-scroll-driven-animations/metadata.json'
import day13 from '@/content/css/day-13-view-transitions/metadata.json'
import day14 from '@/content/css/day-14-projeto-final-design-system/metadata.json'

export const CSS_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
  day08, day09, day10, day11, day12, day13, day14,
].map(l => l as LessonMetadata)

export function getCssLessonById(id: string): LessonMetadata | undefined {
  return CSS_LESSONS.find(l => l.id === id)
}

export function getCssLessonsByWeek(week: number): LessonMetadata[] {
  return CSS_LESSONS.filter(l => l.week === week)
}
