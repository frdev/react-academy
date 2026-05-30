import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/algorithms/day-01-big-o-complexidade/metadata.json'
import day02 from '@/content/algorithms/day-02-arrays-two-pointers/metadata.json'
import day03 from '@/content/algorithms/day-03-hash-maps-sets/metadata.json'
import day04 from '@/content/algorithms/day-04-recursao/metadata.json'
import day05 from '@/content/algorithms/day-05-busca-binaria/metadata.json'
import day06 from '@/content/algorithms/day-06-linked-lists/metadata.json'
import day07 from '@/content/algorithms/day-07-stacks-queues/metadata.json'
import day08 from '@/content/algorithms/day-08-sorting-merge-quick/metadata.json'
import day09 from '@/content/algorithms/day-09-arvores-bst/metadata.json'
import day10 from '@/content/algorithms/day-10-heaps-priority-queue/metadata.json'
import day11 from '@/content/algorithms/day-11-grafos-bfs/metadata.json'
import day12 from '@/content/algorithms/day-12-grafos-dfs/metadata.json'
import day13 from '@/content/algorithms/day-13-backtracking/metadata.json'
import day14 from '@/content/algorithms/day-14-programacao-dinamica/metadata.json'

export const ALGORITHMS_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
  day08, day09, day10, day11, day12, day13, day14,
].map(l => l as LessonMetadata)

export function getAlgorithmsLessonById(id: string): LessonMetadata | undefined {
  return ALGORITHMS_LESSONS.find(l => l.id === id)
}

export function getAlgorithmsLessonsByWeek(week: number): LessonMetadata[] {
  return ALGORITHMS_LESSONS.filter(l => l.week === week)
}
