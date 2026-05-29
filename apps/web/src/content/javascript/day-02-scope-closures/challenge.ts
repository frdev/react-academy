import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `// DESAFIO: Scope & Closures
//
// Implemente as funções abaixo usando closures.

/**
 * Retorna um objeto contador com quatro métodos.
 * Cada contador criado é INDEPENDENTE dos outros.
 *
 * criarContador(5)  → começa em 5
 * criarContador()   → começa em 0
 */
function criarContador(inicial = 0) {
  // TODO: use uma closure para guardar o estado interno
  return {
    incrementar() { /* TODO */ },
    decrementar() { /* TODO */ },
    resetar()     { /* TODO */ },
    valor()       { return 0 /* TODO */ },
  }
}

/**
 * Retorna um array de 5 funções.
 * Cada função, quando chamada, deve retornar seu próprio índice (0, 1, 2, 3, 4).
 *
 * DICA: o bug clássico do var em loop.
 */
function criarFuncoes(): (() => number)[] {
  const funcs: (() => number)[] = []
  for (var i = 0; i < 5; i++) {
    funcs.push(() => i)  // BUG: todas retornam 5
  }
  return funcs
}

// ─── Runner de testes ───────────────────────────────────────────

type R = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }
function t(desc: string, obtido: unknown, esp: unknown): R {
  return { desc, passou: Object.is(obtido, esp), esperado: esp, obtido }
}

const c1 = criarContador()
const c2 = criarContador(10)
c1.incrementar(); c1.incrementar(); c1.incrementar()
c1.decrementar()
c2.incrementar()
const funcs = criarFuncoes()

const testes: R[] = [
  t('c1.valor() após 3 inc e 1 dec === 2', c1.valor(), 2),
  t('c2.valor() após 1 inc === 11', c2.valor(), 11),
  t('c1 e c2 são independentes (c1 não afetou c2)', c2.valor(), 11),
  t('c1.resetar() → volta ao inicial (0)', (c1.resetar(), c1.valor()), 0),
  t('funcs[0]() === 0', funcs[0](), 0),
  t('funcs[1]() === 1', funcs[1](), 1),
  t('funcs[3]() === 3', funcs[3](), 3),
  t('funcs[4]() === 4', funcs[4](), 4),
]

const ok = testes.filter(r => r.passou).length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Scope & Closures</h2>
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
  'App.tsx': `// SOLUÇÃO: Scope & Closures

function criarContador(inicial = 0) {
  let count = inicial  // variável privada via closure

  return {
    incrementar() { count++ },
    decrementar() { count-- },
    resetar()     { count = inicial },
    valor()       { return count },
  }
}

function criarFuncoes(): (() => number)[] {
  const funcs: (() => number)[] = []
  // Solução 1: trocar var por let (let tem escopo de bloco → nova variável por iteração)
  for (let i = 0; i < 5; i++) {
    funcs.push(() => i)
  }
  return funcs
  // Solução 2 (legado, sem let): IIFE capturando i por valor
  // for (var i = 0; i < 5; i++) {
  //   funcs.push(((j) => () => j)(i))
  // }
}

// ─── Runner de testes ───────────────────────────────────────────

type R = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }
function t(desc: string, obtido: unknown, esp: unknown): R {
  return { desc, passou: Object.is(obtido, esp), esperado: esp, obtido }
}

const c1 = criarContador()
const c2 = criarContador(10)
c1.incrementar(); c1.incrementar(); c1.incrementar()
c1.decrementar()
c2.incrementar()
const funcs = criarFuncoes()

const testes: R[] = [
  t('c1.valor() após 3 inc e 1 dec === 2', c1.valor(), 2),
  t('c2.valor() após 1 inc === 11', c2.valor(), 11),
  t('c1 e c2 são independentes (c1 não afetou c2)', c2.valor(), 11),
  t('c1.resetar() → volta ao inicial (0)', (c1.resetar(), c1.valor()), 0),
  t('funcs[0]() === 0', funcs[0](), 0),
  t('funcs[1]() === 1', funcs[1](), 1),
  t('funcs[3]() === 3', funcs[3](), 3),
  t('funcs[4]() === 4', funcs[4](), 4),
]

const ok = testes.filter(r => r.passou).length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Scope & Closures</h2>
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
  'Para o contador: declare `let count = inicial` dentro de `criarContador` — essa variável fica "presa" na closure dos métodos retornados.',
  'Os métodos do objeto retornado (incrementar, decrementar, etc.) todos acessam a mesma variável `count` via closure.',
  'Para criarFuncoes: troque `var i` por `let i`. Com `let`, cada iteração do loop cria uma nova variável `i` com escopo de bloco — cada closure captura sua própria cópia.',
  'Se não puder usar let: envolva o push em uma IIFE `((j) => funcs.push(() => j))(i)` para capturar o valor atual de i por parâmetro.',
]
