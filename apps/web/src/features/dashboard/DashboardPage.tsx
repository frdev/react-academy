import { useInitProgress, useCompletedDaysCount } from '@/features/progress/hooks/useProgress'
import { WeekProgress } from './components/WeekProgress'
import { DayGrid } from './components/DayGrid'
import { useNavigate, useParams, Link } from 'react-router'
import { getStackById } from '@/features/stacks/data/stacks'

export default function DashboardPage() {
  const { stackId = 'react' } = useParams<{ stackId: string }>()
  const stack = getStackById(stackId)
  const { isLoaded } = useInitProgress(stackId)
  const completedDays = useCompletedDaysCount()
  const navigate = useNavigate()

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link to="/" className="text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium shrink-0 whitespace-nowrap">
            ← Stacks
          </Link>
          <div className="w-px h-5 bg-gray-700 shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{stack?.name ?? stackId}</h1>
            <p className="text-xs text-gray-500 truncate">{stack?.tagline ?? ''}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome message for new users */}
        {completedDays === 0 && (
          <section>
            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-white mb-1">Bem-vindo ao {stack?.name ?? stackId}!</h2>
                <p className="text-gray-400 text-sm">Comece sua jornada de {stack?.totalDays ?? 30} dias.</p>
              </div>
              <button
                onClick={() => navigate(`/${stackId}/day/day-01/theory`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap shrink-0 self-start sm:self-auto"
              >
                Comece pelo Dia 1 →
              </button>
            </div>
          </section>
        )}

        {/* Progresso por semana */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Por Semana</h2>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <WeekProgress />
          </div>
        </section>

        {/* Day Grid */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Os {stack?.totalDays ?? 30} Dias</h2>
          <DayGrid stackId={stackId} />
        </section>
      </main>
    </div>
  )
}
