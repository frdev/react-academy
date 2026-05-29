import { useProgressStore } from '../store/progressStore'
import { ACHIEVEMENT_DEFINITIONS } from '../types'

export function useUnlockedAchievements() {
  const achievements = useProgressStore(state => state.achievements)
  return achievements.map(a => ({
    ...a,
    definition: ACHIEVEMENT_DEFINITIONS.find(d => d.id === a.id)!,
  }))
}

export function useHasAchievement(id: string): boolean {
  return useProgressStore(state => state.achievements.some(a => a.id === id))
}
