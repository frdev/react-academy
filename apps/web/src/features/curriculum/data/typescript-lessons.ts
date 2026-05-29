import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/typescript/day-01-type-system/metadata.json'
import day02 from '@/content/typescript/day-02-interfaces-type-aliases/metadata.json'
import day03 from '@/content/typescript/day-03-functions/metadata.json'
import day04 from '@/content/typescript/day-04-generics/metadata.json'
import day05 from '@/content/typescript/day-05-literal-types/metadata.json'
import day06 from '@/content/typescript/day-06-classes/metadata.json'
import day07 from '@/content/typescript/day-07-modules-declarations/metadata.json'
import day08 from '@/content/typescript/day-08-narrowing/metadata.json'
import day09 from '@/content/typescript/day-09-discriminated-unions/metadata.json'
import day10 from '@/content/typescript/day-10-utility-types-1/metadata.json'
import day11 from '@/content/typescript/day-11-mapped-types/metadata.json'
import day12 from '@/content/typescript/day-12-template-literal-types/metadata.json'
import day13 from '@/content/typescript/day-13-index-types/metadata.json'
import day14 from '@/content/typescript/day-14-intersection-types/metadata.json'
import day15 from '@/content/typescript/day-15-conditional-types/metadata.json'
import day16 from '@/content/typescript/day-16-infer/metadata.json'
import day17 from '@/content/typescript/day-17-recursive-types/metadata.json'
import day18 from '@/content/typescript/day-18-template-literal-advanced/metadata.json'
import day19 from '@/content/typescript/day-19-variance/metadata.json'
import day20 from '@/content/typescript/day-20-higher-kinded-types/metadata.json'
import day21 from '@/content/typescript/day-21-type-system-internals/metadata.json'
import day22 from '@/content/typescript/day-22-tsconfig/metadata.json'
import day23 from '@/content/typescript/day-23-declaration-files/metadata.json'
import day24 from '@/content/typescript/day-24-branded-types/metadata.json'
import day25 from '@/content/typescript/day-25-satisfies-noinfer/metadata.json'
import day26 from '@/content/typescript/day-26-assertion-functions/metadata.json'
import day27 from '@/content/typescript/day-27-decorators/metadata.json'
import day28 from '@/content/typescript/day-28-compiler-api/metadata.json'
import day29 from '@/content/typescript/day-29-type-checker-performance/metadata.json'
import day30 from '@/content/typescript/day-30-projeto-final-query-builder/metadata.json'

export const TS_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
  day08, day09, day10, day11, day12, day13, day14,
  day15, day16, day17, day18, day19, day20, day21,
  day22, day23, day24, day25, day26, day27, day28, day29, day30,
].map(l => l as LessonMetadata)

export function getTsLessonById(id: string): LessonMetadata | undefined {
  return TS_LESSONS.find(l => l.id === id)
}

export function getTsLessonsByWeek(week: number): LessonMetadata[] {
  return TS_LESSONS.filter(l => l.week === week)
}
