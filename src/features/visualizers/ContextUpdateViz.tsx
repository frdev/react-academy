import { createContext, useContext, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/cn'

// ─── Flash component ──────────────────────────────────────────────────────
function RenderFlash({ renderCount }: { renderCount: number }) {
  return (
    <AnimatePresence>
      <motion.div
        key={renderCount}
        initial={{ backgroundColor: 'rgba(251, 146, 60, 0.7)' }}
        animate={{ backgroundColor: 'rgba(251, 146, 60, 0)' }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 rounded-lg pointer-events-none"
      />
    </AnimatePresence>
  )
}

// ─── PROBLEM MODE: Single fat context ─────────────────────────────────────
interface BigContextValue {
  user: string
  theme: string
  count: number
}

const BigContext = createContext<BigContextValue>({ user: 'Ana', theme: 'dark', count: 0 })

function UserDisplay() {
  const { user } = useContext(BigContext)
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="relative rounded-lg border border-gray-700 bg-gray-800 p-3">
      <RenderFlash renderCount={renders.current} />
      <div className="relative z-10 text-xs">
        <span className="text-gray-400">UserDisplay</span>
        <div className="text-white font-mono mt-0.5">user: &quot;{user}&quot;</div>
        <div className="text-amber-400 text-xs mt-1">renders: {renders.current}</div>
      </div>
    </div>
  )
}

function ThemeDisplay() {
  const { theme } = useContext(BigContext)
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="relative rounded-lg border border-gray-700 bg-gray-800 p-3">
      <RenderFlash renderCount={renders.current} />
      <div className="relative z-10 text-xs">
        <span className="text-gray-400">ThemeDisplay</span>
        <div className="text-white font-mono mt-0.5">theme: &quot;{theme}&quot;</div>
        <div className="text-amber-400 text-xs mt-1">renders: {renders.current}</div>
      </div>
    </div>
  )
}

function CountDisplay() {
  const { count } = useContext(BigContext)
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="relative rounded-lg border border-blue-700 bg-blue-900/30 p-3">
      <RenderFlash renderCount={renders.current} />
      <div className="relative z-10 text-xs">
        <span className="text-blue-300">CountDisplay</span>
        <div className="text-white font-mono mt-0.5">count: {count}</div>
        <div className="text-amber-400 text-xs mt-1">renders: {renders.current}</div>
      </div>
    </div>
  )
}

function ProblemMode({ onIncrement }: { onIncrement: () => void }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-red-800 bg-red-900/20 p-4">
        <div className="text-xs text-red-400 font-semibold mb-3">BigContext.Provider (user + theme + count)</div>
        <div className="grid grid-cols-3 gap-2">
          <UserDisplay />
          <ThemeDisplay />
          <CountDisplay />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={onIncrement}>Incrementar count</Button>
        <p className="text-xs text-red-400">Observe: UserDisplay e ThemeDisplay re-renderizam mesmo sem usar count!</p>
      </div>
    </div>
  )
}

// ─── SOLUTION MODE: Split contexts ────────────────────────────────────────
const UserCtx   = createContext<string>('Ana')
const ThemeCtx  = createContext<string>('dark')
const CountCtx  = createContext<number>(0)

function UserDisplaySplit() {
  const user = useContext(UserCtx)
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="relative rounded-lg border border-green-800 bg-green-900/20 p-3">
      <RenderFlash renderCount={renders.current} />
      <div className="relative z-10 text-xs">
        <span className="text-green-400">UserDisplay</span>
        <div className="text-white font-mono mt-0.5">user: &quot;{user}&quot;</div>
        <div className="text-green-400 text-xs mt-1">renders: {renders.current} ✓</div>
      </div>
    </div>
  )
}

function ThemeDisplaySplit() {
  const theme = useContext(ThemeCtx)
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="relative rounded-lg border border-green-800 bg-green-900/20 p-3">
      <RenderFlash renderCount={renders.current} />
      <div className="relative z-10 text-xs">
        <span className="text-green-400">ThemeDisplay</span>
        <div className="text-white font-mono mt-0.5">theme: &quot;{theme}&quot;</div>
        <div className="text-green-400 text-xs mt-1">renders: {renders.current} ✓</div>
      </div>
    </div>
  )
}

function CountDisplaySplit() {
  const count = useContext(CountCtx)
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="relative rounded-lg border border-blue-700 bg-blue-900/30 p-3">
      <RenderFlash renderCount={renders.current} />
      <div className="relative z-10 text-xs">
        <span className="text-blue-300">CountDisplay</span>
        <div className="text-white font-mono mt-0.5">count: {count}</div>
        <div className="text-amber-400 text-xs mt-1">renders: {renders.current}</div>
      </div>
    </div>
  )
}

function SolutionMode({ count, onIncrement }: { count: number; onIncrement: () => void }) {
  return (
    <UserCtx.Provider value="Ana">
      <ThemeCtx.Provider value="dark">
        <CountCtx.Provider value={count}>
          <div className="space-y-3">
            <div className="rounded-xl border border-green-800 bg-green-900/10 p-4">
              <div className="text-xs text-green-400 font-semibold mb-3">
                UserCtx.Provider + ThemeCtx.Provider + CountCtx.Provider (separados)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <UserDisplaySplit />
                <ThemeDisplaySplit />
                <CountDisplaySplit />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={onIncrement}>Incrementar count</Button>
              <p className="text-xs text-green-400">Só CountDisplay re-renderiza!</p>
            </div>
          </div>
        </CountCtx.Provider>
      </ThemeCtx.Provider>
    </UserCtx.Provider>
  )
}

// ─── Main component ───────────────────────────────────────────────────────
export function ContextUpdateViz() {
  const [mode, setMode] = useState<'problem' | 'solution'>('problem')
  const [bigCtxValue, setBigCtxValue] = useState<BigContextValue>({ user: 'Ana', theme: 'dark', count: 0 })
  const [splitCount, setSplitCount] = useState(0)
  // resetKey forces remount of consumer components to reset render counters
  const [resetKey, setResetKey] = useState(0)

  const switchMode = (m: 'problem' | 'solution') => {
    setMode(m)
    setResetKey(k => k + 1)
    setBigCtxValue({ user: 'Ana', theme: 'dark', count: 0 })
    setSplitCount(0)
  }

  const incrementProblem = () => setBigCtxValue(v => ({ ...v, count: v.count + 1 }))
  const incrementSolution = () => setSplitCount(c => c + 1)

  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-6">
      <div>
        <h3 className="text-white font-semibold">Visualizador: Context Performance</h3>
        <p className="text-gray-400 text-sm mt-0.5">
          Por que um Context grande causa re-renders desnecessários — e como resolver
        </p>
      </div>

      {/* Mode switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => switchMode('problem')}
          className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            mode === 'problem' ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white')}
        >
          ❌ Problema (Context único)
        </button>
        <button
          onClick={() => switchMode('solution')}
          className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            mode === 'solution' ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white')}
        >
          ✅ Solução (Contexts separados)
        </button>
      </div>

      <div key={resetKey}>
        {mode === 'problem' ? (
          <BigContext.Provider value={bigCtxValue}>
            <ProblemMode onIncrement={incrementProblem} />
          </BigContext.Provider>
        ) : (
          <SolutionMode count={splitCount} onIncrement={incrementSolution} />
        )}
      </div>

      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="text-blue-400 font-semibold">Regra:</span> Separe Contexts por frequência de atualização.
          Dados estáticos (user, theme) em um Context; dados dinâmicos (count, notifications) em outro.
          Para atualizações de alta frequência, prefira Zustand ou outro store externo.
        </p>
      </div>
    </div>
  )
}
