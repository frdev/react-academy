export type Week = 1 | 2 | 3 | 4

export type DifficultyLevel = 'foundational' | 'intermediate' | 'advanced'

export interface LessonMetadata {
  id: string              // "day-01"
  day: number             // 1
  week: Week
  title: string           // "Render Cycle"
  slug: string            // "render-cycle"
  topics: string[]        // ["re-render", "trigger", "commit phase"]
  difficulty: DifficultyLevel
  estimatedMinutes: number
  prerequisites: string[] // ["day-01"]
  hasVisualizer: boolean
  hasChallenge: boolean
  xpReward: number
}

export interface QuizQuestion {
  id: string
  type: 'multiple-choice' | 'true-false' | 'code-output'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
}

export interface Quiz {
  lessonId: string
  questions: QuizQuestion[]
  passingScore: number // 0-100
}

export interface Challenge {
  id: string
  lessonId: string
  title: string
  description: string
  starterCode: Record<string, string>
  solutionCode: Record<string, string>
  validationTests?: string
  hints: string[]
}
