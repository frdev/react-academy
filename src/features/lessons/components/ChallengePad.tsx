import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useLesson, getLessonSteps } from '../hooks/useLesson'
import { useLessonActions } from '../hooks/useLessonProgress'
import { CodePlayground } from '@/features/playground/components/CodePlayground'
import { PlaygroundToolbar } from '@/features/playground/components/PlaygroundToolbar'
import { useProgressActions } from '@/features/progress/hooks/useProgress'
import { XP_REWARDS } from '@/features/progress/types'
import { Button } from '@/shared/components/ui/Button'
import type { SandpackFiles } from '@codesandbox/sandpack-react'

// We enumerate challenge imports — Vite needs static paths for dynamic imports
const CHALLENGE_IMPORTS: Record<string, () => Promise<{
  starterCode: SandpackFiles
  solutionCode: SandpackFiles
  hints: string[]
}>> = {
  'day-01': () => import('@/content/day-01-render-cycle/challenge'),
  'day-02': () => import('@/content/day-02-reconciliation/challenge'),
  'day-03': () => import('@/content/day-03-virtual-dom/challenge'),
  'day-04': () => import('@/content/day-04-state-vs-ref/challenge'),
  'day-05': () => import('@/content/day-05-controlled-uncontrolled/challenge'),
  'day-06': () => import('@/content/day-06-composition-pattern/challenge'),
  'day-07': () => import('@/content/day-07-render-props-hoc/challenge'),
  'day-30': () => import('@/content/day-30-projeto-final/challenge'),
}

function useChallenge(dayId: string) {
  const [data, setData] = useState<{
    starterCode: SandpackFiles
    solutionCode: SandpackFiles
    hints: string[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const importer = CHALLENGE_IMPORTS[dayId]
    if (!importer) {
      setIsLoading(false)
      return
    }
    importer()
      .then(m => {
        setData(m)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [dayId])

  return { data, isLoading }
}

export function ChallengePad() {
  const { dayId } = useParams<{ dayId: string }>()
  const navigate = useNavigate()
  const lesson = useLesson(dayId ?? '')
  const { completeChallenge } = useLessonActions(dayId ?? '')
  const { addXp } = useProgressActions()
  const { data, isLoading } = useChallenge(dayId ?? '')

  const [hintsUsed, setHintsUsed] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (isLoading) {
    return <div className="text-gray-500 animate-pulse">Carregando desafio...</div>
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Desafio não disponível para este dia.</p>
        <Button
          className="mt-6"
          onClick={() => {
            if (!lesson) return
            const steps = getLessonSteps(lesson)
            const quizIndex = steps.indexOf('quiz')
            navigate(`/day/${dayId}/${steps[quizIndex]}`)
          }}
        >
          Continuar para o Quiz →
        </Button>
      </div>
    )
  }

  const handleUseHint = async () => {
    setHintsUsed(prev => prev + 1)
    await addXp(XP_REWARDS.hintPenalty)
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    await completeChallenge()
    // Navigate to quiz after a short delay
    setTimeout(() => {
      if (!lesson) return
      const steps = getLessonSteps(lesson)
      const quizIndex = steps.indexOf('quiz')
      navigate(`/day/${dayId}/${steps[quizIndex]}`)
    }, 1500)
  }

  const currentFiles = showSolution ? data.solutionCode : data.starterCode

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Desafio — {lesson?.title}</h2>
        <p className="text-gray-400 text-sm">
          {showSolution
            ? 'Você está vendo a solução. Estude o código antes de continuar.'
            : 'Resolva o desafio no editor abaixo. Use as dicas se precisar.'}
        </p>
      </div>

      {submitted && (
        <div className="bg-green-900/20 border border-green-700 rounded-xl p-4 text-center">
          <p className="text-green-300 font-semibold">Desafio submetido! Redirecionando para o quiz...</p>
        </div>
      )}

      <CodePlayground
        files={currentFiles}
        height={620}
      />

      {!submitted && (
        <PlaygroundToolbar
          hints={data.hints}
          hintsUsed={hintsUsed}
          onUseHint={handleUseHint}
          onSubmit={handleSubmit}
          onShowSolution={() => setShowSolution(prev => !prev)}
          isSubmitted={submitted}
        />
      )}
    </div>
  )
}
