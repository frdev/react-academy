export type CompletionStatus = 'not-started' | 'in-progress' | 'completed'

export interface LessonProgress {
  id?: number
  lessonId: string
  status: CompletionStatus
  theoryReadAt?: string    // ISO date string
  challengeCompletedAt?: string
  quizScore?: number       // 0-100
  quizCompletedAt?: string
  timeSpentSeconds: number
  attempts: number
  lastAccessedAt: string   // ISO date string
}

export interface UserStats {
  id?: number
  totalXp: number
  level: number
  currentStreak: number
  longestStreak: number
  totalDaysCompleted: number
  totalTimeSpentSeconds: number
  lastStudiedAt: string    // ISO date string
  joinedAt: string         // ISO date string
  streakFreezeAvailable: boolean
}

export interface Streak {
  date: string             // "YYYY-MM-DD"
  studied: boolean
  lessonsCompleted: number
  xpEarned: number
}

export type AchievementId =
  | 'first-day'
  | 'week-1-complete'
  | 'week-2-complete'
  | 'week-3-complete'
  | 'week-4-complete'
  | 'streak-7'
  | 'streak-14'
  | 'streak-30'
  | 'perfect-quiz'
  | 'speed-learner'
  | 'graduate'

export interface Achievement {
  id: AchievementId
  unlockedAt: string       // ISO date string
}

export interface AchievementDefinition {
  id: AchievementId
  title: string
  description: string
  icon: string
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  { id: 'first-day', title: 'Primeiro Passo', description: 'Completar o Dia 1', icon: '🌱' },
  { id: 'week-1-complete', title: 'Fundamentos Dominados', description: 'Completar a Semana 1', icon: '🧱' },
  { id: 'week-2-complete', title: 'Hook Master', description: 'Completar a Semana 2', icon: '🪝' },
  { id: 'week-3-complete', title: 'Arquiteto', description: 'Completar a Semana 3', icon: '🏗️' },
  { id: 'week-4-complete', title: 'Performance Guru', description: 'Completar a Semana 4', icon: '⚡' },
  { id: 'streak-7', title: 'Uma Semana Seguida', description: '7 dias de streak', icon: '🔥' },
  { id: 'streak-14', title: 'Duas Semanas', description: '14 dias de streak', icon: '🚀' },
  { id: 'streak-30', title: 'Imparável', description: '30 dias de streak', icon: '💎' },
  { id: 'perfect-quiz', title: 'Mente Afiada', description: 'Quiz com 100%', icon: '🎯' },
  { id: 'speed-learner', title: 'Velocidade de Luz', description: 'Completar dia em < 30min', icon: '⚡' },
  { id: 'graduate', title: 'React Graduate', description: 'Completar os 30 dias', icon: '🎓' },
]

export const XP_REWARDS = {
  theoryRead: 20,
  challengeComplete: 50,
  challengePerfect: 70,
  quizPass: 30,
  quizPerfect: 50,
  hintPenalty: -5,
} as const

export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, title: 'Ferro' },
  { level: 2, minXp: 500, title: 'Ouro' },
  { level: 3, minXp: 1500, title: 'Platina' },
  { level: 4, minXp: 3000, title: 'Diamante' },
  { level: 5, minXp: 5000, title: 'Challenger' },
] as const

export function getLevelFromXp(xp: number): typeof LEVEL_THRESHOLDS[number] {
  return [...LEVEL_THRESHOLDS].reverse().find(l => xp >= l.minXp) ?? LEVEL_THRESHOLDS[0]
}
