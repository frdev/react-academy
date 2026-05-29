import { useEffect, useState } from 'react'
import { db } from '../db/progressDb'
import type { Streak } from '../types'
import { cn } from '@academy/ui'

function getDatesGrid(): string[] {
  // Returns last 35 days (5 weeks) as YYYY-MM-DD strings, oldest first
  const dates: string[] = []
  const today = new Date()
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export function StreakCalendar() {
  const [streakMap, setStreakMap] = useState<Record<string, Streak>>({})
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const dates = getDatesGrid()
    db.streaks
      .where('date')
      .anyOf(dates)
      .toArray()
      .then(rows => {
        const map: Record<string, Streak> = {}
        for (const row of rows) map[row.date] = row
        setStreakMap(map)
      })
  }, [])

  const dates = getDatesGrid()
  // Split into weeks of 7
  const weeks: string[][] = []
  for (let i = 0; i < dates.length; i += 7) weeks.push(dates.slice(i, i + 7))

  return (
    <div>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((date) => {
              const streak = streakMap[date]
              const isToday = date === today
              const studied = streak?.studied === true
              const lessons = streak?.lessonsCompleted ?? 0

              return (
                <div
                  key={date}
                  title={`${date}${studied ? ` — ${lessons} lição(ões)` : ''}`}
                  className={cn(
                    'h-3 w-3 rounded-sm transition-colors',
                    studied && lessons >= 2 && 'bg-green-400',
                    studied && lessons === 1 && 'bg-green-600',
                    !studied && isToday && 'bg-blue-800 animate-pulse',
                    !studied && !isToday && 'bg-gray-800',
                  )}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs text-gray-600">menos</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-gray-800" />
          <div className="h-3 w-3 rounded-sm bg-green-700" />
          <div className="h-3 w-3 rounded-sm bg-green-500" />
          <div className="h-3 w-3 rounded-sm bg-green-400" />
        </div>
        <span className="text-xs text-gray-600">mais</span>
      </div>
    </div>
  )
}
