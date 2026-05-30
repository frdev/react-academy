import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { CompletionScreen } from './CompletionScreen'
import { useProgressStore } from '@/features/progress/store/progressStore'

function renderAt(path: string) {
  const router = createMemoryRouter(
    [{ path: '/:stackId/day/:dayId/complete', element: <CompletionScreen /> }],
    { initialEntries: [path] },
  )
  return render(<RouterProvider router={router} />)
}

describe('CompletionScreen', () => {
  beforeEach(() => {
    useProgressStore.setState({ lessonProgress: {} })
  })

  it('treats the final day of a short stack as the last day', () => {
    // git has 3 days; day-03 is the last one
    renderAt('/git/day/day-03/complete')

    expect(screen.getByText('Curso Completo!')).toBeTruthy()
    expect(screen.queryByText(/Próximo Dia/)).toBeNull()
  })

  it('offers the next day when not on the last day', () => {
    renderAt('/git/day/day-01/complete')

    expect(screen.getByText('Dia 1 Concluído!')).toBeTruthy()
    expect(screen.getByText(/Próximo Dia/)).toBeTruthy()
  })
})
