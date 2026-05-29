import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/ai/day-01-intro-ai-moderna/metadata.json'
import day02 from '@/content/ai/day-02-anthropic-api-sdk/metadata.json'
import day03 from '@/content/ai/day-03-prompt-context-engineering/metadata.json'
import day04 from '@/content/ai/day-04-tool-use/metadata.json'
import day05 from '@/content/ai/day-05-rag-embeddings/metadata.json'
import day06 from '@/content/ai/day-06-mcp-conceito/metadata.json'
import day07 from '@/content/ai/day-07-mcp-server/metadata.json'
import day08 from '@/content/ai/day-08-skills/metadata.json'
import day09 from '@/content/ai/day-09-agents-loop/metadata.json'
import day10 from '@/content/ai/day-10-memoria-estado/metadata.json'
import day11 from '@/content/ai/day-11-agent-sdk/metadata.json'
import day12 from '@/content/ai/day-12-multi-agentes/metadata.json'
import day13 from '@/content/ai/day-13-eval-observabilidade-guardrails/metadata.json'
import day14 from '@/content/ai/day-14-projeto-final-sistema-agentico/metadata.json'

export const AI_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
  day08, day09, day10, day11, day12, day13, day14,
].map(l => l as LessonMetadata)

export function getAiLessonById(id: string): LessonMetadata | undefined {
  return AI_LESSONS.find(l => l.id === id)
}

export function getAiLessonsByWeek(week: number): LessonMetadata[] {
  return AI_LESSONS.filter(l => l.week === week)
}
