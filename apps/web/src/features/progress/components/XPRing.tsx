import { getLevelFromXp, LEVEL_THRESHOLDS } from '../types'

interface XPRingProps {
  xp: number
  size?: number
}

export function XPRing({ xp, size = 64 }: XPRingProps) {
  const levelInfo = getLevelFromXp(xp)
  const nextLevel = LEVEL_THRESHOLDS.find(l => l.level === levelInfo.level + 1)

  const progress = nextLevel
    ? ((xp - levelInfo.minXp) / (nextLevel.minXp - levelInfo.minXp))
    : 1

  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - Math.min(1, progress))

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1f2937"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{levelInfo.level}</span>
      </div>
    </div>
  )
}
