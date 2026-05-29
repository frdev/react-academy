import { cn } from '../lib/cn'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-gray-800 text-gray-300': variant === 'default',
          'bg-green-900/50 text-green-300': variant === 'success',
          'bg-amber-900/50 text-amber-300': variant === 'warning',
          'bg-blue-900/50 text-blue-300': variant === 'info',
        },
        className
      )}
      {...props}
    />
  )
}
