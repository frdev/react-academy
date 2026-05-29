import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, cn } from '@academy/ui'

interface TreeNode {
  id: string
  label: string
  color: string
}

type DiffStatus = 'added' | 'removed' | 'updated' | 'unchanged'

interface DiffNode extends TreeNode {
  status: DiffStatus
}

const INITIAL_NODES: TreeNode[] = [
  { id: 'a', label: 'Header', color: 'bg-blue-900/50 border-blue-700' },
  { id: 'b', label: 'Sidebar', color: 'bg-purple-900/50 border-purple-700' },
  { id: 'c', label: 'Content', color: 'bg-green-900/50 border-green-700' },
  { id: 'd', label: 'Footer', color: 'bg-gray-800 border-gray-600' },
]

function diffNodes(before: TreeNode[], after: TreeNode[]): DiffNode[] {
  const beforeMap = new Map(before.map(n => [n.id, n]))
  const afterMap = new Map(after.map(n => [n.id, n]))
  const result: DiffNode[] = []

  // Removed
  for (const node of before) {
    if (!afterMap.has(node.id)) {
      result.push({ ...node, status: 'removed' })
    }
  }
  // Added or updated or unchanged
  for (const node of after) {
    const prev = beforeMap.get(node.id)
    if (!prev) result.push({ ...node, status: 'added' })
    else if (prev.label !== node.label) result.push({ ...node, status: 'updated' })
    else result.push({ ...node, status: 'unchanged' })
  }

  return result
}

const STATUS_STYLES: Record<DiffStatus, string> = {
  added:     'bg-green-900/60 border-green-500 shadow-green-900/50 shadow-lg',
  removed:   'bg-red-900/60 border-red-500 opacity-50',
  updated:   'bg-yellow-900/60 border-yellow-500',
  unchanged: 'bg-gray-800/60 border-gray-700',
}

const STATUS_BADGE: Record<DiffStatus, { label: string; color: string }> = {
  added:     { label: '+ adicionado', color: 'text-green-400' },
  removed:   { label: '− removido',   color: 'text-red-400' },
  updated:   { label: '~ atualizado', color: 'text-yellow-400' },
  unchanged: { label: '= igual',      color: 'text-gray-500' },
}

function NodeBox({ node, showDiff }: { node: TreeNode | DiffNode; showDiff: boolean }) {
  const diffNode = showDiff ? (node as DiffNode) : null
  const status = diffNode?.status

  return (
    <motion.div
      layout
      initial={status === 'added' ? { opacity: 0, scale: 0.8 } : false}
      animate={{ opacity: status === 'removed' ? 0.4 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
        status ? STATUS_STYLES[status] : 'bg-gray-800 border-gray-700 text-gray-300',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className={status === 'removed' ? 'text-red-300 line-through' : 'text-white'}>
          {node.label}
        </span>
        {status && status !== 'unchanged' && (
          <span className={cn('text-xs', STATUS_BADGE[status].color)}>
            {STATUS_BADGE[status].label}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function ReconciliationViz() {
  const [beforeNodes] = useState<TreeNode[]>(INITIAL_NODES)
  const [afterNodes, setAfterNodes] = useState<TreeNode[]>(INITIAL_NODES)
  const [diffResult, setDiffResult] = useState<DiffNode[] | null>(null)
  const [showKeyDemo, setShowKeyDemo] = useState(false)

  const toggleNode = (id: string) => {
    setDiffResult(null)
    setAfterNodes(prev => {
      const exists = prev.find(n => n.id === id)
      if (exists) return prev.filter(n => n.id !== id)
      const original = INITIAL_NODES.find(n => n.id === id)!
      return [...prev, original].sort((a, b) =>
        INITIAL_NODES.findIndex(n => n.id === a.id) - INITIAL_NODES.findIndex(n => n.id === b.id)
      )
    })
  }

  const renameNode = (id: string) => {
    setDiffResult(null)
    setAfterNodes(prev =>
      prev.map(n => n.id === id ? { ...n, label: n.label + ' (v2)' } : n)
    )
  }

  const reconcile = () => {
    setDiffResult(diffNodes(beforeNodes, afterNodes))
  }

  const reset = () => {
    setAfterNodes(INITIAL_NODES)
    setDiffResult(null)
  }

  // Key demo: list with stable IDs vs index keys
  const keyDemoItems = ['React', 'TypeScript', 'Vite']
  const [keyDemoList, setKeyDemoList] = useState(keyDemoItems)
  const moveFirst = () => setKeyDemoList(prev => [...prev.slice(1), prev[0]])

  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-6">
      <div>
        <h3 className="text-white font-semibold">Visualizador: Reconciliation</h3>
        <p className="text-gray-400 text-sm mt-0.5">
          Veja como o React compara duas árvores e calcula o mínimo de mudanças necessárias
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowKeyDemo(false)}
          className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            !showKeyDemo ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white')}
        >
          Diffing de Árvore
        </button>
        <button
          onClick={() => setShowKeyDemo(true)}
          className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            showKeyDemo ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white')}
        >
          Problema das Keys
        </button>
      </div>

      {!showKeyDemo ? (
        <div className="space-y-4">
          {/* Side by side trees */}
          <div className="grid grid-cols-2 gap-4">
            {/* Before */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Antes (atual)</p>
              <div className="space-y-2">
                <AnimatePresence>
                  {beforeNodes.map(node => (
                    <NodeBox key={node.id} node={node} showDiff={false} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* After */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                Depois {diffResult ? '(diff aplicado)' : '(edite abaixo)'}
              </p>
              <div className="space-y-2">
                <AnimatePresence>
                  {(diffResult ?? afterNodes).map(node => (
                    <NodeBox key={node.id} node={node} showDiff={!!diffResult} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Edit controls */}
          <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-4 space-y-2">
            <p className="text-xs text-gray-400 font-semibold mb-3">Edite o estado "Depois":</p>
            {INITIAL_NODES.map(node => {
              const inAfter = afterNodes.some(n => n.id === node.id)
              return (
                <div key={node.id} className="flex items-center gap-2">
                  <span className="text-sm text-gray-300 w-20">{node.label}</span>
                  <button
                    onClick={() => toggleNode(node.id)}
                    className={cn('px-2 py-1 rounded text-xs font-medium transition-colors',
                      inAfter ? 'bg-red-900/50 text-red-300 hover:bg-red-900' : 'bg-green-900/50 text-green-300 hover:bg-green-900')}
                  >
                    {inAfter ? 'Remover' : 'Adicionar'}
                  </button>
                  {inAfter && (
                    <button
                      onClick={() => renameNode(node.id)}
                      className="px-2 py-1 rounded text-xs bg-yellow-900/50 text-yellow-300 hover:bg-yellow-900"
                    >
                      Renomear
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex gap-2">
            <Button onClick={reconcile} disabled={!!diffResult}>
              ⚡ Reconciliar
            </Button>
            <Button variant="secondary" onClick={reset}>
              Resetar
            </Button>
          </div>

          {diffResult && (
            <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-xs text-gray-400">
              <span className="text-blue-400 font-semibold">Resultado: </span>
              {diffResult.filter(n => n.status === 'added').length} adicionados,{' '}
              {diffResult.filter(n => n.status === 'removed').length} removidos,{' '}
              {diffResult.filter(n => n.status === 'updated').length} atualizados,{' '}
              {diffResult.filter(n => n.status === 'unchanged').length} inalterados.
              {' '}O React só toca o DOM nos nós que mudaram.
            </div>
          )}
        </div>
      ) : (
        /* Key Demo */
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-800 bg-amber-900/20 p-4">
            <p className="text-amber-300 text-sm font-semibold mb-1">⚠️ Problema: key={'{index}'}</p>
            <p className="text-gray-300 text-sm">
              Quando você usa o índice do array como key e a ordem muda, o React reutiliza
              os elementos DOM na posição antiga — causando bugs de estado e animações erradas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold">❌ key={'{index}'} (bugado)</p>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {keyDemoList.map((item, i) => (
                    <motion.div
                      key={i} // index as key — intentionally wrong
                      layout
                      className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-200"
                    >
                      <span className="text-xs text-gray-500 mr-2">key={i}</span>
                      {item}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold">✅ key={'{item}'} (correto)</p>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {keyDemoList.map(item => (
                    <motion.div
                      key={item} // stable key — correct
                      layout
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="rounded-lg border border-green-800 bg-green-900/20 px-3 py-2 text-sm text-green-200"
                    >
                      <span className="text-xs text-gray-500 mr-2">key="{item}"</span>
                      {item}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <Button onClick={moveFirst}>
            Mover primeiro para o final
          </Button>
          <p className="text-xs text-gray-500">
            Observe: com key=index, nenhuma animação de reordenação ocorre (React acha que os elementos são os mesmos).
            Com key=item, o React sabe que os elementos se moveram e anima corretamente.
          </p>
        </div>
      )}

      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="text-blue-400 font-semibold">Insight:</span> O React usa dois heurísticos:
          (1) elementos de tipos diferentes são destruídos e recriados do zero;
          (2) listas usam a prop <code className="text-blue-300 bg-gray-800 px-1 rounded">key</code> para rastrear identidade entre renders.
        </p>
      </div>
    </div>
  )
}
