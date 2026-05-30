import { useWeekProgress } from '@/features/progress/hooks/useProgress'
import { useProgressStore } from '@/features/progress/store/progressStore'
import { getStackById } from '@/features/stacks/data/stacks'
import { getLessonsForStack } from '@/features/curriculum/data/index'
import { ProgressBar } from '@academy/ui'

const WEEK_COLORS = ['blue', 'green', 'amber', 'blue'] as const
type WeekColor = typeof WEEK_COLORS[number]

function WeekRow({ week, label, subtitle, color }: { week: number; label: string; subtitle: string; color: WeekColor }) {
  const { completed, total } = useWeekProgress(week)
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <div>
          <span className="text-sm font-medium text-gray-200">{label}</span>
          {subtitle && <span className="text-xs text-gray-500 ml-2">{subtitle}</span>}
        </div>
        <span className="text-xs text-gray-500">{completed}/{total}</span>
      </div>
      <ProgressBar value={pct} color={color} />
    </div>
  )
}

export function WeekProgress() {
  const currentStackId = useProgressStore(state => state.currentStackId)
  const stack = getStackById(currentStackId)
  const lessons = getLessonsForStack(currentStackId)
  const numWeeks = lessons.length > 0 ? Math.max(...lessons.map(l => l.week)) : 1

  return (
    <div className="space-y-4">
      {Array.from({ length: numWeeks }, (_, i) => i + 1).map(week => (
        <WeekRow
          key={week}
          week={week}
          label={`Semana ${week}`}
          subtitle={stack?.weekThemes?.[week - 1] ?? ''}
          color={WEEK_COLORS[(week - 1) % WEEK_COLORS.length]}
        />
      ))}
    </div>
  )
}
