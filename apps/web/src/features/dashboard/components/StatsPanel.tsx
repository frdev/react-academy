import { useUserStats } from '@/features/progress/hooks/useProgress'
import { useCurrentStreak } from '@/features/progress/hooks/useStreak'
import { useCompletedDaysCount } from '@/features/progress/hooks/useProgress'
import { getLevelFromXp, LEVEL_THRESHOLDS } from '@/features/progress/types'
import { Card, CardContent } from '@academy/ui'

export function StatsPanel() {
  const stats = useUserStats()
  const streak = useCurrentStreak()
  const completedDays = useCompletedDaysCount()
  const levelInfo = getLevelFromXp(stats?.totalXp ?? 0)
  const nextLevel = LEVEL_THRESHOLDS.find(l => l.level === levelInfo.level + 1)
  const xpProgress = nextLevel
    ? (((stats?.totalXp ?? 0) - levelInfo.minXp) / (nextLevel.minXp - levelInfo.minXp)) * 100
    : 100

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent>
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-white">{streak}</div>
          <div className="text-xs text-gray-500">dias seguidos</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-2xl font-bold text-white">{stats?.totalXp ?? 0}</div>
          <div className="text-xs text-gray-500">XP total</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-lg font-bold text-white">{levelInfo.title}</div>
          <div className="mt-2 h-1.5 rounded-full bg-gray-800">
            <div
              className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="text-2xl mb-1">✅</div>
          <div className="text-2xl font-bold text-white">{completedDays}/30</div>
          <div className="text-xs text-gray-500">dias completos</div>
        </CardContent>
      </Card>
    </div>
  )
}
