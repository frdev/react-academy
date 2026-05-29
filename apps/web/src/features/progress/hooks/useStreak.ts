import { useProgressStore } from '../store/progressStore'

export function useCurrentStreak(): number {
  return useProgressStore(state => state.userStats?.currentStreak ?? 0)
}

export function useLongestStreak(): number {
  return useProgressStore(state => state.userStats?.longestStreak ?? 0)
}

export function useStreakFreezeAvailable(): boolean {
  return useProgressStore(state => state.userStats?.streakFreezeAvailable ?? false)
}
