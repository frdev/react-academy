import { useParams, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useLesson, getLessonSteps } from '../hooks/useLesson'
import { useLessonActions } from '../hooks/useLessonProgress'
import { Button, cn } from '@academy/ui'

// Vite requires static import() paths — enumerate per stack
const MDX_IMPORTS: Record<string, Record<string, () => Promise<{ default: React.ComponentType }>>> = {
  react: {
    'day-01': () => import('@/content/react/day-01-render-cycle/theory.mdx'),
    'day-02': () => import('@/content/react/day-02-reconciliation/theory.mdx'),
    'day-03': () => import('@/content/react/day-03-virtual-dom/theory.mdx'),
    'day-04': () => import('@/content/react/day-04-state-vs-ref/theory.mdx'),
    'day-05': () => import('@/content/react/day-05-controlled-uncontrolled/theory.mdx'),
    'day-06': () => import('@/content/react/day-06-composition-pattern/theory.mdx'),
    'day-07': () => import('@/content/react/day-07-render-props-hoc/theory.mdx'),
    'day-08': () => import('@/content/react/day-08-usememo/theory.mdx'),
    'day-09': () => import('@/content/react/day-09-usecallback/theory.mdx'),
    'day-10': () => import('@/content/react/day-10-useref-profundidade/theory.mdx'),
    'day-11': () => import('@/content/react/day-11-custom-hooks/theory.mdx'),
    'day-12': () => import('@/content/react/day-12-usereducer/theory.mdx'),
    'day-13': () => import('@/content/react/day-13-context-performance/theory.mdx'),
    'day-14': () => import('@/content/react/day-14-uselayouteffect-vs-useeffect/theory.mdx'),
    'day-15': () => import('@/content/react/day-15-feature-based-architecture/theory.mdx'),
    'day-16': () => import('@/content/react/day-16-compound-components/theory.mdx'),
    'day-17': () => import('@/content/react/day-17-headless-components/theory.mdx'),
    'day-18': () => import('@/content/react/day-18-state-machines/theory.mdx'),
    'day-19': () => import('@/content/react/day-19-global-state/theory.mdx'),
    'day-20': () => import('@/content/react/day-20-server-state/theory.mdx'),
    'day-21': () => import('@/content/react/day-21-error-boundaries/theory.mdx'),
    'day-22': () => import('@/content/react/day-22-react-memo/theory.mdx'),
    'day-23': () => import('@/content/react/day-23-lazy-loading/theory.mdx'),
    'day-24': () => import('@/content/react/day-24-suspense/theory.mdx'),
    'day-25': () => import('@/content/react/day-25-concurrent-features/theory.mdx'),
    'day-26': () => import('@/content/react/day-26-tanstack-query/theory.mdx'),
    'day-27': () => import('@/content/react/day-27-testing/theory.mdx'),
    'day-28': () => import('@/content/react/day-28-accessibility/theory.mdx'),
    'day-29': () => import('@/content/react/day-29-design-patterns/theory.mdx'),
    'day-30': () => import('@/content/react/day-30-projeto-final/theory.mdx'),
  },
  javascript: {
    'day-01': () => import('@/content/javascript/day-01-types-coercion/theory.mdx'),
    'day-02': () => import('@/content/javascript/day-02-scope-closures/theory.mdx'),
    'day-03': () => import('@/content/javascript/day-03-functions/theory.mdx'),
    'day-04': () => import('@/content/javascript/day-04-this-keyword/theory.mdx'),
    'day-05': () => import('@/content/javascript/day-05-prototype-chain/theory.mdx'),
    'day-06': () => import('@/content/javascript/day-06-event-loop/theory.mdx'),
    'day-07': () => import('@/content/javascript/day-07-promises-async-await/theory.mdx'),
    'day-08': () => import('@/content/javascript/day-08-iterators-generators/theory.mdx'),
    'day-09': () => import('@/content/javascript/day-09-async-generators/theory.mdx'),
    'day-10': () => import('@/content/javascript/day-10-classes-inheritance/theory.mdx'),
    'day-11': () => import('@/content/javascript/day-11-modules/theory.mdx'),
    'day-12': () => import('@/content/javascript/day-12-destructuring-patterns/theory.mdx'),
    'day-13': () => import('@/content/javascript/day-13-error-handling/theory.mdx'),
    'day-14': () => import('@/content/javascript/day-14-weakmap-weakref/theory.mdx'),
    'day-15': () => import('@/content/javascript/day-15-symbols/theory.mdx'),
    'day-16': () => import('@/content/javascript/day-16-proxy-reflect/theory.mdx'),
    'day-17': () => import('@/content/javascript/day-17-functional-programming/theory.mdx'),
    'day-18': () => import('@/content/javascript/day-18-design-patterns/theory.mdx'),
    'day-19': () => import('@/content/javascript/day-19-memory-management/theory.mdx'),
    'day-20': () => import('@/content/javascript/day-20-workers-concurrency/theory.mdx'),
    'day-21': () => import('@/content/javascript/day-21-security/theory.mdx'),
    'day-22': () => import('@/content/javascript/day-22-ast-code-transformation/theory.mdx'),
    'day-23': () => import('@/content/javascript/day-23-v8-internals-compilation/theory.mdx'),
    'day-24': () => import('@/content/javascript/day-24-v8-hidden-classes/theory.mdx'),
    'day-25': () => import('@/content/javascript/day-25-advanced-async-patterns/theory.mdx'),
    'day-26': () => import('@/content/javascript/day-26-decorators/theory.mdx'),
    'day-27': () => import('@/content/javascript/day-27-temporal-i18n/theory.mdx'),
    'day-28': () => import('@/content/javascript/day-28-advanced-testing/theory.mdx'),
    'day-29': () => import('@/content/javascript/day-29-observability/theory.mdx'),
    'day-30': () => import('@/content/javascript/day-30-projeto-final-framework/theory.mdx'),
  },
  typescript: {
    'day-01': () => import('@/content/typescript/day-01-type-system/theory.mdx'),
    'day-02': () => import('@/content/typescript/day-02-interfaces-type-aliases/theory.mdx'),
    'day-03': () => import('@/content/typescript/day-03-functions/theory.mdx'),
    'day-04': () => import('@/content/typescript/day-04-generics/theory.mdx'),
    'day-05': () => import('@/content/typescript/day-05-literal-types/theory.mdx'),
    'day-06': () => import('@/content/typescript/day-06-classes/theory.mdx'),
    'day-07': () => import('@/content/typescript/day-07-modules-declarations/theory.mdx'),
    'day-08': () => import('@/content/typescript/day-08-narrowing/theory.mdx'),
    'day-09': () => import('@/content/typescript/day-09-discriminated-unions/theory.mdx'),
    'day-10': () => import('@/content/typescript/day-10-utility-types-1/theory.mdx'),
    'day-11': () => import('@/content/typescript/day-11-mapped-types/theory.mdx'),
    'day-12': () => import('@/content/typescript/day-12-template-literal-types/theory.mdx'),
    'day-13': () => import('@/content/typescript/day-13-index-types/theory.mdx'),
    'day-14': () => import('@/content/typescript/day-14-intersection-types/theory.mdx'),
    'day-15': () => import('@/content/typescript/day-15-conditional-types/theory.mdx'),
    'day-16': () => import('@/content/typescript/day-16-infer/theory.mdx'),
    'day-17': () => import('@/content/typescript/day-17-recursive-types/theory.mdx'),
    'day-18': () => import('@/content/typescript/day-18-template-literal-advanced/theory.mdx'),
    'day-19': () => import('@/content/typescript/day-19-variance/theory.mdx'),
    'day-20': () => import('@/content/typescript/day-20-higher-kinded-types/theory.mdx'),
    'day-21': () => import('@/content/typescript/day-21-type-system-internals/theory.mdx'),
    'day-22': () => import('@/content/typescript/day-22-tsconfig/theory.mdx'),
    'day-23': () => import('@/content/typescript/day-23-declaration-files/theory.mdx'),
    'day-24': () => import('@/content/typescript/day-24-branded-types/theory.mdx'),
    'day-25': () => import('@/content/typescript/day-25-satisfies-noinfer/theory.mdx'),
    'day-26': () => import('@/content/typescript/day-26-assertion-functions/theory.mdx'),
    'day-27': () => import('@/content/typescript/day-27-decorators/theory.mdx'),
    'day-28': () => import('@/content/typescript/day-28-compiler-api/theory.mdx'),
    'day-29': () => import('@/content/typescript/day-29-type-checker-performance/theory.mdx'),
    'day-30': () => import('@/content/typescript/day-30-projeto-final-query-builder/theory.mdx'),
  },
  algorithms: {
    'day-01': () => import('@/content/algorithms/day-01-big-o-complexidade/theory.mdx'),
    'day-02': () => import('@/content/algorithms/day-02-arrays-two-pointers/theory.mdx'),
    'day-03': () => import('@/content/algorithms/day-03-hash-maps-sets/theory.mdx'),
    'day-04': () => import('@/content/algorithms/day-04-recursao/theory.mdx'),
    'day-05': () => import('@/content/algorithms/day-05-busca-binaria/theory.mdx'),
    'day-06': () => import('@/content/algorithms/day-06-linked-lists/theory.mdx'),
    'day-07': () => import('@/content/algorithms/day-07-stacks-queues/theory.mdx'),
    'day-08': () => import('@/content/algorithms/day-08-sorting-merge-quick/theory.mdx'),
    'day-09': () => import('@/content/algorithms/day-09-arvores-bst/theory.mdx'),
    'day-10': () => import('@/content/algorithms/day-10-heaps-priority-queue/theory.mdx'),
    'day-11': () => import('@/content/algorithms/day-11-grafos-bfs/theory.mdx'),
    'day-12': () => import('@/content/algorithms/day-12-grafos-dfs/theory.mdx'),
    'day-13': () => import('@/content/algorithms/day-13-backtracking/theory.mdx'),
    'day-14': () => import('@/content/algorithms/day-14-programacao-dinamica/theory.mdx'),
  },
  ai: {
    'day-01': () => import('@/content/ai/day-01-intro-ai-moderna/theory.mdx'),
    'day-02': () => import('@/content/ai/day-02-anthropic-api-sdk/theory.mdx'),
    'day-03': () => import('@/content/ai/day-03-prompt-context-engineering/theory.mdx'),
    'day-04': () => import('@/content/ai/day-04-tool-use/theory.mdx'),
    'day-05': () => import('@/content/ai/day-05-rag-embeddings/theory.mdx'),
    'day-06': () => import('@/content/ai/day-06-mcp-conceito/theory.mdx'),
    'day-07': () => import('@/content/ai/day-07-mcp-server/theory.mdx'),
    'day-08': () => import('@/content/ai/day-08-skills/theory.mdx'),
    'day-09': () => import('@/content/ai/day-09-agents-loop/theory.mdx'),
    'day-10': () => import('@/content/ai/day-10-memoria-estado/theory.mdx'),
    'day-11': () => import('@/content/ai/day-11-agent-sdk/theory.mdx'),
    'day-12': () => import('@/content/ai/day-12-multi-agentes/theory.mdx'),
    'day-13': () => import('@/content/ai/day-13-eval-observabilidade-guardrails/theory.mdx'),
    'day-14': () => import('@/content/ai/day-14-projeto-final-sistema-agentico/theory.mdx'),
  },
  css: {
    'day-01': () => import('@/content/css/day-01-layout-intrinseco/theory.mdx'),
    'day-02': () => import('@/content/css/day-02-subgrid-masonry/theory.mdx'),
    'day-03': () => import('@/content/css/day-03-container-queries/theory.mdx'),
    'day-04': () => import('@/content/css/day-04-propriedades-logicas/theory.mdx'),
    'day-05': () => import('@/content/css/day-05-custom-properties-at-property/theory.mdx'),
    'day-06': () => import('@/content/css/day-06-cascade-layers/theory.mdx'),
    'day-07': () => import('@/content/css/day-07-has-is-where/theory.mdx'),
    'day-08': () => import('@/content/css/day-08-cor-moderna/theory.mdx'),
    'day-09': () => import('@/content/css/day-09-tipografia-fluida/theory.mdx'),
    'day-10': () => import('@/content/css/day-10-nesting-scope/theory.mdx'),
    'day-11': () => import('@/content/css/day-11-ui-moderna/theory.mdx'),
    'day-12': () => import('@/content/css/day-12-scroll-driven-animations/theory.mdx'),
    'day-13': () => import('@/content/css/day-13-view-transitions/theory.mdx'),
    'day-14': () => import('@/content/css/day-14-projeto-final-design-system/theory.mdx'),
  },
  html: {
    'day-01': () => import('@/content/html/day-01-anatomia-do-documento/theory.mdx'),
    'day-02': () => import('@/content/html/day-02-tags-semanticas-landmarks/theory.mdx'),
    'day-03': () => import('@/content/html/day-03-texto-listas-links/theory.mdx'),
    'day-04': () => import('@/content/html/day-04-imagens-midia-acessivel/theory.mdx'),
    'day-05': () => import('@/content/html/day-05-formularios-validacao/theory.mdx'),
    'day-06': () => import('@/content/html/day-06-aria-quando-necessario/theory.mdx'),
    'day-07': () => import('@/content/html/day-07-teclado-wcag/theory.mdx'),
  },
  regex: {
    'day-01': () => import('@/content/regex/day-01-o-que-e-por-que/theory.mdx'),
    'day-02': () => import('@/content/regex/day-02-regex-na-pratica/theory.mdx'),
    'day-03': () => import('@/content/regex/day-03-boas-praticas-cheatsheet/theory.mdx'),
  },
  'package-managers': {
    'day-01': () => import('@/content/package-managers/day-01-o-que-e/theory.mdx'),
    'day-02': () => import('@/content/package-managers/day-02-npm-na-pratica/theory.mdx'),
    'day-03': () => import('@/content/package-managers/day-03-npm-yarn-pnpm/theory.mdx'),
  },
  'git': {
    'day-01': () => import('@/content/git/day-01-historico-local/theory.mdx'),
    'day-02': () => import('@/content/git/day-02-branches-merge-rebase/theory.mdx'),
    'day-03': () => import('@/content/git/day-03-remotes-prs-conflitos/theory.mdx'),
  },
  'frontend-architecture': {
    'day-01': () => import('@/content/frontend-architecture/day-01-codigo-limpo/theory.mdx'),
    'day-02': () => import('@/content/frontend-architecture/day-02-componentizacao-e-estado/theory.mdx'),
    'day-03': () => import('@/content/frontend-architecture/day-03-arquitetura-por-feature/theory.mdx'),
  },
  'typescript-essentials': {
    'day-01': () => import('@/content/typescript-essentials/day-01-tipos-e-inferencia/theory.mdx'),
    'day-02': () => import('@/content/typescript-essentials/day-02-interfaces-e-narrowing/theory.mdx'),
    'day-03': () => import('@/content/typescript-essentials/day-03-generics-e-utility-types/theory.mdx'),
  },
  'css-essentials': {
    'day-01': () => import('@/content/css-essentials/day-01-seletores-cascata-especificidade/theory.mdx'),
    'day-02': () => import('@/content/css-essentials/day-02-box-model-display-position/theory.mdx'),
    'day-03': () => import('@/content/css-essentials/day-03-valores-unidades-cores-tipografia/theory.mdx'),
    'day-04': () => import('@/content/css-essentials/day-04-flexbox/theory.mdx'),
    'day-05': () => import('@/content/css-essentials/day-05-grid/theory.mdx'),
    'day-06': () => import('@/content/css-essentials/day-06-responsividade/theory.mdx'),
    'day-07': () => import('@/content/css-essentials/day-07-projeto-final-landing/theory.mdx'),
  },
}

// Prose styles for MDX content
const proseClasses = [
  'prose prose-invert max-w-none',
  'prose-headings:text-white prose-headings:font-semibold',
  'prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg',
  'prose-p:text-gray-300 prose-p:leading-relaxed',
  '[&_:not(pre)>code]:text-blue-300 [&_:not(pre)>code]:bg-gray-800 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-mono',
  '[&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:border-0',
  '[&_pre>code]:!bg-transparent [&_pre>code]:text-inherit',
  '[&_[data-rehype-pretty-code-figure]]:rounded-xl [&_[data-rehype-pretty-code-figure]]:overflow-hidden [&_[data-rehype-pretty-code-figure]]:border [&_[data-rehype-pretty-code-figure]]:border-gray-700 [&_[data-rehype-pretty-code-figure]]:my-6',
  '[&_[data-rehype-pretty-code-figure]_pre]:!p-5 [&_[data-rehype-pretty-code-figure]_pre]:overflow-x-auto',
  'prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-300 prose-blockquote:bg-blue-900/20 prose-blockquote:rounded-r-lg prose-blockquote:px-4',
  'prose-strong:text-white',
  'prose-li:text-gray-300',
].join(' ')

export function TheoryReader() {
  const { stackId = 'react', dayId } = useParams<{ stackId: string; dayId: string }>()
  const navigate = useNavigate()
  const lesson = useLesson(dayId ?? '', stackId)
  const { markTheoryRead } = useLessonActions(dayId ?? '')
  const [MdxContent, setMdxContent] = useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!dayId) return
    setMdxContent(null)
    setNotFound(false)
    setIsLoading(true)
    const importer = MDX_IMPORTS[stackId]?.[dayId]
    if (!importer) {
      setNotFound(true)
      setIsLoading(false)
      return
    }
    importer()
      .then(module => {
        setMdxContent(() => module.default)
        setIsLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setIsLoading(false)
      })
  }, [stackId, dayId])

  const handleComplete = async () => {
    await markTheoryRead()
    if (!lesson) return
    const steps = getLessonSteps(lesson)
    const nextStep = steps[1]
    navigate(`/${stackId}/day/${dayId}/${nextStep}`)
  }

  if (isLoading) {
    return <div className="text-gray-500 animate-pulse">Carregando teoria...</div>
  }

  if (notFound || !MdxContent) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-2">Conteúdo ainda não disponível</p>
        <p className="text-gray-600 text-sm">Este dia será liberado em breve.</p>
        <Button className="mt-6" onClick={() => navigate(`/${stackId}`)}>← Voltar ao início</Button>
      </div>
    )
  }

  return (
    <div>
      <article className={cn(proseClasses, 'mb-12')}>
        <MdxContent />
      </article>

      <div className="border-t border-gray-800 pt-6 flex justify-end">
        <Button onClick={handleComplete} size="lg">
          Concluir Teoria →
        </Button>
      </div>
    </div>
  )
}
