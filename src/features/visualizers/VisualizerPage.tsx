import { useParams, useNavigate } from 'react-router'
import { lazy, Suspense, type ComponentType } from 'react'
import { useLesson, getLessonSteps } from '@/features/lessons/hooks/useLesson'
import { Button } from '@/shared/components/ui/Button'

// Map dayId → visualizer component (lazy loaded)
const VISUALIZER_MAP: Record<string, React.LazyExoticComponent<ComponentType>> = {
  'day-01': lazy(() => import('./RenderCycleViz').then(m => ({ default: m.RenderCycleViz }))),
  'day-02': lazy(() => import('./ReconciliationViz').then(m => ({ default: m.ReconciliationViz }))),
  'day-08': lazy(() => import('./MemoizationViz').then(m => ({ default: m.MemoizationViz }))),
  'day-13': lazy(() => import('./ContextUpdateViz').then(m => ({ default: m.ContextUpdateViz }))),
  // Future visualizers will be added here
}

export function VisualizerPage() {
  const { dayId } = useParams<{ dayId: string }>()
  const navigate = useNavigate()
  const lesson = useLesson(dayId ?? '')

  const VisualizerComponent = dayId ? VISUALIZER_MAP[dayId] : undefined

  const handleNext = () => {
    if (!lesson) return
    const steps = getLessonSteps(lesson)
    const currentIndex = steps.indexOf('visualizer')
    const nextStep = steps[currentIndex + 1]
    if (nextStep) navigate(`/day/${dayId}/${nextStep}`)
  }

  if (!VisualizerComponent) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-2">Visualizador não disponível</p>
        <p className="text-gray-600 text-sm mb-6">Este visualizador será adicionado em breve.</p>
        <Button onClick={handleNext}>Continuar →</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Visualizador — {lesson?.title}</h2>
        <p className="text-gray-400 text-sm">Interaja com o visualizador para entender o conceito na prática.</p>
      </div>

      <Suspense fallback={<div className="text-gray-500 animate-pulse">Carregando visualizador...</div>}>
        <VisualizerComponent />
      </Suspense>

      <div className="border-t border-gray-800 pt-6 flex justify-end">
        <Button onClick={handleNext} size="lg">
          Próxima Etapa →
        </Button>
      </div>
    </div>
  )
}
