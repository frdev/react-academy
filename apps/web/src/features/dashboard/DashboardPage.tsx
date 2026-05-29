import { useInitProgress, useCompletedDaysCount } from '@/features/progress/hooks/useProgress'
import { StatsPanel } from './components/StatsPanel'
import { WeekProgress } from './components/WeekProgress'
import { DayGrid } from './components/DayGrid'
import { useCurrentStreak } from '@/features/progress/hooks/useStreak'
import { useNavigate, useParams, Link } from 'react-router'
import { StreakCalendar } from '@/features/progress/components/StreakCalendar'
import { useDevStore } from '@/features/dev/devStore'
import { getStackById } from '@/features/stacks/data/stacks'

export default function DashboardPage() {
  const { stackId = 'react' } = useParams<{ stackId: string }>()
  const stack = getStackById(stackId)
  const { isLoaded } = useInitProgress(stackId)
  const streak = useCurrentStreak()
  const completedDays = useCompletedDaysCount()
  const navigate = useNavigate()
  const { unlockAll, toggle } = useDevStore()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium">
              ← Stacks
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <div>
              <h1 className="text-xl font-bold text-white">{stack?.name ?? stackId}</h1>
              <p className="text-xs text-gray-500">{stack?.tagline ?? ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-2 bg-orange-900/30 border border-orange-800 rounded-full px-3 py-1.5">
                <span>🔥</span>
                <span className="text-sm font-semibold text-orange-300">{streak} dias</span>
              </div>
            )}
            <button
              onClick={toggle}
              title={unlockAll ? 'Dev: todos desbloqueados — clique para desativar' : 'Dev: desbloquear todos os dias'}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                unlockAll
                  ? 'bg-violet-900/40 border-violet-600 text-violet-300 hover:bg-violet-900/60'
                  : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              <span>{unlockAll ? '🔓' : '🔒'}</span>
              <span>{unlockAll ? 'Dev ON' : 'Dev'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome message for new users */}
        {completedDays === 0 && (
          <section>
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Bem-vindo ao {stack?.name ?? stackId}!</h2>
                <p className="text-gray-400 text-sm">Comece sua jornada de {stack?.totalDays ?? 30} dias.</p>
              </div>
              <button
                onClick={() => navigate(`/${stackId}/day/day-01/theory`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
              >
                Comece pelo Dia 1 →
              </button>
            </div>
          </section>
        )}

        {/* Stats */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Seu Progresso</h2>
          <StatsPanel />
        </section>

        {/* Streak Calendar + Week Progress */}
        <div className="flex gap-6 items-start">
          <section className="shrink-0">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Histórico de Estudo</h2>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <StreakCalendar />
            </div>
          </section>

          <section className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Por Semana</h2>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-full">
              <WeekProgress />
            </div>
          </section>
        </div>

        {/* Day Grid */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Os {stack?.totalDays ?? 30} Dias</h2>
          <DayGrid stackId={stackId} />
        </section>
      </main>
    </div>
  )
}
