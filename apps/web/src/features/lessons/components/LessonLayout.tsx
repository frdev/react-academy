import { useParams, Outlet, useLocation } from 'react-router'
import { useLesson, getLessonSteps, type LessonStep } from '../hooks/useLesson'
import { cn } from '@academy/ui'
import { Link } from 'react-router'

const STEP_LABELS: Record<LessonStep, string> = {
  theory: 'Teoria',
  visualizer: 'Visualizador',
  challenge: 'Desafio',
  quiz: 'Quiz',
  complete: 'Concluído',
}

interface StepperProps {
  steps: LessonStep[]
  currentStep: LessonStep
  dayId: string
}

function Stepper({ steps, currentStep }: StepperProps) {
  const currentIndex = steps.indexOf(currentStep)
  return (
    <nav className="flex items-center gap-1">
      {steps.map((step, index) => {
        const isDone = index < currentIndex
        const isCurrent = step === currentStep
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                isCurrent && 'bg-blue-600 text-white',
                isDone && 'bg-green-800 text-green-200',
                !isCurrent && !isDone && 'bg-gray-800 text-gray-500',
              )}
            >
              {STEP_LABELS[step]}
            </div>
            {index < steps.length - 1 && (
              <div className={cn('w-4 h-px', isDone ? 'bg-green-700' : 'bg-gray-700')} />
            )}
          </div>
        )
      })}
    </nav>
  )
}

export function LessonLayout() {
  const { stackId = 'react', dayId } = useParams<{ stackId: string; dayId: string }>()
  const location = useLocation()
  const lesson = useLesson(dayId ?? '', stackId)

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Lição não encontrada.</p>
      </div>
    )
  }

  const steps = getLessonSteps(lesson)
  const pathSegment = location.pathname.split('/').pop() as LessonStep
  const currentStep: LessonStep = steps.includes(pathSegment) ? pathSegment : 'theory'

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to={`/${stackId}`} className="text-gray-500 hover:text-gray-300 text-sm">← Dashboard</Link>
            <div className="h-4 w-px bg-gray-700" />
            <div>
              <span className="text-xs text-gray-500 font-mono">DIA {String(lesson.day).padStart(2, '0')}</span>
              <h1 className="text-sm font-semibold text-white leading-tight">{lesson.title}</h1>
            </div>
          </div>
          <Stepper steps={steps} currentStep={currentStep} dayId={dayId ?? ''} />
        </div>
      </header>

      {/* Content */}
      <main className={cn(
        'flex-1 w-full px-4 py-8',
        currentStep === 'challenge' ? 'max-w-none' : 'max-w-4xl mx-auto',
      )}>
        <Outlet />
      </main>
    </div>
  )
}
