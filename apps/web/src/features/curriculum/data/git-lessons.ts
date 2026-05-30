import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/git/day-01-historico-local/metadata.json'
import day02 from '@/content/git/day-02-branches-merge-rebase/metadata.json'
import day03 from '@/content/git/day-03-remotes-prs-conflitos/metadata.json'

export const GIT_LESSONS: LessonMetadata[] = [
  day01, day02, day03,
].map(l => l as LessonMetadata)

export function getGitLessonById(id: string): LessonMetadata | undefined {
  return GIT_LESSONS.find(l => l.id === id)
}

export function getGitLessonsByWeek(week: number): LessonMetadata[] {
  return GIT_LESSONS.filter(l => l.week === week)
}
