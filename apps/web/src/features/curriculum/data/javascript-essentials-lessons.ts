import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/javascript-essentials/day-01-valores-tipos-variaveis/metadata.json'
import day02 from '@/content/javascript-essentials/day-02-operadores-condicionais-loops/metadata.json'
import day03 from '@/content/javascript-essentials/day-03-funcoes/metadata.json'
import day04 from '@/content/javascript-essentials/day-04-objetos-arrays-metodos/metadata.json'
import day05 from '@/content/javascript-essentials/day-05-assincrono/metadata.json'
import day06 from '@/content/javascript-essentials/day-06-dom-e-eventos/metadata.json'
import day07 from '@/content/javascript-essentials/day-07-projeto-final-app/metadata.json'

export const JAVASCRIPT_ESSENTIALS_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
].map(l => l as LessonMetadata)

export function getJavaScriptEssentialsLessonById(id: string): LessonMetadata | undefined {
  return JAVASCRIPT_ESSENTIALS_LESSONS.find(l => l.id === id)
}

export function getJavaScriptEssentialsLessonsByWeek(week: number): LessonMetadata[] {
  return JAVASCRIPT_ESSENTIALS_LESSONS.filter(l => l.week === week)
}
