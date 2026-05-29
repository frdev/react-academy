import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `// DESAFIO: Event Loop
//
// Parte 1: preveja a ordem de execução
// Parte 2: implemente uma fila assíncrona com limite de concorrência

// ─── Parte 1: Preveja o output ─────────────────────────────────
// Sem executar, escreva a ordem correta em ORDEM_ESPERADA abaixo.
//
// console.log('A')
// setTimeout(() => console.log('B'), 0)
// Promise.resolve().then(() => console.log('C'))
// setTimeout(() => console.log('D'), 0)
// Promise.resolve().then(() => {
//   console.log('E')
//   Promise.resolve().then(() => console.log('F'))
// })
// console.log('G')

// TODO: preencha a ordem correta (ex: ['A', 'G', 'C', ...])
const ORDEM_ESPERADA: string[] = []

// ─── Parte 2: Fila com concorrência limitada ────────────────────
// Implemente criarFila(concorrencia) que:
// - Aceita tasks assíncronas via adicionar(fn)
// - Executa no máximo 'concorrencia' tasks em paralelo
// - Retorna uma Promise que resolve quando TODAS as tasks terminarem
//
// Exemplo:
// const fila = criarFila(2)  // máximo 2 em paralelo
// fila.adicionar(() => esperar(100))
// fila.adicionar(() => esperar(100))
// fila.adicionar(() => esperar(100))  // aguarda uma das duas anteriores terminar
// await fila.executar()

function criarFila(concorrencia: number) {
  const tasks: (() => Promise<unknown>)[] = []

  return {
    adicionar(fn: () => Promise<unknown>) {
      tasks.push(fn)
    },
    async executar(): Promise<void> {
      // TODO: execute as tasks com no máximo 'concorrencia' em paralelo
    }
  }
}

// ─── Runner de testes ───────────────────────────────────────────

const esperar = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

async function testarFila() {
  const ordem: number[] = []
  const fila = criarFila(2)

  fila.adicionar(async () => { await esperar(50); ordem.push(1) })
  fila.adicionar(async () => { await esperar(10); ordem.push(2) })
  fila.adicionar(async () => { await esperar(10); ordem.push(3) })

  const inicio = Date.now()
  await fila.executar()
  const tempo = Date.now() - inicio

  return { ordem, tempo }
}

const ORDEM_CORRETA = ['A', 'G', 'C', 'E', 'F', 'B', 'D']

export default function App() {
  const [resultado, setResultado] = React.useState<{ ordem: number[]; tempo: number } | null>(null)
  const [carregando, setCarregando] = React.useState(false)

  const rodar = async () => {
    setCarregando(true)
    const r = await testarFila()
    setResultado(r)
    setCarregando(false)
  }

  const ordemOk = JSON.stringify(ORDEM_ESPERADA) === JSON.stringify(ORDEM_CORRETA)
  const ordemFilaOk = resultado ? JSON.stringify(resultado.ordem) === JSON.stringify([2, 1, 3]) : null
  const tempoOk = resultado ? resultado.tempo < 90 : null  // paralelo: ~60ms, sequencial: ~70ms

  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Event Loop</h2>

      <div style={{ marginBottom: 16 }}>
        <span style={{ color: ordemOk ? '#4ade80' : '#f87171', marginRight: 8 }}>{ordemOk ? '✅' : '❌'}</span>
        <span style={{ color: ordemOk ? '#d1d5db' : '#f87171' }}>Parte 1: ordem correta do event loop</span>
        {!ordemOk && (
          <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24, marginTop: 2 }}>
            esperado: <code style={{ color: '#60a5fa' }}>{JSON.stringify(ORDEM_CORRETA)}</code>
            <br/>obtido: <code style={{ color: '#f97316' }}>{JSON.stringify(ORDEM_ESPERADA)}</code>
          </div>
        )}
      </div>

      <button
        onClick={rodar}
        disabled={carregando}
        style={{ marginBottom: 16, padding: '8px 16px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        {carregando ? 'Executando...' : 'Testar Fila Assíncrona'}
      </button>

      {resultado && (
        <>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: ordemFilaOk ? '#4ade80' : '#f87171', marginRight: 8 }}>{ordemFilaOk ? '✅' : '❌'}</span>
            <span>Parte 2: ordem de conclusão [2, 1, 3] (task 2 termina antes da 1)</span>
            {!ordemFilaOk && (
              <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24, marginTop: 2 }}>
                obtido: {JSON.stringify(resultado.ordem)}
              </div>
            )}
          </div>
          <div>
            <span style={{ color: tempoOk ? '#4ade80' : '#f87171', marginRight: 8 }}>{tempoOk ? '✅' : '❌'}</span>
            <span>Parte 2: executou em paralelo (~60ms, não ~70ms sequencial)</span>
            <span style={{ color: '#6b7280', marginLeft: 8 }}>({resultado.tempo}ms)</span>
          </div>
        </>
      )}
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `// SOLUÇÃO: Event Loop

// Parte 1: A, G, C, E, F, B, D
// Por quê:
// - A e G são síncronos (executam primeiro)
// - C e E são microtasks (Promise.then) — executam antes dos macrotasks
// - F é microtask criada durante E — executa antes de sair das microtasks
// - B e D são macrotasks (setTimeout) — executam por último

const ORDEM_ESPERADA = ['A', 'G', 'C', 'E', 'F', 'B', 'D']

// Parte 2: fila com concorrência limitada
function criarFila(concorrencia: number) {
  const tasks: (() => Promise<unknown>)[] = []

  return {
    adicionar(fn: () => Promise<unknown>) { tasks.push(fn) },
    async executar(): Promise<void> {
      let index = 0

      // Cria 'concorrencia' workers que processam tasks em sequência
      async function worker() {
        while (index < tasks.length) {
          const task = tasks[index++]
          await task()
        }
      }

      // Inicia N workers em paralelo
      const workers = Array.from({ length: Math.min(concorrencia, tasks.length) }, worker)
      await Promise.all(workers)
    }
  }
}

// ─── Runner de testes ───────────────────────────────────────────

const esperar = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

async function testarFila() {
  const ordem: number[] = []
  const fila = criarFila(2)

  fila.adicionar(async () => { await esperar(50); ordem.push(1) })
  fila.adicionar(async () => { await esperar(10); ordem.push(2) })
  fila.adicionar(async () => { await esperar(10); ordem.push(3) })

  const inicio = Date.now()
  await fila.executar()
  const tempo = Date.now() - inicio

  return { ordem, tempo }
}

const ORDEM_CORRETA = ['A', 'G', 'C', 'E', 'F', 'B', 'D']

export default function App() {
  const [resultado, setResultado] = React.useState<{ ordem: number[]; tempo: number } | null>(null)
  const [carregando, setCarregando] = React.useState(false)

  const rodar = async () => {
    setCarregando(true)
    const r = await testarFila()
    setResultado(r)
    setCarregando(false)
  }

  const ordemOk = JSON.stringify(ORDEM_ESPERADA) === JSON.stringify(ORDEM_CORRETA)
  const ordemFilaOk = resultado ? JSON.stringify(resultado.ordem) === JSON.stringify([2, 1, 3]) : null
  const tempoOk = resultado ? resultado.tempo < 90 : null

  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Event Loop</h2>

      <div style={{ marginBottom: 16 }}>
        <span style={{ color: ordemOk ? '#4ade80' : '#f87171', marginRight: 8 }}>{ordemOk ? '✅' : '❌'}</span>
        <span style={{ color: ordemOk ? '#d1d5db' : '#f87171' }}>Parte 1: ordem correta do event loop</span>
        {!ordemOk && (
          <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24, marginTop: 2 }}>
            esperado: <code style={{ color: '#60a5fa' }}>{JSON.stringify(ORDEM_CORRETA)}</code>
          </div>
        )}
      </div>

      <button
        onClick={rodar}
        disabled={carregando}
        style={{ marginBottom: 16, padding: '8px 16px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        {carregando ? 'Executando...' : 'Testar Fila Assíncrona'}
      </button>

      {resultado && (
        <>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: ordemFilaOk ? '#4ade80' : '#f87171', marginRight: 8 }}>{ordemFilaOk ? '✅' : '❌'}</span>
            <span>Parte 2: ordem de conclusão [2, 1, 3]</span>
            {!ordemFilaOk && <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24, marginTop: 2 }}>obtido: {JSON.stringify(resultado.ordem)}</div>}
          </div>
          <div>
            <span style={{ color: tempoOk ? '#4ade80' : '#f87171', marginRight: 8 }}>{tempoOk ? '✅' : '❌'}</span>
            <span>Parte 2: executou em paralelo (~60ms)</span>
            <span style={{ color: '#6b7280', marginLeft: 8 }}>({resultado.tempo}ms)</span>
          </div>
        </>
      )}
    </div>
  )
}
`,
}

export const hints = [
  'Parte 1: lembre-se da ordem: síncrono → microtasks (Promise.then) → macrotasks (setTimeout). Microtasks aninhadas são processadas antes de sair da fila de microtasks.',
  'Parte 2: pense em "workers" — cada worker pega uma task da fila, executa, e pega a próxima. Com concorrência 2, você tem 2 workers rodando em paralelo.',
  'Parte 2: use um índice compartilhado entre workers para coordenar qual task cada um pega. Inicialize `let index = 0` fora das workers.',
  'Parte 2: crie N workers com `Array.from({ length: concorrencia }, worker)` e aguarde todos com `Promise.all(workers)`. Cada worker é uma async function que loop enquanto houver tasks.',
]
