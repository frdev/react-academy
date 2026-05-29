import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `// DESAFIO: Functions em Profundidade
//
// Implemente pipe, curry e memoize do zero.

type Fn = (x: unknown) => unknown

/**
 * pipe(...fns)(valor)
 * Aplica as funções da esquerda para a direita.
 * pipe(f, g, h)(x) === h(g(f(x)))
 */
function pipe(...fns: Fn[]): Fn {
  // TODO
  return (x) => x
}

/**
 * curry(fn)
 * Transforma fn(a, b, c) em fn(a)(b)(c).
 * Também aceita chamadas parciais: fn(a, b)(c) ou fn(a)(b, c).
 */
function curry(fn: (...args: unknown[]) => unknown) {
  // TODO
  return fn
}

/**
 * memoize(fn)
 * Retorna uma versão cacheada de fn.
 * Chamadas com os mesmos argumentos retornam o valor cacheado.
 */
function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  // TODO
  return fn
}

// ─── Runner de testes ───────────────────────────────────────────

const double = (x: number) => x * 2
const addOne = (x: number) => x + 1
const square = (x: number) => (x as number) ** 2

const transformar = pipe(double as Fn, addOne as Fn, square as Fn)

const somar3 = curry((a: unknown, b: unknown, c: unknown) => (a as number) + (b as number) + (c as number))

let chamadas = 0
const lento = memoize((n: unknown) => { chamadas++; return (n as number) * 2 })

lento(5); lento(5); lento(5)  // deve chamar fn apenas 1 vez
lento(6)                       // nova chamada (argumento diferente)

type R = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }
const t = (desc: string, obtido: unknown, esp: unknown): R =>
  ({ desc, passou: Object.is(obtido, esp), esperado: esp, obtido })

const testes: R[] = [
  t('pipe(double, addOne, square)(3) === 49', transformar(3 as unknown), 49),
  t('pipe(double)(5) === 10', pipe(double as Fn)(5 as unknown), 10),
  t('somar3(1)(2)(3) === 6', (somar3 as any)(1)(2)(3), 6),
  t('somar3(1, 2)(3) === 6', (somar3 as any)(1, 2)(3), 6),
  t('somar3(1)(2, 3) === 6', (somar3 as any)(1)(2, 3), 6),
  t('memoize: lento(5) chamado 3x mas fn executada 1x', chamadas, 2),
  t('memoize: lento(5) retorna 10', lento(5), 10),
  t('memoize: lento(6) retorna 12', lento(6), 12),
]

const ok = testes.filter(r => r.passou).length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Functions em Profundidade</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{ok}/{testes.length} testes{ok === testes.length ? ' 🎉' : ''}</p>
      {testes.map((r, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <span style={{ color: r.passou ? '#4ade80' : '#f87171', marginRight: 8 }}>{r.passou ? '✅' : '❌'}</span>
          <span style={{ color: r.passou ? '#d1d5db' : '#f87171' }}>{r.desc}</span>
          {!r.passou && (
            <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24, marginTop: 2 }}>
              esperado: <code style={{ color: '#60a5fa' }}>{JSON.stringify(r.esperado)}</code>
              {' '}| obtido: <code style={{ color: '#f97316' }}>{JSON.stringify(r.obtido)}</code>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `// SOLUÇÃO: Functions em Profundidade

type Fn = (x: unknown) => unknown

function pipe(...fns: Fn[]): Fn {
  return (x) => fns.reduce((acc, fn) => fn(acc), x)
}

function curry(fn: (...args: unknown[]) => unknown) {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) {
      return fn(...args)
    }
    return (...moreArgs: unknown[]) => curried(...args, ...moreArgs)
  }
}

function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, unknown>()
  return ((...args: unknown[]) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// ─── Runner de testes ───────────────────────────────────────────

const double = (x: number) => x * 2
const addOne = (x: number) => x + 1
const square = (x: number) => (x as number) ** 2

const transformar = pipe(double as Fn, addOne as Fn, square as Fn)
const somar3 = curry((a: unknown, b: unknown, c: unknown) => (a as number) + (b as number) + (c as number))

let chamadas = 0
const lento = memoize((n: unknown) => { chamadas++; return (n as number) * 2 })

lento(5); lento(5); lento(5)
lento(6)

type R = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }
const t = (desc: string, obtido: unknown, esp: unknown): R =>
  ({ desc, passou: Object.is(obtido, esp), esperado: esp, obtido })

const testes: R[] = [
  t('pipe(double, addOne, square)(3) === 49', transformar(3 as unknown), 49),
  t('pipe(double)(5) === 10', pipe(double as Fn)(5 as unknown), 10),
  t('somar3(1)(2)(3) === 6', (somar3 as any)(1)(2)(3), 6),
  t('somar3(1, 2)(3) === 6', (somar3 as any)(1, 2)(3), 6),
  t('somar3(1)(2, 3) === 6', (somar3 as any)(1)(2, 3), 6),
  t('memoize: lento(5) chamado 3x mas fn executada 1x', chamadas, 2),
  t('memoize: lento(5) retorna 10', lento(5), 10),
  t('memoize: lento(6) retorna 12', lento(6), 12),
]

const ok = testes.filter(r => r.passou).length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Functions em Profundidade</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{ok}/{testes.length} testes{ok === testes.length ? ' 🎉' : ''}</p>
      {testes.map((r, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <span style={{ color: r.passou ? '#4ade80' : '#f87171', marginRight: 8 }}>{r.passou ? '✅' : '❌'}</span>
          <span style={{ color: r.passou ? '#d1d5db' : '#f87171' }}>{r.desc}</span>
          {!r.passou && (
            <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24, marginTop: 2 }}>
              esperado: <code style={{ color: '#60a5fa' }}>{JSON.stringify(r.esperado)}</code>
              {' '}| obtido: <code style={{ color: '#f97316' }}>{JSON.stringify(r.obtido)}</code>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
`,
}

export const hints = [
  'pipe: use Array.reduce para aplicar as funções em sequência. O acumulador começa com o valor inicial.',
  'curry: compare args.length com fn.length (número de parâmetros declarados). Se tiver argumentos suficientes, chame fn; senão, retorne uma função que acumula mais argumentos.',
  'memoize: use um Map como cache. A chave pode ser JSON.stringify(args). Antes de chamar fn, verifique se a chave já existe no cache.',
  'memoize: o cache deve ser criado UMA vez por chamada a memoize (closure), não dentro da função retornada.',
]
