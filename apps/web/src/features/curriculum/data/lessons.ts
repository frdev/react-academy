import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/react/day-01-render-cycle/metadata.json'
import day02 from '@/content/react/day-02-reconciliation/metadata.json'
import day03 from '@/content/react/day-03-virtual-dom/metadata.json'
import day04 from '@/content/react/day-04-state-vs-ref/metadata.json'
import day05 from '@/content/react/day-05-controlled-uncontrolled/metadata.json'
import day06 from '@/content/react/day-06-composition-pattern/metadata.json'
import day07 from '@/content/react/day-07-render-props-hoc/metadata.json'
import day08 from '@/content/react/day-08-usememo/metadata.json'
import day09 from '@/content/react/day-09-usecallback/metadata.json'
import day10 from '@/content/react/day-10-useref-profundidade/metadata.json'
import day11 from '@/content/react/day-11-custom-hooks/metadata.json'
import day12 from '@/content/react/day-12-usereducer/metadata.json'
import day13 from '@/content/react/day-13-context-performance/metadata.json'
import day14 from '@/content/react/day-14-uselayouteffect-vs-useeffect/metadata.json'
import day15 from '@/content/react/day-15-feature-based-architecture/metadata.json'
import day16 from '@/content/react/day-16-compound-components/metadata.json'
import day17 from '@/content/react/day-17-headless-components/metadata.json'
import day18 from '@/content/react/day-18-state-machines/metadata.json'
import day19 from '@/content/react/day-19-global-state/metadata.json'
import day20 from '@/content/react/day-20-server-state/metadata.json'
import day21 from '@/content/react/day-21-error-boundaries/metadata.json'
import day22 from '@/content/react/day-22-react-memo/metadata.json'
import day23 from '@/content/react/day-23-lazy-loading/metadata.json'
import day24 from '@/content/react/day-24-suspense/metadata.json'
import day25 from '@/content/react/day-25-concurrent-features/metadata.json'
import day26 from '@/content/react/day-26-tanstack-query/metadata.json'
import day27 from '@/content/react/day-27-testing/metadata.json'
import day28 from '@/content/react/day-28-accessibility/metadata.json'
import day29 from '@/content/react/day-29-design-patterns/metadata.json'
import day30 from '@/content/react/day-30-projeto-final/metadata.json'

export const LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
  day08, day09, day10, day11, day12, day13, day14,
  day15, day16, day17, day18, day19, day20, day21,
  day22, day23, day24, day25, day26, day27, day28, day29, day30,
].map(l => l as LessonMetadata)

export function getLessonById(id: string): LessonMetadata | undefined {
  return LESSONS.find(l => l.id === id)
}

export function getLessonByDay(day: number): LessonMetadata | undefined {
  return LESSONS.find(l => l.day === day)
}

export function getLessonsByWeek(week: number): LessonMetadata[] {
  return LESSONS.filter(l => l.week === week)
}
