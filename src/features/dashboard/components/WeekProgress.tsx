import { useWeekProgress } from '@/features/progress/hooks/useProgress'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'

const WEEK_THEMES = [
  { week: 1 as const, label: 'Semana 1', subtitle: 'Fundamentos Profundos', color: 'blue' as const },
  { week: 2 as const, label: 'Semana 2', subtitle: 'Hooks Avançados', color: 'green' as const },
  { week: 3 as const, label: 'Semana 3', subtitle: 'Arquitetura', color: 'amber' as const },
  { week: 4 as const, label: 'Semana 4', subtitle: 'Performance', color: 'blue' as const },
]

function WeekRow({ week, label, subtitle, color }: typeof WEEK_THEMES[0]) {
  const { completed, total } = useWeekProgress(week)
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <div>
          <span className="text-sm font-medium text-gray-200">{label}</span>
          <span className="text-xs text-gray-500 ml-2">{subtitle}</span>
        </div>
        <span className="text-xs text-gray-500">{completed}/{total}</span>
      </div>
      <ProgressBar value={pct} color={color} />
    </div>
  )
}

export function WeekProgress() {
  return (
    <div className="space-y-4">
      {WEEK_THEMES.map(theme => (
        <WeekRow key={theme.week} {...theme} />
      ))}
    </div>
  )
}
