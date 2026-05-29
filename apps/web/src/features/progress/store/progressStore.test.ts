import { describe, it, expect, beforeEach } from 'vitest'
import { useProgressStore } from './progressStore'
import { db } from '../db/progressDb'

describe('progressStore', () => {
  beforeEach(async () => {
    await db.lessonProgress.clear()
    await db.userStats.clear()
    await db.streaks.clear()
    await db.achievements.clear()
    // Reset store
    useProgressStore.setState({
      lessonProgress: {},
      userStats: null,
      achievements: [],
      isLoaded: false,
    })
  })

  it('loads progress from db', async () => {
    await useProgressStore.getState().actions.loadProgress()
    expect(useProgressStore.getState().isLoaded).toBe(true)
    expect(useProgressStore.getState().userStats).not.toBeNull()
  })

  it('marks theory as read and awards XP', async () => {
    await useProgressStore.getState().actions.loadProgress()
    await useProgressStore.getState().actions.markTheoryRead('day-01')

    const progress = useProgressStore.getState().lessonProgress['day-01']
    expect(progress.theoryReadAt).toBeDefined()
    expect(progress.status).toBe('in-progress')

    const stats = useProgressStore.getState().userStats
    expect(stats?.totalXp).toBe(20) // XP_REWARDS.theoryRead
  })

  it('marks a day as completed after all steps are done', async () => {
    await useProgressStore.getState().actions.loadProgress()

    // Complete all steps of day-01
    await useProgressStore.getState().actions.markTheoryRead('day-01')
    await useProgressStore.getState().actions.completeChallenge('day-01')
    await useProgressStore.getState().actions.submitQuiz('day-01', 100)

    // Day 1 should be completed
    const day1Progress = useProgressStore.getState().lessonProgress['day-01']
    expect(day1Progress.status).toBe('completed')
  })

  it('does not update quiz score if new score is lower', async () => {
    await useProgressStore.getState().actions.loadProgress()
    await useProgressStore.getState().actions.submitQuiz('day-01', 90)
    await useProgressStore.getState().actions.submitQuiz('day-01', 70)

    const progress = useProgressStore.getState().lessonProgress['day-01']
    expect(progress.quizScore).toBe(90)
  })

  it('unlocks achievement', async () => {
    await useProgressStore.getState().actions.loadProgress()
    await useProgressStore.getState().actions.unlockAchievement('first-day')

    const achievements = useProgressStore.getState().achievements
    expect(achievements).toHaveLength(1)
    expect(achievements[0].id).toBe('first-day')
  })

  it('does not duplicate achievement', async () => {
    await useProgressStore.getState().actions.loadProgress()
    await useProgressStore.getState().actions.unlockAchievement('first-day')
    await useProgressStore.getState().actions.unlockAchievement('first-day')

    const achievements = useProgressStore.getState().achievements
    expect(achievements).toHaveLength(1)
  })
})
