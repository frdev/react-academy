import { createBrowserRouter } from 'react-router'
import { lazy, Suspense } from 'react'

const StackSelectorPage = lazy(() => import('@/features/stacks/StackSelectorPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const LessonPage = lazy(() => import('@/features/lessons/LessonPage'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
    Carregando...
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<LoadingFallback />}><StackSelectorPage /></Suspense>,
  },
  {
    path: '/:stackId',
    element: <Suspense fallback={<LoadingFallback />}><DashboardPage /></Suspense>,
  },
  {
    path: '/:stackId/day/:dayId',
    element: <Suspense fallback={<LoadingFallback />}><LessonPage /></Suspense>,
    children: [
      { index: true, element: null },
      {
        path: 'theory',
        lazy: async () => {
          const { TheoryReader } = await import('@/features/lessons/LessonPage')
          return { Component: TheoryReader }
        },
      },
      {
        path: 'visualizer',
        lazy: async () => {
          const { VisualizerPage } = await import('@/features/visualizers/VisualizerPage')
          return { Component: VisualizerPage }
        },
      },
      {
        path: 'challenge',
        lazy: async () => {
          const { ChallengePad } = await import('@/features/lessons/LessonPage')
          return { Component: ChallengePad }
        },
      },
      {
        path: 'quiz',
        lazy: async () => {
          const { QuizRunner } = await import('@/features/lessons/LessonPage')
          return { Component: QuizRunner }
        },
      },
      {
        path: 'complete',
        lazy: async () => {
          const { CompletionScreen } = await import('@/features/lessons/LessonPage')
          return { Component: CompletionScreen }
        },
      },
    ],
  },
])
