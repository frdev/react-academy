import { describe, it, expect, beforeEach } from 'vitest'
import { db, getLessonProgress, upsertLessonProgress, getUserStats, upsertUserStats, getCompletedCountsByStack } from './progressDb'

describe('progressDb', () => {
  beforeEach(async () => {
    await db.lessonProgress.clear()
    await db.userStats.clear()
    await db.streaks.clear()
    await db.achievements.clear()
  })

  it('upserts lesson progress (creates when not exists)', async () => {
    const progress = {
      stackId: 'react',
      lessonId: 'day-01',
      status: 'completed' as const,
      timeSpentSeconds: 300,
      attempts: 1,
      lastAccessedAt: new Date().toISOString(),
    }
    await upsertLessonProgress(progress)
    const result = await getLessonProgress('react', 'day-01')
    expect(result?.lessonId).toBe('day-01')
    expect(result?.status).toBe('completed')
  })

  it('upserts lesson progress (updates when exists)', async () => {
    const initial = {
      stackId: 'react',
      lessonId: 'day-01',
      status: 'in-progress' as const,
      timeSpentSeconds: 100,
      attempts: 1,
      lastAccessedAt: new Date().toISOString(),
    }
    await upsertLessonProgress(initial)
    await upsertLessonProgress({ ...initial, status: 'completed', timeSpentSeconds: 300 })

    const all = await db.lessonProgress.where('lessonId').equals('day-01').toArray()
    expect(all).toHaveLength(1)
    expect(all[0].status).toBe('completed')
    expect(all[0].timeSpentSeconds).toBe(300)
  })

  it('counts completed lessons grouped by stack', async () => {
    const base = { timeSpentSeconds: 0, attempts: 1, lastAccessedAt: new Date().toISOString() }
    await upsertLessonProgress({ ...base, stackId: 'react', lessonId: 'day-01', status: 'completed' })
    await upsertLessonProgress({ ...base, stackId: 'react', lessonId: 'day-02', status: 'completed' })
    await upsertLessonProgress({ ...base, stackId: 'git', lessonId: 'day-01', status: 'completed' })
    await upsertLessonProgress({ ...base, stackId: 'html', lessonId: 'day-01', status: 'in-progress' })

    const counts = await getCompletedCountsByStack()

    expect(counts.react).toBe(2)
    expect(counts.git).toBe(1)
    expect(counts.html ?? 0).toBe(0) // in-progress is not counted
  })

  it('gets and sets user stats', async () => {
    const stats = {
      totalXp: 100,
      level: 1,
      currentStreak: 3,
      longestStreak: 3,
      totalDaysCompleted: 1,
      totalTimeSpentSeconds: 1800,
      lastStudiedAt: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
      streakFreezeAvailable: false,
    }
    await upsertUserStats(stats)
    const result = await getUserStats()
    expect(result?.totalXp).toBe(100)
    expect(result?.currentStreak).toBe(3)
  })
})
