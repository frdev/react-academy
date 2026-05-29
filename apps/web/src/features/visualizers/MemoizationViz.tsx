import { useState, memo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, cn } from '@academy/ui'

// Flash animation component for re-render indication
function RenderFlash({ renderCount }: { renderCount: number }) {
  return (
    <AnimatePresence>
      <motion.div
        key={renderCount}
        initial={{ backgroundColor: 'rgba(251, 146, 60, 0.6)' }}
        animate={{ backgroundColor: 'rgba(251, 146, 60, 0)' }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 rounded-lg pointer-events-none"
      />
    </AnimatePresence>
  )
}

// Child component WITHOUT memo
function ChildWithoutMemo({ label, receivesChangingProp, propValue }: {
  label: string
  receivesChangingProp: boolean
  propValue?: number
}) {
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div className="relative rounded-lg bg-gray-800 border border-gray-700 p-3">
      <RenderFlash renderCount={renderCount.current} />
      <div className="relative z-10">
        <div className="text-sm font-semibold text-white">{label}</div>
        {receivesChangingProp && (
          <div className="text-xs text-gray-400">prop: {propValue}</div>
        )}
        <div className="text-xs text-amber-400 mt-1">renders: {renderCount.current}</div>
        <div className="text-xs text-gray-600 mt-0.5">
          {receivesChangingProp ? 'recebe prop que muda' : 'sem props relevantes'}
        </div>
      </div>
    </div>
  )
}

// Child component WITH memo
const ChildWithMemo = memo(function ChildWithMemo({ label, receivesChangingProp, propValue }: {
  label: string
  receivesChangingProp: boolean
  propValue?: number
}) {
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div className="relative rounded-lg bg-gray-800 border border-green-800 p-3">
      <RenderFlash renderCount={renderCount.current} />
      <div className="relative z-10">
        <div className="text-sm font-semibold text-white">{label}</div>
        {receivesChangingProp && (
          <div className="text-xs text-gray-400">prop: {propValue}</div>
        )}
        <div className="text-xs text-green-400 mt-1">renders: {renderCount.current}</div>
        <div className="text-xs text-gray-600 mt-0.5">
          {receivesChangingProp ? 'recebe prop que muda' : 'sem props relevantes'}
        </div>
      </div>
    </div>
  )
})

export function MemoizationViz() {
  const [memoEnabled, setMemoEnabled] = useState(false)
  const [counter, setCounter] = useState(0)
  // key forces re-mount of children when memo mode changes (to reset render counts)
  const [resetKey, setResetKey] = useState(0)

  const toggleMemo = () => {
    setMemoEnabled(prev => !prev)
    setResetKey(prev => prev + 1)
    setCounter(0)
  }

  const ChildA = memoEnabled ? ChildWithMemo : ChildWithoutMemo
  const ChildB = memoEnabled ? ChildWithMemo : ChildWithoutMemo
  const ChildC = memoEnabled ? ChildWithMemo : ChildWithoutMemo
  const ChildD = memoEnabled ? ChildWithMemo : ChildWithoutMemo

  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-white font-semibold">Visualizador: Memoization</h3>
          <p className="text-gray-400 text-sm mt-0.5">
            Veja quais componentes re-renderizam com e sem React.memo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">React.memo:</span>
          <button
            onClick={toggleMemo}
            className={cn(
              'relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none',
              memoEnabled ? 'bg-green-600' : 'bg-gray-600'
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                memoEnabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
          <span className={cn(
            'text-sm font-semibold',
            memoEnabled ? 'text-green-400' : 'text-amber-400'
          )}>
            {memoEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Component tree */}
      <div key={resetKey} className="space-y-3">
        {/* Parent */}
        <div className="rounded-lg bg-blue-900/30 border border-blue-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold text-blue-300">Componente Pai</div>
              <div className="text-xs text-gray-400">state: counter = {counter}</div>
            </div>
            <Button size="sm" onClick={() => setCounter(c => c + 1)}>
              Mudar estado (+1)
            </Button>
          </div>

          {/* Children grid */}
          <div className="grid grid-cols-2 gap-3">
            <ChildA
              label="Child A"
              receivesChangingProp={false}
            />
            <ChildB
              label="Child B"
              receivesChangingProp={false}
            />
            <ChildC
              label="Child C"
              receivesChangingProp
              propValue={counter}
            />
            <ChildD
              label="Child D"
              receivesChangingProp={false}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-400/70" />
          <span>pisca laranja = re-renderizou</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-green-800" />
          <span>borda verde = React.memo ativo</span>
        </div>
      </div>

      {/* Explanation */}
      <div className={cn(
        'rounded-xl border p-4 text-sm leading-relaxed transition-colors duration-300',
        memoEnabled
          ? 'bg-green-900/20 border-green-800 text-green-200'
          : 'bg-amber-900/20 border-amber-800 text-amber-200'
      )}>
        {memoEnabled ? (
          <>
            <span className="font-semibold text-green-300">React.memo ON: </span>
            Somente o Child C re-renderiza — é o único que recebe uma prop que mudou ({' '}
            <code className="bg-green-900/50 px-1 rounded">propValue={counter}</code>
            {' '}). Child A, B e D são memorizados e suas props não mudaram.
          </>
        ) : (
          <>
            <span className="font-semibold text-amber-300">React.memo OFF: </span>
            Todos os 4 filhos re-renderizam quando o estado do pai muda — mesmo que
            suas props não tenham mudado. O React re-renderiza toda a subárvore por padrão.
          </>
        )}
      </div>

      {/* Key insight */}
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="text-blue-400 font-semibold">Cuidado:</span> React.memo não é
          uma otimização gratuita. Ele adiciona o custo de comparar as props (shallow comparison).
          Use apenas quando o componente re-renderiza frequentemente E sua renderização é custosa.
        </p>
      </div>
    </div>
  )
}
