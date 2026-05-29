import { describe, it, expect, beforeEach } from 'vitest'
import { useProgressStore } from './progressStore'
import { db } from '../db/progressDb'

describe('achievements', () => {
  beforeEach(async () => {
    await db.lessonProgress.clear()
    await db.userStats.clear()
    await db.streaks.clear()
    await db.achievements.clear()
    useProgressStore.setState({
      lessonProgress: {},
      userStats: null,
      achievements: [],
      isLoaded: false,
    })
  })

  it('unlocks first-day achievement after completing day-01', async () => {
    await useProgressStore.getState().actions.loadProgress()
    await useProgressStore.getState().actions.markTheoryRead('day-01')
    await useProgressStore.getState().actions.completeChallenge('day-01')
    await useProgressStore.getState().actions.submitQuiz('day-01', 100)

    const achievements = useProgressStore.getState().achievements
    expect(achievements.some(a => a.id === 'first-day')).toBe(true)
  })

  it('unlocks perfect-quiz achievement for 100% quiz score', async () => {
    await useProgressStore.getState().actions.loadProgress()
    await useProgressStore.getState().actions.markTheoryRead('day-01')
    await useProgressStore.getState().actions.completeChallenge('day-01')
    await useProgressStore.getState().actions.submitQuiz('day-01', 100)

    const achievements = useProgressStore.getState().achievements
    expect(achievements.some(a => a.id === 'perfect-quiz')).toBe(true)
  })

  it('does not unlock perfect-quiz for non-100% score', async () => {
    await useProgressStore.getState().actions.loadProgress()
    await useProgressStore.getState().actions.submitQuiz('day-01', 80)

    const achievements = useProgressStore.getState().achievements
    expect(achievements.some(a => a.id === 'perfect-quiz')).toBe(false)
  })
})
