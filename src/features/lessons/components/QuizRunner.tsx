import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useLesson, getLessonSteps } from '../hooks/useLesson'
import { useLessonActions } from '../hooks/useLessonProgress'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/cn'

// We enumerate quiz imports just like MDX
const QUIZ_IMPORTS: Record<string, () => Promise<{ default: unknown }>> = {
  'day-01': () => import('@/content/day-01-render-cycle/quiz.json'),
  'day-02': () => import('@/content/day-02-reconciliation/quiz.json'),
  'day-03': () => import('@/content/day-03-virtual-dom/quiz.json'),
  'day-04': () => import('@/content/day-04-state-vs-ref/quiz.json'),
  'day-05': () => import('@/content/day-05-controlled-uncontrolled/quiz.json'),
  'day-06': () => import('@/content/day-06-composition-pattern/quiz.json'),
  'day-07': () => import('@/content/day-07-render-props-hoc/quiz.json'),
  'day-08': () => import('@/content/day-08-usememo/quiz.json'),
  'day-09': () => import('@/content/day-09-usecallback/quiz.json'),
  'day-10': () => import('@/content/day-10-useref-profundidade/quiz.json'),
  'day-11': () => import('@/content/day-11-custom-hooks/quiz.json'),
  'day-12': () => import('@/content/day-12-usereducer/quiz.json'),
  'day-13': () => import('@/content/day-13-context-performance/quiz.json'),
  'day-14': () => import('@/content/day-14-uselayouteffect-vs-useeffect/quiz.json'),
  'day-15': () => import('@/content/day-15-feature-based-architecture/quiz.json'),
  'day-16': () => import('@/content/day-16-compound-components/quiz.json'),
  'day-17': () => import('@/content/day-17-headless-components/quiz.json'),
  'day-18': () => import('@/content/day-18-state-machines/quiz.json'),
  'day-19': () => import('@/content/day-19-global-state/quiz.json'),
  'day-20': () => import('@/content/day-20-server-state/quiz.json'),
  'day-21': () => import('@/content/day-21-error-boundaries/quiz.json'),
  'day-22': () => import('@/content/day-22-react-memo/quiz.json'),
  'day-23': () => import('@/content/day-23-lazy-loading/quiz.json'),
  'day-24': () => import('@/content/day-24-suspense/quiz.json'),
  'day-25': () => import('@/content/day-25-concurrent-features/quiz.json'),
  'day-26': () => import('@/content/day-26-tanstack-query/quiz.json'),
  'day-27': () => import('@/content/day-27-testing/quiz.json'),
  'day-28': () => import('@/content/day-28-accessibility/quiz.json'),
  'day-29': () => import('@/content/day-29-design-patterns/quiz.json'),
  'day-30': () => import('@/content/day-30-projeto-final/quiz.json'),
}

interface QuizQuestion {
  id: string
  type: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizData {
  lessonId: string
  passingScore: number
  questions: QuizQuestion[]
}

function useQuizData(dayId: string) {
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const importer = QUIZ_IMPORTS[dayId]
    if (!importer) { setIsLoading(false); return }
    importer().then(m => {
      setQuiz(m.default as QuizData)
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [dayId])

  return { quiz, isLoading }
}

export function QuizRunner() {
  const { dayId } = useParams<{ dayId: string }>()
  const navigate = useNavigate()
  const lesson = useLesson(dayId ?? '')
  const { submitQuiz } = useLessonActions(dayId ?? '')
  const { quiz, isLoading } = useQuizData(dayId ?? '')

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  if (isLoading) return <div className="text-gray-500 animate-pulse">Carregando quiz...</div>

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Quiz não disponível para este dia.</p>
        <Button className="mt-6" onClick={() => navigate(`/day/${dayId}/complete`)}>
          Continuar →
        </Button>
      </div>
    )
  }

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const handleSubmit = async () => {
    const correct = quiz.questions.filter(q => answers[q.id] === q.correctAnswer).length
    const scoreValue = Math.round((correct / quiz.questions.length) * 100)
    setScore(scoreValue)
    setSubmitted(true)
    await submitQuiz(scoreValue)
  }

  const handleNext = () => {
    if (!lesson) return
    void getLessonSteps(lesson)
    navigate(`/day/${dayId}/complete`)
  }

  const passed = score !== null && score >= quiz.passingScore
  const allAnswered = quiz.questions.every(q => answers[q.id] !== undefined)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Quiz — {lesson?.title}</h2>
        <p className="text-gray-400 text-sm">Responda todas as perguntas. Nota mínima: {quiz.passingScore}%</p>
      </div>

      {quiz.questions.map((question, qi) => {
        const userAnswer = answers[question.id]
        const isCorrect = submitted && userAnswer === question.correctAnswer

        return (
          <div key={question.id} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <p className="text-white font-medium mb-4">
              <span className="text-gray-500 text-sm mr-2">{qi + 1}.</span>
              {question.question}
            </p>

            <div className="space-y-2">
              {question.options.map((option, oi) => {
                const isSelected = userAnswer === oi
                const isCorrectOption = submitted && oi === question.correctAnswer

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(question.id, oi)}
                    disabled={submitted}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors',
                      !submitted && !isSelected && 'border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800',
                      !submitted && isSelected && 'border-blue-600 bg-blue-900/30 text-blue-200',
                      submitted && isCorrectOption && 'border-green-600 bg-green-900/30 text-green-200',
                      submitted && isSelected && !isCorrectOption && 'border-red-600 bg-red-900/30 text-red-200',
                      submitted && !isSelected && !isCorrectOption && 'border-gray-800 text-gray-500',
                    )}
                  >
                    <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>
                    {option}
                  </button>
                )
              })}
            </div>

            {submitted && (
              <div className={cn(
                'mt-4 p-3 rounded-lg text-sm',
                isCorrect ? 'bg-green-900/20 text-green-300' : 'bg-amber-900/20 text-amber-300'
              )}>
                <span className="font-semibold mr-1">{isCorrect ? '✓ Correto.' : '✗ Incorreto.'}</span>
                {question.explanation}
              </div>
            )}
          </div>
        )
      })}

      {!submitted ? (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!allAnswered} size="lg">
            Submeter Quiz
          </Button>
        </div>
      ) : (
        <div className={cn(
          'rounded-xl border p-6 text-center',
          passed ? 'border-green-700 bg-green-900/20' : 'border-amber-700 bg-amber-900/20'
        )}>
          <div className="text-4xl font-bold mb-2" style={{ color: passed ? '#86efac' : '#fcd34d' }}>
            {score}%
          </div>
          <p className={cn('text-sm mb-4', passed ? 'text-green-300' : 'text-amber-300')}>
            {passed ? 'Parabéns! Você passou.' : 'Continue estudando. Tente novamente!'}
          </p>
          {passed ? (
            <Button onClick={handleNext} size="lg">Próximo →</Button>
          ) : (
            <Button onClick={() => { setSubmitted(false); setAnswers({}) }} variant="secondary">
              Tentar Novamente
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
