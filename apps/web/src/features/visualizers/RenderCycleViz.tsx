import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, cn } from '@academy/ui'

const SPEED_OPTIONS = [
  { label: 'Rápido', ms: 900 },
  { label: 'Normal', ms: 2000 },
  { label: 'Devagar', ms: 5000 },
] as const

type Phase = 'idle' | 'trigger' | 'render' | 'commit' | 'paint' | 'done'

interface PhaseInfo {
  title: string
  description: string
  color: string
  bg: string
  border: string
}

const PHASE_INFO: Record<string, PhaseInfo> = {
  trigger: {
    title: '1. Trigger',
    description: 'Um setter de estado foi chamado. O React agenda um re-render colocando este componente na fila de trabalho do Scheduler.',
    color: 'text-blue-300',
    bg: 'bg-blue-900/40',
    border: 'border-blue-500',
  },
  render: {
    title: '2. Render',
    description: 'O React executa a função do componente. Hooks de leitura retornam seus valores atuais. O JSX produz novos React Elements que são comparados com o snapshot anterior pelo Reconciler.',
    color: 'text-purple-300',
    bg: 'bg-purple-900/40',
    border: 'border-purple-500',
  },
  commit: {
    title: '3. Commit',
    description: 'O React aplica no DOM real apenas as mudanças calculadas pelo Reconciler. Refs são atualizadas. useLayoutEffect executa sincronamente antes do paint.',
    color: 'text-green-300',
    bg: 'bg-green-900/40',
    border: 'border-green-500',
  },
  paint: {
    title: '4. Browser Paint',
    description: 'O navegador pinta os pixels na tela. Após o paint, o React executa os efeitos agendados pelo useEffect de forma assíncrona.',
    color: 'text-amber-300',
    bg: 'bg-amber-900/40',
    border: 'border-amber-500',
  },
  idle: { title: '', description: '', color: '', bg: '', border: '' },
  done: { title: '', description: '', color: '', bg: '', border: '' },
}

// ─── API highlight system ──────────────────────────────────────────────────

type ApiType = 'hook' | 'internal' | 'platform'

interface PhaseApi {
  name: string
  role: string
  type: ApiType
}

const ALL_APIS: PhaseApi[] = [
  // Hooks
  { name: 'useState',         type: 'hook',     role: 'dispara o ciclo' },
  { name: 'useReducer',       type: 'hook',     role: 'dispara o ciclo' },
  { name: 'useMemo',          type: 'hook',     role: 'recalcula se deps mudaram' },
  { name: 'useCallback',      type: 'hook',     role: 'recria se deps mudaram' },
  { name: 'useContext',       type: 'hook',     role: 'lê valor do contexto' },
  { name: 'useRef',           type: 'hook',     role: 'ref.current atualizado' },
  { name: 'useLayoutEffect',  type: 'hook',     role: 'executa sincronamente' },
  { name: 'useEffect',        type: 'hook',     role: 'executa após o paint' },
  // Internals
  { name: 'Scheduler',        type: 'internal', role: 'prioriza o trabalho' },
  { name: 'Reconciler',       type: 'internal', role: 'algoritmo de diffing' },
  { name: 'Fiber',            type: 'internal', role: 'unidade de trabalho' },
  { name: 'Virtual DOM',      type: 'internal', role: 'snapshot em memória' },
  // Platform
  { name: 'ReactDOM',         type: 'platform', role: 'aplica mudanças no DOM' },
  { name: 'Browser Paint',    type: 'platform', role: 'renderiza pixels' },
]

const PHASE_ACTIVE_APIS: Record<string, string[]> = {
  trigger:  ['useState', 'useReducer', 'Scheduler'],
  render:   ['useState', 'useReducer', 'useMemo', 'useCallback', 'useContext', 'Reconciler', 'Fiber', 'Virtual DOM'],
  commit:   ['useLayoutEffect', 'useRef', 'Fiber', 'ReactDOM'],
  paint:    ['useEffect', 'Browser Paint'],
  idle:     [],
  done:     [],
}

const TYPE_COLORS: Record<ApiType, { active: string; inactive: string; dot: string }> = {
  hook:     { active: 'bg-violet-900/60 border-violet-500 text-violet-200', inactive: 'bg-gray-800/40 border-gray-700 text-gray-600', dot: 'bg-violet-400' },
  internal: { active: 'bg-sky-900/60 border-sky-600 text-sky-200',         inactive: 'bg-gray-800/40 border-gray-700 text-gray-600', dot: 'bg-sky-400' },
  platform: { active: 'bg-amber-900/60 border-amber-600 text-amber-200',   inactive: 'bg-gray-800/40 border-gray-700 text-gray-600', dot: 'bg-amber-400' },
}

function ApiChip({ api, isActive }: { api: PhaseApi; isActive: boolean }) {
  const colors = TYPE_COLORS[api.type]
  return (
    <motion.div
      layout
      animate={{ opacity: isActive ? 1 : 0.35, scale: isActive ? 1.05 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      title={api.role}
      className={cn(
        'relative flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-mono transition-colors',
        isActive ? colors.active : colors.inactive,
      )}
    >
      {isActive && (
        <motion.div
          className={cn('absolute inset-0 rounded-md', colors.dot, 'opacity-10')}
          animate={{ opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', isActive ? colors.dot : 'bg-gray-600')} />
      <span className="relative z-10">{api.name}</span>
    </motion.div>
  )
}

interface PhaseBoxProps {
  label: string
  sublabel: string
  isActive: boolean
  isDone: boolean
  activeColor: string
  activeBg: string
  activeBorder: string
}

function PhaseBox({ label, sublabel, isActive, isDone, activeColor, activeBg, activeBorder }: PhaseBoxProps) {
  return (
    <motion.div
      animate={{
        scale: isActive ? 1.06 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative rounded-xl border-2 px-5 py-4 text-center min-w-[120px] transition-colors duration-300',
        isActive ? cn(activeBg, activeBorder) : isDone ? 'bg-gray-800/80 border-gray-600' : 'bg-gray-900 border-gray-700',
      )}
    >
      {isActive && (
        <motion.div
          className={cn('absolute inset-0 rounded-xl opacity-30', activeBg)}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      <div className={cn(
        'text-sm font-semibold relative z-10',
        isActive ? activeColor : isDone ? 'text-gray-300' : 'text-gray-500'
      )}>
        {label}
      </div>
      <div className={cn('text-xs mt-0.5 relative z-10', isActive ? 'text-gray-300' : 'text-gray-600')}>
        {sublabel}
      </div>
      {isDone && !isActive && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </motion.div>
  )
}

function Arrow({ isActive, isDone }: { isActive: boolean; isDone: boolean }) {
  return (
    <div className="flex items-center">
      <motion.div
        className={cn('h-0.5 w-8 transition-colors duration-300', isActive ? 'bg-white' : isDone ? 'bg-gray-500' : 'bg-gray-700')}
        animate={isActive ? { scaleX: [0, 1] } : {}}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: 'left' }}
      />
      <div className={cn('w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 transition-colors duration-300',
        isActive ? 'border-l-white' : isDone ? 'border-l-gray-500' : 'border-l-gray-700'
      )} />
    </div>
  )
}

const PHASES: Phase[] = ['trigger', 'render', 'commit', 'paint']

export function RenderCycleViz() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('idle')
  const [renderCount, setRenderCount] = useState(0)
  const [counter, setCounter] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(2)

  // Refs readable inside async loops without stale closure
  const isPausedRef = useRef(false)
  const resumeRef = useRef<(() => void) | null>(null)

  const pause = () => {
    isPausedRef.current = true
    setIsPaused(true)
  }

  const resume = () => {
    isPausedRef.current = false
    setIsPaused(false)
    resumeRef.current?.()
    resumeRef.current = null
  }

  // Waits `ms`, but suspends mid-wait when paused
  const waitInterruptible = async (ms: number): Promise<void> => {
    const interval = 50
    let elapsed = 0
    while (elapsed < ms) {
      if (isPausedRef.current) {
        await new Promise<void>(resolve => { resumeRef.current = resolve })
      }
      await new Promise(resolve => setTimeout(resolve, interval))
      elapsed += interval
    }
  }

  const runAnimation = async () => {
    if (isAnimating) return
    isPausedRef.current = false
    setIsPaused(false)
    setIsAnimating(true)
    setCounter(prev => prev + 1)
    setRenderCount(prev => prev + 1)

    const phaseDuration = SPEED_OPTIONS[speedIndex].ms

    for (const phase of PHASES) {
      setCurrentPhase(phase)
      await waitInterruptible(phaseDuration)
    }

    setCurrentPhase('done')
    await new Promise(resolve => setTimeout(resolve, 400))
    setCurrentPhase('idle')
    setIsAnimating(false)
    setIsPaused(false)
  }

  const phaseIndex = PHASES.indexOf(currentPhase as typeof PHASES[number])

  const phases = [
    { id: 'trigger', label: 'Trigger', sublabel: 'useState setter', ...PHASE_INFO.trigger },
    { id: 'render', label: 'Render', sublabel: 'Reconciliation', ...PHASE_INFO.render },
    { id: 'commit', label: 'Commit', sublabel: 'DOM update', ...PHASE_INFO.commit },
    { id: 'paint', label: 'Paint', sublabel: 'Browser', ...PHASE_INFO.paint },
  ] as const

  const activePhaseInfo = currentPhase !== 'idle' && currentPhase !== 'done'
    ? PHASE_INFO[currentPhase]
    : null

  const activeApiNames = PHASE_ACTIVE_APIS[currentPhase] ?? []

  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">Visualizador: Render Cycle</h3>
          <p className="text-gray-400 text-sm mt-0.5">Observe o fluxo das 4 fases a cada mudança de estado</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Valor no estado</div>
          <div className="text-2xl font-bold text-white tabular-nums">{counter}</div>
          <div className="text-xs text-gray-500">renders: {renderCount}</div>
        </div>
      </div>

      {/* Phase diagram */}
      <div className="flex items-center justify-center gap-0 flex-wrap gap-y-4">
        {phases.map((phase, i) => (
          <div key={phase.id} className="flex items-center">
            <PhaseBox
              label={phase.label}
              sublabel={phase.sublabel}
              isActive={currentPhase === phase.id}
              isDone={phaseIndex > i || currentPhase === 'done'}
              activeColor={phase.color}
              activeBg={phase.bg}
              activeBorder={phase.border}
            />
            {i < phases.length - 1 && (
              <Arrow
                isActive={phaseIndex > i || (phaseIndex === i && currentPhase !== 'idle')}
                isDone={phaseIndex > i + 1 || currentPhase === 'done'}
              />
            )}
          </div>
        ))}
      </div>

      {/* Description + API highlight panel */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {activePhaseInfo ? (
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={cn('rounded-xl border p-4', activePhaseInfo.bg, activePhaseInfo.border)}
            >
              <div className={cn('font-semibold text-sm mb-1', activePhaseInfo.color)}>
                {activePhaseInfo.title}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{activePhaseInfo.description}</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-gray-800 bg-gray-800/30 p-4 text-center"
            >
              <p className="text-gray-500 text-sm">Clique no botão para ver o ciclo de render em ação</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* API chips — always visible, active ones light up */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 space-y-3">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">APIs do React neste fluxo</p>

          {/* Hooks row */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-600">Hooks</p>
            <div className="flex flex-wrap gap-2">
              {ALL_APIS.filter(a => a.type === 'hook').map(api => (
                <ApiChip key={api.name} api={api} isActive={activeApiNames.includes(api.name)} />
              ))}
            </div>
          </div>

          {/* Internals row */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-600">Internals</p>
            <div className="flex flex-wrap gap-2">
              {ALL_APIS.filter(a => a.type === 'internal').map(api => (
                <ApiChip key={api.name} api={api} isActive={activeApiNames.includes(api.name)} />
              ))}
            </div>
          </div>

          {/* Platform row */}
          <div className="space-y-1.5">
            <p className="text-xs text-gray-600">Plataforma</p>
            <div className="flex flex-wrap gap-2">
              {ALL_APIS.filter(a => a.type === 'platform').map(api => (
                <ApiChip key={api.name} api={api} isActive={activeApiNames.includes(api.name)} />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-1 border-t border-gray-800">
            {(['hook', 'internal', 'platform'] as ApiType[]).map(type => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={cn('h-2 w-2 rounded-full', TYPE_COLORS[type].dot)} />
                <span className="text-xs text-gray-600 capitalize">{type === 'hook' ? 'Hook' : type === 'internal' ? 'Internal' : 'Plataforma'}</span>
              </div>
            ))}
            <span className="text-xs text-gray-700 ml-auto">passe o mouse para ver o papel de cada API</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Speed selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Velocidade:</span>
          <div className="flex rounded-lg overflow-hidden border border-gray-700">
            {SPEED_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => setSpeedIndex(i)}
                disabled={isAnimating}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors',
                  speedIndex === i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200 disabled:opacity-40',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-600">({SPEED_OPTIONS[speedIndex].ms / 1000}s/fase)</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isAnimating && (
            <Button variant="secondary" size="md" onClick={isPaused ? resume : pause}>
              {isPaused ? '▶ Retomar' : '⏸ Pausar'}
            </Button>
          )}
          <Button
            onClick={runAnimation}
            disabled={isAnimating && !isPaused}
            size="lg"
          >
            {isAnimating
              ? isPaused ? '⏸ Pausado...' : '⏳ Executando...'
              : '▶ Disparar mudança de estado'}
          </Button>
        </div>
      </div>

      {/* Key insight */}
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="text-blue-400 font-semibold">Insight:</span> O React não atualiza o DOM a cada linha de código.
          Ele bate um snapshot do estado atual, compara com o anterior (reconciliation),
          e faz apenas as mudanças mínimas necessárias no DOM real — tudo na fase Commit.
        </p>
      </div>
    </div>
  )
}
