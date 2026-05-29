import Dexie, { type Table } from 'dexie'
import type { LessonProgress, UserStats, Streak, Achievement } from '../types'

class ProgressDatabase extends Dexie {
  lessonProgress!: Table<LessonProgress>
  userStats!: Table<UserStats>
  streaks!: Table<Streak>
  achievements!: Table<Achievement>

  constructor() {
    super('AcademyDB')
    this.version(1).stores({
      lessonProgress: '++id, lessonId, status, lastAccessedAt',
      userStats: '++id',
      streaks: 'date',
      achievements: 'id, unlockedAt',
    })
    this.version(2).stores({
      lessonProgress: '++id, lessonId, stackId, status, lastAccessedAt',
      userStats: '++id',
      streaks: 'date',
      achievements: 'id, unlockedAt',
    }).upgrade(tx =>
      tx.table('lessonProgress').toCollection().modify((record: LessonProgress) => {
        if (!record.stackId) record.stackId = 'react'
      })
    )
  }
}

export const db = new ProgressDatabase()

export async function getLessonProgress(stackId: string, lessonId: string): Promise<LessonProgress | undefined> {
  return db.lessonProgress
    .where('stackId').equals(stackId)
    .filter(r => r.lessonId === lessonId)
    .first()
}

export async function upsertLessonProgress(data: Omit<LessonProgress, 'id'>): Promise<void> {
  const existing = await getLessonProgress(data.stackId, data.lessonId)
  if (existing) {
    await db.lessonProgress.update(existing.id!, data)
  } else {
    await db.lessonProgress.add(data)
  }
}

export async function getAllLessonProgress(stackId: string): Promise<LessonProgress[]> {
  return db.lessonProgress.where('stackId').equals(stackId).toArray()
}

export async function getUserStats(): Promise<UserStats | undefined> {
  return db.userStats.orderBy('id').last()
}

export async function upsertUserStats(data: Omit<UserStats, 'id'>): Promise<void> {
  const existing = await getUserStats()
  if (existing) {
    await db.userStats.update(existing.id!, data)
  } else {
    await db.userStats.add(data)
  }
}

export async function getTodayStreak(): Promise<Streak | undefined> {
  const today = new Date().toISOString().split('T')[0]
  return db.streaks.get(today)
}

export async function upsertTodayStreak(data: Partial<Streak>): Promise<void> {
  const today = new Date().toISOString().split('T')[0]
  const existing = await db.streaks.get(today)
  if (existing) {
    await db.streaks.update(today, data)
  } else {
    await db.streaks.put({ date: today, studied: false, lessonsCompleted: 0, xpEarned: 0, ...data })
  }
}
