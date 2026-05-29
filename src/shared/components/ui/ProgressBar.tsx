import { cn } from '@/shared/lib/cn'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  showLabel?: boolean
  color?: 'blue' | 'green' | 'amber'
}

export function ProgressBar({ value, className, showLabel = false, color = 'blue' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 rounded-full bg-gray-800">
        <div
          className={cn('h-2 rounded-full transition-all duration-500', {
            'bg-blue-500': color === 'blue',
            'bg-green-500': color === 'green',
            'bg-amber-500': color === 'amber',
          })}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 mt-1">{clamped}%</span>
      )}
    </div>
  )
}
