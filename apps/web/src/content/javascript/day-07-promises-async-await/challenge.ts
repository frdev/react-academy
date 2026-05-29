import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `// DESAFIO: Promises & async/await
//
// Implemente três utilitários de Promise do zero.

/**
 * promiseTodos(promises)
 * Implementação própria de Promise.all:
 * - Resolve com array de valores na ORDEM ORIGINAL quando todas resolvem
 * - Rejeita imediatamente se qualquer Promise rejeitar
 */
function promiseTodos<T>(promises: Promise<T>[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    // TODO
  })
}

/**
 * comRetry(fn, tentativas)
 * Executa fn() e, se falhar, tenta novamente até 'tentativas' vezes.
 * Se todas falharem, rejeita com o último erro.
 * Se alguma tiver sucesso, resolve com o resultado.
 */
async function comRetry<T>(fn: () => Promise<T>, tentativas: number): Promise<T> {
  // TODO
  return fn()
}

/**
 * comTimeout(promise, ms)
 * Rejeita com Error('Timeout') se a promise não resolver em 'ms' milissegundos.
 */
function comTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  // TODO
  return promise
}

// ─── Runner de testes ───────────────────────────────────────────

const esperar = (ms: number, val: unknown = ms) =>
  new Promise(r => setTimeout(() => r(val), ms))

const falhar = (ms: number, msg: string) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(msg)), ms))

export default function App() {
  const [resultados, setResultados] = React.useState<{desc: string; passou: boolean; detalhe?: string}[]>([])
  const [rodando, setRodando] = React.useState(false)

  const rodar = async () => {
    setRodando(true)
    const r = []

    // Teste 1: promiseTodos resolve com valores em ordem
    try {
      const vals = await promiseTodos([esperar(30, 'a'), esperar(10, 'b'), esperar(20, 'c')])
      r.push({ desc: 'promiseTodos: resolve em ordem original', passou: JSON.stringify(vals) === '["a","b","c"]', detalhe: JSON.stringify(vals) })
    } catch(e) {
      r.push({ desc: 'promiseTodos: resolve em ordem original', passou: false, detalhe: String(e) })
    }

    // Teste 2: promiseTodos rejeita rápido
    try {
      await promiseTodos([esperar(100), falhar(10, 'falhou'), esperar(100)])
      r.push({ desc: 'promiseTodos: rejeita ao primeiro erro', passou: false, detalhe: 'não rejeitou' })
    } catch(e) {
      r.push({ desc: 'promiseTodos: rejeita ao primeiro erro', passou: (e as Error).message === 'falhou' })
    }

    // Teste 3: retry funciona
    let tentativas = 0
    try {
      const res = await comRetry(async () => {
        tentativas++
        if (tentativas < 3) throw new Error('ainda não')
        return 'sucesso'
      }, 3)
      r.push({ desc: 'comRetry: sucessa na 3ª tentativa', passou: res === 'sucesso' && tentativas === 3 })
    } catch(e) {
      r.push({ desc: 'comRetry: sucessa na 3ª tentativa', passou: false, detalhe: String(e) })
    }

    // Teste 4: retry esgota e rejeita
    try {
      await comRetry(async () => { throw new Error('sempre falha') }, 2)
      r.push({ desc: 'comRetry: rejeita após esgotar tentativas', passou: false })
    } catch(e) {
      r.push({ desc: 'comRetry: rejeita após esgotar tentativas', passou: (e as Error).message === 'sempre falha' })
    }

    // Teste 5: timeout
    try {
      await comTimeout(esperar(200), 50)
      r.push({ desc: 'comTimeout: rejeita se demorar demais', passou: false, detalhe: 'não rejeitou' })
    } catch(e) {
      r.push({ desc: 'comTimeout: rejeita se demorar demais', passou: (e as Error).message === 'Timeout' })
    }

    setResultados(r)
    setRodando(false)
  }

  const ok = resultados.filter(r => r.passou).length

  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Promises & async/await</h2>
      <button
        onClick={rodar} disabled={rodando}
        style={{ marginBottom: 16, padding: '8px 16px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        {rodando ? 'Executando...' : 'Rodar Testes'}
      </button>
      {resultados.length > 0 && (
        <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 12 }}>{ok}/{resultados.length} testes{ok === resultados.length ? ' 🎉' : ''}</p>
      )}
      {resultados.map((r, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <span style={{ color: r.passou ? '#4ade80' : '#f87171', marginRight: 8 }}>{r.passou ? '✅' : '❌'}</span>
          <span style={{ color: r.passou ? '#d1d5db' : '#f87171' }}>{r.desc}</span>
          {!r.passou && r.detalhe && <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24 }}>{r.detalhe}</div>}
        </div>
      ))}
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `// SOLUÇÃO: Promises & async/await

function promiseTodos<T>(promises: Promise<T>[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) { resolve([]); return }

    const results: T[] = new Array(promises.length)
    let resolvidas = 0

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(valor => {
        results[index] = valor  // preserva a ordem original
        resolvidas++
        if (resolvidas === promises.length) resolve(results)
      }).catch(reject)  // rejeita imediatamente ao primeiro erro
    })
  })
}

async function comRetry<T>(fn: () => Promise<T>, tentativas: number): Promise<T> {
  let ultimoErro: Error
  for (let i = 0; i < tentativas; i++) {
    try {
      return await fn()
    } catch (e) {
      ultimoErro = e as Error
    }
  }
  throw ultimoErro!
}

function comTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  )
  return Promise.race([promise, timeout])
}

// ─── Runner de testes ───────────────────────────────────────────

const esperar = (ms: number, val: unknown = ms) =>
  new Promise(r => setTimeout(() => r(val), ms))

const falhar = (ms: number, msg: string) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(msg)), ms))

export default function App() {
  const [resultados, setResultados] = React.useState<{desc: string; passou: boolean; detalhe?: string}[]>([])
  const [rodando, setRodando] = React.useState(false)

  const rodar = async () => {
    setRodando(true)
    const r = []

    try {
      const vals = await promiseTodos([esperar(30, 'a'), esperar(10, 'b'), esperar(20, 'c')])
      r.push({ desc: 'promiseTodos: resolve em ordem original', passou: JSON.stringify(vals) === '["a","b","c"]' })
    } catch(e) {
      r.push({ desc: 'promiseTodos: resolve em ordem original', passou: false, detalhe: String(e) })
    }

    try {
      await promiseTodos([esperar(100), falhar(10, 'falhou'), esperar(100)])
      r.push({ desc: 'promiseTodos: rejeita ao primeiro erro', passou: false })
    } catch(e) {
      r.push({ desc: 'promiseTodos: rejeita ao primeiro erro', passou: (e as Error).message === 'falhou' })
    }

    let tentativas = 0
    try {
      const res = await comRetry(async () => {
        tentativas++
        if (tentativas < 3) throw new Error('ainda não')
        return 'sucesso'
      }, 3)
      r.push({ desc: 'comRetry: sucessa na 3ª tentativa', passou: res === 'sucesso' && tentativas === 3 })
    } catch(e) {
      r.push({ desc: 'comRetry: sucessa na 3ª tentativa', passou: false, detalhe: String(e) })
    }

    try {
      await comRetry(async () => { throw new Error('sempre falha') }, 2)
      r.push({ desc: 'comRetry: rejeita após esgotar tentativas', passou: false })
    } catch(e) {
      r.push({ desc: 'comRetry: rejeita após esgotar tentativas', passou: (e as Error).message === 'sempre falha' })
    }

    try {
      await comTimeout(esperar(200), 50)
      r.push({ desc: 'comTimeout: rejeita se demorar demais', passou: false })
    } catch(e) {
      r.push({ desc: 'comTimeout: rejeita se demorar demais', passou: (e as Error).message === 'Timeout' })
    }

    setResultados(r)
    setRodando(false)
  }

  const ok = resultados.filter(r => r.passou).length

  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Promises & async/await</h2>
      <button onClick={rodar} disabled={rodando}
        style={{ marginBottom: 16, padding: '8px 16px', background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
        {rodando ? 'Executando...' : 'Rodar Testes'}
      </button>
      {resultados.length > 0 && <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 12 }}>{ok}/{resultados.length} testes{ok === resultados.length ? ' 🎉' : ''}</p>}
      {resultados.map((r, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <span style={{ color: r.passou ? '#4ade80' : '#f87171', marginRight: 8 }}>{r.passou ? '✅' : '❌'}</span>
          <span style={{ color: r.passou ? '#d1d5db' : '#f87171' }}>{r.desc}</span>
          {!r.passou && r.detalhe && <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24 }}>{r.detalhe}</div>}
        </div>
      ))}
    </div>
  )
}
`,
}

export const hints = [
  'promiseTodos: crie um array `results` do mesmo tamanho. Percorra as promises com forEach, salvando cada resultado em `results[index]`. Quando `resolvidas === promises.length`, chame resolve(results).',
  'promiseTodos: não use await dentro — você precisa que todas iniciem em paralelo. Use .then() e .catch() em cada promise individualmente.',
  'comRetry: use um loop for com try/catch dentro. Se fn() resolver, retorne o valor. Se lançar, salve o erro. Se o loop acabar, lance o último erro.',
  'comTimeout: crie uma "promise de timeout" com `new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))` e use `Promise.race([promise, timeout])`.',
]
