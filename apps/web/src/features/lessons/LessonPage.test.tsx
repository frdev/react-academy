import { describe, it, expect, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import LessonPage from './LessonPage'
import { useProgressStore } from '@/features/progress/store/progressStore'
import { db } from '@/features/progress/db/progressDb'

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/:stackId/day/:dayId',
        element: <LessonPage />,
        children: [{ index: true, element: null }],
      },
    ],
    { initialEntries: [path] },
  )
  return render(<RouterProvider router={router} />)
}

describe('LessonPage', () => {
  beforeEach(async () => {
    await db.lessonProgress.clear()
    // Simulate landing on a lesson cold, with the store still on its default stack
    useProgressStore.setState({ currentStackId: 'react', lessonProgress: {}, isLoaded: false })
  })

  it('initializes the progress store with the stack from the URL', async () => {
    renderAt('/git/day/day-01')

    await waitFor(() => {
      expect(useProgressStore.getState().currentStackId).toBe('git')
    })
  })
})
