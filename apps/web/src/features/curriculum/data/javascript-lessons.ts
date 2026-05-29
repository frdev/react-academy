import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/javascript/day-01-types-coercion/metadata.json'
import day02 from '@/content/javascript/day-02-scope-closures/metadata.json'
import day03 from '@/content/javascript/day-03-functions/metadata.json'
import day04 from '@/content/javascript/day-04-this-keyword/metadata.json'
import day05 from '@/content/javascript/day-05-prototype-chain/metadata.json'
import day06 from '@/content/javascript/day-06-event-loop/metadata.json'
import day07 from '@/content/javascript/day-07-promises-async-await/metadata.json'
import day08 from '@/content/javascript/day-08-iterators-generators/metadata.json'
import day09 from '@/content/javascript/day-09-async-generators/metadata.json'
import day10 from '@/content/javascript/day-10-classes-inheritance/metadata.json'
import day11 from '@/content/javascript/day-11-modules/metadata.json'
import day12 from '@/content/javascript/day-12-destructuring-patterns/metadata.json'
import day13 from '@/content/javascript/day-13-error-handling/metadata.json'
import day14 from '@/content/javascript/day-14-weakmap-weakref/metadata.json'
import day15 from '@/content/javascript/day-15-symbols/metadata.json'
import day16 from '@/content/javascript/day-16-proxy-reflect/metadata.json'
import day17 from '@/content/javascript/day-17-functional-programming/metadata.json'
import day18 from '@/content/javascript/day-18-design-patterns/metadata.json'
import day19 from '@/content/javascript/day-19-memory-management/metadata.json'
import day20 from '@/content/javascript/day-20-workers-concurrency/metadata.json'
import day21 from '@/content/javascript/day-21-security/metadata.json'
import day22 from '@/content/javascript/day-22-ast-code-transformation/metadata.json'
import day23 from '@/content/javascript/day-23-v8-internals-compilation/metadata.json'
import day24 from '@/content/javascript/day-24-v8-hidden-classes/metadata.json'
import day25 from '@/content/javascript/day-25-advanced-async-patterns/metadata.json'
import day26 from '@/content/javascript/day-26-decorators/metadata.json'
import day27 from '@/content/javascript/day-27-temporal-i18n/metadata.json'
import day28 from '@/content/javascript/day-28-advanced-testing/metadata.json'
import day29 from '@/content/javascript/day-29-observability/metadata.json'
import day30 from '@/content/javascript/day-30-projeto-final-framework/metadata.json'

export const JS_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
  day08, day09, day10, day11, day12, day13, day14,
  day15, day16, day17, day18, day19, day20, day21,
  day22, day23, day24, day25, day26, day27, day28, day29, day30,
].map(l => l as LessonMetadata)

export function getJsLessonById(id: string): LessonMetadata | undefined {
  return JS_LESSONS.find(l => l.id === id)
}

export function getJsLessonsByWeek(week: number): LessonMetadata[] {
  return JS_LESSONS.filter(l => l.week === week)
}
