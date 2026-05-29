import { useCurrentStreak, useStreakFreezeAvailable } from '../hooks/useStreak'
import { cn } from '@/shared/lib/cn'

interface StreakBadgeProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function StreakBadge({ className, size = 'md' }: StreakBadgeProps) {
  const streak = useCurrentStreak()
  const freezeAvailable = useStreakFreezeAvailable()

  if (streak === 0) return null

  return (
    <div className={cn(
      'flex items-center gap-1.5 rounded-full bg-orange-900/30 border border-orange-800',
      size === 'sm' && 'px-2 py-0.5',
      size === 'md' && 'px-3 py-1.5',
      size === 'lg' && 'px-4 py-2',
      className
    )}>
      <span className={size === 'sm' ? 'text-sm' : 'text-base'}>🔥</span>
      <span className={cn(
        'font-semibold text-orange-300',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-base',
      )}>
        {streak} {streak === 1 ? 'dia' : 'dias'}
      </span>
      {freezeAvailable && (
        <span title="Streak freeze disponível" className={size === 'sm' ? 'text-sm' : 'text-base'}>❄️</span>
      )}
    </div>
  )
}
