import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useLesson, getLessonSteps } from '../hooks/useLesson'
import { useLessonActions } from '../hooks/useLessonProgress'
import { Button, cn } from '@academy/ui'

const QUIZ_IMPORTS: Record<string, Record<string, () => Promise<{ default: unknown }>>> = {
  react: {
    'day-01': () => import('@/content/react/day-01-render-cycle/quiz.json'),
    'day-02': () => import('@/content/react/day-02-reconciliation/quiz.json'),
    'day-03': () => import('@/content/react/day-03-virtual-dom/quiz.json'),
    'day-04': () => import('@/content/react/day-04-state-vs-ref/quiz.json'),
    'day-05': () => import('@/content/react/day-05-controlled-uncontrolled/quiz.json'),
    'day-06': () => import('@/content/react/day-06-composition-pattern/quiz.json'),
    'day-07': () => import('@/content/react/day-07-render-props-hoc/quiz.json'),
    'day-08': () => import('@/content/react/day-08-usememo/quiz.json'),
    'day-09': () => import('@/content/react/day-09-usecallback/quiz.json'),
    'day-10': () => import('@/content/react/day-10-useref-profundidade/quiz.json'),
    'day-11': () => import('@/content/react/day-11-custom-hooks/quiz.json'),
    'day-12': () => import('@/content/react/day-12-usereducer/quiz.json'),
    'day-13': () => import('@/content/react/day-13-context-performance/quiz.json'),
    'day-14': () => import('@/content/react/day-14-uselayouteffect-vs-useeffect/quiz.json'),
    'day-15': () => import('@/content/react/day-15-feature-based-architecture/quiz.json'),
    'day-16': () => import('@/content/react/day-16-compound-components/quiz.json'),
    'day-17': () => import('@/content/react/day-17-headless-components/quiz.json'),
    'day-18': () => import('@/content/react/day-18-state-machines/quiz.json'),
    'day-19': () => import('@/content/react/day-19-global-state/quiz.json'),
    'day-20': () => import('@/content/react/day-20-server-state/quiz.json'),
    'day-21': () => import('@/content/react/day-21-error-boundaries/quiz.json'),
    'day-22': () => import('@/content/react/day-22-react-memo/quiz.json'),
    'day-23': () => import('@/content/react/day-23-lazy-loading/quiz.json'),
    'day-24': () => import('@/content/react/day-24-suspense/quiz.json'),
    'day-25': () => import('@/content/react/day-25-concurrent-features/quiz.json'),
    'day-26': () => import('@/content/react/day-26-tanstack-query/quiz.json'),
    'day-27': () => import('@/content/react/day-27-testing/quiz.json'),
    'day-28': () => import('@/content/react/day-28-accessibility/quiz.json'),
    'day-29': () => import('@/content/react/day-29-design-patterns/quiz.json'),
    'day-30': () => import('@/content/react/day-30-projeto-final/quiz.json'),
  },
  javascript: {
    'day-01': () => import('@/content/javascript/day-01-types-coercion/quiz.json'),
    'day-02': () => import('@/content/javascript/day-02-scope-closures/quiz.json'),
    'day-03': () => import('@/content/javascript/day-03-functions/quiz.json'),
    'day-04': () => import('@/content/javascript/day-04-this-keyword/quiz.json'),
    'day-05': () => import('@/content/javascript/day-05-prototype-chain/quiz.json'),
    'day-06': () => import('@/content/javascript/day-06-event-loop/quiz.json'),
    'day-07': () => import('@/content/javascript/day-07-promises-async-await/quiz.json'),
    'day-08': () => import('@/content/javascript/day-08-iterators-generators/quiz.json'),
    'day-09': () => import('@/content/javascript/day-09-async-generators/quiz.json'),
    'day-10': () => import('@/content/javascript/day-10-classes-inheritance/quiz.json'),
    'day-11': () => import('@/content/javascript/day-11-modules/quiz.json'),
    'day-12': () => import('@/content/javascript/day-12-destructuring-patterns/quiz.json'),
    'day-13': () => import('@/content/javascript/day-13-error-handling/quiz.json'),
    'day-14': () => import('@/content/javascript/day-14-weakmap-weakref/quiz.json'),
    'day-15': () => import('@/content/javascript/day-15-symbols/quiz.json'),
    'day-16': () => import('@/content/javascript/day-16-proxy-reflect/quiz.json'),
    'day-17': () => import('@/content/javascript/day-17-functional-programming/quiz.json'),
    'day-18': () => import('@/content/javascript/day-18-design-patterns/quiz.json'),
    'day-19': () => import('@/content/javascript/day-19-memory-management/quiz.json'),
    'day-20': () => import('@/content/javascript/day-20-workers-concurrency/quiz.json'),
    'day-21': () => import('@/content/javascript/day-21-security/quiz.json'),
    'day-22': () => import('@/content/javascript/day-22-ast-code-transformation/quiz.json'),
    'day-23': () => import('@/content/javascript/day-23-v8-internals-compilation/quiz.json'),
    'day-24': () => import('@/content/javascript/day-24-v8-hidden-classes/quiz.json'),
    'day-25': () => import('@/content/javascript/day-25-advanced-async-patterns/quiz.json'),
    'day-26': () => import('@/content/javascript/day-26-decorators/quiz.json'),
    'day-27': () => import('@/content/javascript/day-27-temporal-i18n/quiz.json'),
    'day-28': () => import('@/content/javascript/day-28-advanced-testing/quiz.json'),
    'day-29': () => import('@/content/javascript/day-29-observability/quiz.json'),
    'day-30': () => import('@/content/javascript/day-30-projeto-final-framework/quiz.json'),
  },
  typescript: {
    'day-01': () => import('@/content/typescript/day-01-type-system/quiz.json'),
    'day-02': () => import('@/content/typescript/day-02-interfaces-type-aliases/quiz.json'),
    'day-03': () => import('@/content/typescript/day-03-functions/quiz.json'),
    'day-04': () => import('@/content/typescript/day-04-generics/quiz.json'),
    'day-05': () => import('@/content/typescript/day-05-literal-types/quiz.json'),
    'day-06': () => import('@/content/typescript/day-06-classes/quiz.json'),
    'day-07': () => import('@/content/typescript/day-07-modules-declarations/quiz.json'),
    'day-08': () => import('@/content/typescript/day-08-narrowing/quiz.json'),
    'day-09': () => import('@/content/typescript/day-09-discriminated-unions/quiz.json'),
    'day-10': () => import('@/content/typescript/day-10-utility-types-1/quiz.json'),
    'day-11': () => import('@/content/typescript/day-11-mapped-types/quiz.json'),
    'day-12': () => import('@/content/typescript/day-12-template-literal-types/quiz.json'),
    'day-13': () => import('@/content/typescript/day-13-index-types/quiz.json'),
    'day-14': () => import('@/content/typescript/day-14-intersection-types/quiz.json'),
    'day-15': () => import('@/content/typescript/day-15-conditional-types/quiz.json'),
    'day-16': () => import('@/content/typescript/day-16-infer/quiz.json'),
    'day-17': () => import('@/content/typescript/day-17-recursive-types/quiz.json'),
    'day-18': () => import('@/content/typescript/day-18-template-literal-advanced/quiz.json'),
    'day-19': () => import('@/content/typescript/day-19-variance/quiz.json'),
    'day-20': () => import('@/content/typescript/day-20-higher-kinded-types/quiz.json'),
    'day-21': () => import('@/content/typescript/day-21-type-system-internals/quiz.json'),
    'day-22': () => import('@/content/typescript/day-22-tsconfig/quiz.json'),
    'day-23': () => import('@/content/typescript/day-23-declaration-files/quiz.json'),
    'day-24': () => import('@/content/typescript/day-24-branded-types/quiz.json'),
    'day-25': () => import('@/content/typescript/day-25-satisfies-noinfer/quiz.json'),
    'day-26': () => import('@/content/typescript/day-26-assertion-functions/quiz.json'),
    'day-27': () => import('@/content/typescript/day-27-decorators/quiz.json'),
    'day-28': () => import('@/content/typescript/day-28-compiler-api/quiz.json'),
    'day-29': () => import('@/content/typescript/day-29-type-checker-performance/quiz.json'),
    'day-30': () => import('@/content/typescript/day-30-projeto-final-query-builder/quiz.json'),
  },
  algorithms: {
    'day-01': () => import('@/content/algorithms/day-01-big-o-complexidade/quiz.json'),
    'day-02': () => import('@/content/algorithms/day-02-arrays-two-pointers/quiz.json'),
    'day-03': () => import('@/content/algorithms/day-03-hash-maps-sets/quiz.json'),
    'day-04': () => import('@/content/algorithms/day-04-recursao/quiz.json'),
    'day-05': () => import('@/content/algorithms/day-05-busca-binaria/quiz.json'),
    'day-06': () => import('@/content/algorithms/day-06-linked-lists/quiz.json'),
    'day-07': () => import('@/content/algorithms/day-07-stacks-queues/quiz.json'),
    'day-08': () => import('@/content/algorithms/day-08-sorting-merge-quick/quiz.json'),
    'day-09': () => import('@/content/algorithms/day-09-arvores-bst/quiz.json'),
    'day-10': () => import('@/content/algorithms/day-10-heaps-priority-queue/quiz.json'),
    'day-11': () => import('@/content/algorithms/day-11-grafos-bfs/quiz.json'),
    'day-12': () => import('@/content/algorithms/day-12-grafos-dfs/quiz.json'),
    'day-13': () => import('@/content/algorithms/day-13-backtracking/quiz.json'),
    'day-14': () => import('@/content/algorithms/day-14-programacao-dinamica/quiz.json'),
  },
  ai: {
    'day-01': () => import('@/content/ai/day-01-intro-ai-moderna/quiz.json'),
    'day-02': () => import('@/content/ai/day-02-anthropic-api-sdk/quiz.json'),
    'day-03': () => import('@/content/ai/day-03-prompt-context-engineering/quiz.json'),
    'day-04': () => import('@/content/ai/day-04-tool-use/quiz.json'),
    'day-05': () => import('@/content/ai/day-05-rag-embeddings/quiz.json'),
    'day-06': () => import('@/content/ai/day-06-mcp-conceito/quiz.json'),
    'day-07': () => import('@/content/ai/day-07-mcp-server/quiz.json'),
    'day-08': () => import('@/content/ai/day-08-skills/quiz.json'),
    'day-09': () => import('@/content/ai/day-09-agents-loop/quiz.json'),
    'day-10': () => import('@/content/ai/day-10-memoria-estado/quiz.json'),
    'day-11': () => import('@/content/ai/day-11-agent-sdk/quiz.json'),
    'day-12': () => import('@/content/ai/day-12-multi-agentes/quiz.json'),
    'day-13': () => import('@/content/ai/day-13-eval-observabilidade-guardrails/quiz.json'),
    'day-14': () => import('@/content/ai/day-14-projeto-final-sistema-agentico/quiz.json'),
  },
  css: {
    'day-01': () => import('@/content/css/day-01-layout-intrinseco/quiz.json'),
    'day-02': () => import('@/content/css/day-02-subgrid-masonry/quiz.json'),
    'day-03': () => import('@/content/css/day-03-container-queries/quiz.json'),
    'day-04': () => import('@/content/css/day-04-propriedades-logicas/quiz.json'),
    'day-05': () => import('@/content/css/day-05-custom-properties-at-property/quiz.json'),
    'day-06': () => import('@/content/css/day-06-cascade-layers/quiz.json'),
    'day-07': () => import('@/content/css/day-07-has-is-where/quiz.json'),
    'day-08': () => import('@/content/css/day-08-cor-moderna/quiz.json'),
    'day-09': () => import('@/content/css/day-09-tipografia-fluida/quiz.json'),
    'day-10': () => import('@/content/css/day-10-nesting-scope/quiz.json'),
    'day-11': () => import('@/content/css/day-11-ui-moderna/quiz.json'),
    'day-12': () => import('@/content/css/day-12-scroll-driven-animations/quiz.json'),
    'day-13': () => import('@/content/css/day-13-view-transitions/quiz.json'),
    'day-14': () => import('@/content/css/day-14-projeto-final-design-system/quiz.json'),
  },
  html: {
    'day-01': () => import('@/content/html/day-01-anatomia-do-documento/quiz.json'),
    'day-02': () => import('@/content/html/day-02-tags-semanticas-landmarks/quiz.json'),
    'day-03': () => import('@/content/html/day-03-texto-listas-links/quiz.json'),
    'day-04': () => import('@/content/html/day-04-imagens-midia-acessivel/quiz.json'),
    'day-05': () => import('@/content/html/day-05-formularios-validacao/quiz.json'),
    'day-06': () => import('@/content/html/day-06-aria-quando-necessario/quiz.json'),
    'day-07': () => import('@/content/html/day-07-teclado-wcag/quiz.json'),
  },
  regex: {
    'day-01': () => import('@/content/regex/day-01-o-que-e-por-que/quiz.json'),
    'day-02': () => import('@/content/regex/day-02-regex-na-pratica/quiz.json'),
    'day-03': () => import('@/content/regex/day-03-boas-praticas-cheatsheet/quiz.json'),
  },
  'package-managers': {
    'day-01': () => import('@/content/package-managers/day-01-o-que-e/quiz.json'),
    'day-02': () => import('@/content/package-managers/day-02-npm-na-pratica/quiz.json'),
    'day-03': () => import('@/content/package-managers/day-03-npm-yarn-pnpm/quiz.json'),
  },
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

function useQuizData(stackId: string, dayId: string) {
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setQuiz(null)
    setIsLoading(true)
    const importer = QUIZ_IMPORTS[stackId]?.[dayId]
    if (!importer) { setIsLoading(false); return }
    importer().then(m => {
      setQuiz(m.default as QuizData)
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [stackId, dayId])

  return { quiz, isLoading }
}

export function QuizRunner() {
  const { stackId = 'react', dayId } = useParams<{ stackId: string; dayId: string }>()
  const navigate = useNavigate()
  const lesson = useLesson(dayId ?? '', stackId)
  const { submitQuiz } = useLessonActions(dayId ?? '')
  const { quiz, isLoading } = useQuizData(stackId, dayId ?? '')

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  if (isLoading) return <div className="text-gray-500 animate-pulse">Carregando quiz...</div>

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Quiz não disponível para este dia.</p>
        <Button className="mt-6" onClick={() => navigate(`/${stackId}/day/${dayId}/complete`)}>
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
    navigate(`/${stackId}/day/${dayId}/complete`)
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
