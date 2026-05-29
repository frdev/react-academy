import { create } from 'zustand'
import { upsertLessonProgress, upsertUserStats, getUserStats, getAllLessonProgress, db } from '../db/progressDb'
import {
  type LessonProgress,
  type UserStats,
  type Achievement,
  type AchievementId,
  XP_REWARDS,
  getLevelFromXp,
} from '../types'

interface ProgressState {
  currentStackId: string
  lessonProgress: Record<string, LessonProgress>
  userStats: UserStats | null
  achievements: Achievement[]
  isLoaded: boolean
  actions: {
    setStackId: (stackId: string) => Promise<void>
    loadProgress: () => Promise<void>
    markTheoryRead: (lessonId: string) => Promise<void>
    completeChallenge: (lessonId: string, score?: number) => Promise<void>
    submitQuiz: (lessonId: string, score: number) => Promise<void>
    addXp: (amount: number) => Promise<void>
    unlockAchievement: (id: AchievementId) => Promise<void>
  }
}

const DEFAULT_USER_STATS: Omit<UserStats, 'id'> = {
  totalXp: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  totalDaysCompleted: 0,
  totalTimeSpentSeconds: 0,
  lastStudiedAt: new Date().toISOString(),
  joinedAt: new Date().toISOString(),
  streakFreezeAvailable: false,
}

export const useProgressStore = create<ProgressState>((set, get) => {
  async function checkAchievements(
    lessonId: string,
    progress: Record<string, LessonProgress>,
    stats: UserStats,
    unlockAchievement: (id: AchievementId) => Promise<void>,
    existingAchievements: Achievement[]
  ) {
    const hasAchievement = (id: AchievementId) => existingAchievements.some(a => a.id === id)

    if (lessonId === 'day-01' && !hasAchievement('first-day')) {
      await unlockAchievement('first-day')
    }

    const week1Ids = ['day-01', 'day-02', 'day-03', 'day-04', 'day-05', 'day-06', 'day-07']
    if (!hasAchievement('week-1-complete') && week1Ids.every(id => progress[id]?.status === 'completed')) {
      await unlockAchievement('week-1-complete')
    }

    const week2Ids = ['day-08', 'day-09', 'day-10', 'day-11', 'day-12', 'day-13', 'day-14']
    if (!hasAchievement('week-2-complete') && week2Ids.every(id => progress[id]?.status === 'completed')) {
      await unlockAchievement('week-2-complete')
    }

    const week3Ids = ['day-15', 'day-16', 'day-17', 'day-18', 'day-19', 'day-20', 'day-21']
    if (!hasAchievement('week-3-complete') && week3Ids.every(id => progress[id]?.status === 'completed')) {
      await unlockAchievement('week-3-complete')
    }

    const week4Ids = ['day-22', 'day-23', 'day-24', 'day-25', 'day-26', 'day-27', 'day-28', 'day-29', 'day-30']
    if (!hasAchievement('week-4-complete') && week4Ids.every(id => progress[id]?.status === 'completed')) {
      await unlockAchievement('week-4-complete')
    }

    if (!hasAchievement('streak-7') && stats.currentStreak >= 7) await unlockAchievement('streak-7')
    if (!hasAchievement('streak-14') && stats.currentStreak >= 14) await unlockAchievement('streak-14')
    if (!hasAchievement('streak-30') && stats.currentStreak >= 30) await unlockAchievement('streak-30')

    if (!hasAchievement('perfect-quiz') && progress[lessonId]?.quizScore === 100) {
      await unlockAchievement('perfect-quiz')
    }

    const totalCompleted = Object.values(progress).filter(p => p.status === 'completed').length
    if (!hasAchievement('graduate') && totalCompleted >= 30) await unlockAchievement('graduate')
  }

  async function updateStreak(): Promise<{ newStreak: number; longestStreak: number }> {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const [todayStreak, yesterdayStreak] = await Promise.all([
      db.streaks.get(today),
      db.streaks.get(yesterday),
    ])

    const hadYesterdayStreak = yesterdayStreak?.studied === true
    const currentStats = get().userStats ?? { ...DEFAULT_USER_STATS }
    const newStreak = hadYesterdayStreak ? currentStats.currentStreak + 1 : 1
    const longestStreak = Math.max(currentStats.longestStreak, newStreak)

    await db.streaks.put({
      date: today,
      studied: true,
      lessonsCompleted: (todayStreak?.lessonsCompleted ?? 0) + 1,
      xpEarned: (todayStreak?.xpEarned ?? 0),
    })

    return { newStreak, longestStreak }
  }

  return {
    currentStackId: 'react',
    lessonProgress: {},
    userStats: null,
    achievements: [],
    isLoaded: false,

    actions: {
      setStackId: async (stackId: string) => {
        if (get().currentStackId === stackId && get().isLoaded) return
        set({ currentStackId: stackId, isLoaded: false, lessonProgress: {} })
        await get().actions.loadProgress()
      },

      loadProgress: async () => {
        const stackId = get().currentStackId
        const [progressRows, stats, achievementRows] = await Promise.all([
          getAllLessonProgress(stackId),
          getUserStats(),
          db.achievements.toArray(),
        ])

        const progressMap: Record<string, LessonProgress> = {}
        for (const row of progressRows) {
          progressMap[row.lessonId] = row
        }

        if (!stats) {
          await upsertUserStats(DEFAULT_USER_STATS)
        }

        set({
          lessonProgress: progressMap,
          userStats: stats ?? { ...DEFAULT_USER_STATS },
          achievements: achievementRows,
          isLoaded: true,
        })
      },

      markTheoryRead: async (lessonId: string) => {
        const stackId = get().currentStackId
        const existing = get().lessonProgress[lessonId]
        const now = new Date().toISOString()
        const updated: Omit<LessonProgress, 'id'> = {
          stackId,
          lessonId,
          status: existing?.status === 'completed' ? 'completed' : 'in-progress',
          theoryReadAt: now,
          challengeCompletedAt: existing?.challengeCompletedAt,
          quizScore: existing?.quizScore,
          quizCompletedAt: existing?.quizCompletedAt,
          timeSpentSeconds: existing?.timeSpentSeconds ?? 0,
          attempts: existing?.attempts ?? 0,
          lastAccessedAt: now,
        }
        await upsertLessonProgress(updated)
        await get().actions.addXp(XP_REWARDS.theoryRead)
        set(state => ({
          lessonProgress: { ...state.lessonProgress, [lessonId]: { ...existing, ...updated } },
        }))
      },

      completeChallenge: async (lessonId: string, score = 100) => {
        const stackId = get().currentStackId
        const existing = get().lessonProgress[lessonId]
        const now = new Date().toISOString()
        const isPerfect = score === 100
        const updated: Omit<LessonProgress, 'id'> = {
          stackId,
          lessonId,
          status: existing?.quizCompletedAt ? 'completed' : (existing?.status ?? 'in-progress'),
          theoryReadAt: existing?.theoryReadAt,
          challengeCompletedAt: now,
          quizScore: existing?.quizScore,
          quizCompletedAt: existing?.quizCompletedAt,
          timeSpentSeconds: existing?.timeSpentSeconds ?? 0,
          attempts: (existing?.attempts ?? 0) + 1,
          lastAccessedAt: now,
        }
        await upsertLessonProgress(updated)
        await get().actions.addXp(isPerfect ? XP_REWARDS.challengePerfect : XP_REWARDS.challengeComplete)
        set(state => ({
          lessonProgress: { ...state.lessonProgress, [lessonId]: { ...existing, ...updated } },
        }))
      },

      submitQuiz: async (lessonId: string, score: number) => {
        const stackId = get().currentStackId
        const existing = get().lessonProgress[lessonId]
        const now = new Date().toISOString()
        const passed = score >= 70
        const isPerfect = score === 100

        if (existing?.quizScore !== undefined && score <= existing.quizScore) {
          return
        }

        const isNowComplete = passed && !!(existing?.theoryReadAt || existing?.challengeCompletedAt)
        const updated: Omit<LessonProgress, 'id'> = {
          stackId,
          lessonId,
          status: isNowComplete ? 'completed' : (existing?.status ?? 'in-progress'),
          theoryReadAt: existing?.theoryReadAt,
          challengeCompletedAt: existing?.challengeCompletedAt,
          quizScore: score,
          quizCompletedAt: passed ? now : existing?.quizCompletedAt,
          timeSpentSeconds: existing?.timeSpentSeconds ?? 0,
          attempts: existing?.attempts ?? 0,
          lastAccessedAt: now,
        }
        await upsertLessonProgress(updated)

        if (passed) {
          await get().actions.addXp(isPerfect ? XP_REWARDS.quizPerfect : XP_REWARDS.quizPass)
        }

        set(state => ({
          lessonProgress: { ...state.lessonProgress, [lessonId]: { ...existing, ...updated } },
        }))

        if (isNowComplete) {
          const { newStreak, longestStreak } = await updateStreak()

          const currentStats = get().userStats ?? { ...DEFAULT_USER_STATS }
          const grantFreeze = newStreak >= 7 && !currentStats.streakFreezeAvailable
          const updatedStats: Omit<UserStats, 'id'> = {
            ...currentStats,
            currentStreak: newStreak,
            longestStreak,
            streakFreezeAvailable: grantFreeze || currentStats.streakFreezeAvailable,
          }
          await upsertUserStats(updatedStats)
          set({ userStats: { ...currentStats, ...updatedStats } })

          const currentProgress = get().lessonProgress
          const currentAchievements = get().achievements
          await checkAchievements(
            lessonId,
            currentProgress,
            { ...currentStats, currentStreak: newStreak, longestStreak },
            get().actions.unlockAchievement,
            currentAchievements
          )
        }
      },

      addXp: async (amount: number) => {
        const stats = get().userStats
        const currentXp = stats?.totalXp ?? 0
        const newXp = Math.max(0, currentXp + amount)
        const levelInfo = getLevelFromXp(newXp)
        const updated: Omit<UserStats, 'id'> = {
          ...(stats ?? DEFAULT_USER_STATS),
          totalXp: newXp,
          level: levelInfo.level,
          lastStudiedAt: new Date().toISOString(),
        }
        await upsertUserStats(updated)
        set({ userStats: { ...stats, ...updated } })
      },

      unlockAchievement: async (id: AchievementId) => {
        const already = get().achievements.find(a => a.id === id)
        if (already) return
        const achievement = { id, unlockedAt: new Date().toISOString() }
        await db.achievements.put(achievement)
        set(state => ({ achievements: [...state.achievements, achievement] }))
      },
    },
  }
})

// Selector hooks
export const useLessonProgressById = (lessonId: string) =>
  useProgressStore(state => state.lessonProgress[lessonId])

export const useUserStats = () =>
  useProgressStore(state => state.userStats)

export const useAchievements = () =>
  useProgressStore(state => state.achievements)

export const useProgressActions = () =>
  useProgressStore(state => state.actions)

export const useIsProgressLoaded = () =>
  useProgressStore(state => state.isLoaded)
