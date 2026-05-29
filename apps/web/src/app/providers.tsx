import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AchievementToast } from '@/features/progress/components/AchievementToast'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AchievementToast />
    </QueryClientProvider>
  )
}
