import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/react-essentials/day-01-componentes-e-jsx/metadata.json'
import day02 from '@/content/react-essentials/day-02-props-tipadas/metadata.json'
import day03 from '@/content/react-essentials/day-03-estado-usestate/metadata.json'
import day04 from '@/content/react-essentials/day-04-eventos-formularios/metadata.json'
import day05 from '@/content/react-essentials/day-05-listas-condicional/metadata.json'
import day06 from '@/content/react-essentials/day-06-useeffect-dados/metadata.json'
import day07 from '@/content/react-essentials/day-07-projeto-final-tarefas/metadata.json'

export const REACT_ESSENTIALS_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
].map(l => l as LessonMetadata)

export function getReactEssentialsLessonById(id: string): LessonMetadata | undefined {
  return REACT_ESSENTIALS_LESSONS.find(l => l.id === id)
}

export function getReactEssentialsLessonsByWeek(week: number): LessonMetadata[] {
  return REACT_ESSENTIALS_LESSONS.filter(l => l.week === week)
}
