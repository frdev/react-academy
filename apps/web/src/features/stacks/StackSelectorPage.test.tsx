import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import StackSelectorPage from './StackSelectorPage'
import { db, upsertLessonProgress } from '@/features/progress/db/progressDb'

function renderPage() {
  const router = createMemoryRouter([{ path: '/', element: <StackSelectorPage /> }], {
    initialEntries: ['/'],
  })
  return render(<RouterProvider router={router} />)
}

describe('StackSelectorPage', () => {
  beforeEach(async () => {
    await db.lessonProgress.clear()
  })

  it('shows per-stack completion percentage instead of "Começar agora"', async () => {
    const base = { timeSpentSeconds: 0, attempts: 1, lastAccessedAt: new Date().toISOString() }
    // git has 3 days; 2 completed => 67%
    await upsertLessonProgress({ ...base, stackId: 'git', lessonId: 'day-01', status: 'completed' })
    await upsertLessonProgress({ ...base, stackId: 'git', lessonId: 'day-02', status: 'completed' })

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('67%')).toBeTruthy()
    })
    expect(screen.queryByText('Começar agora')).toBeNull()
  })
})
