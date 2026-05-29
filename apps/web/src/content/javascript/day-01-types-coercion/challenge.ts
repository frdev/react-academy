import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `// DESAFIO: Types & Coercion
//
// Implemente as duas funções abaixo.
// Os testes no final da página vão verificar sua solução.

/**
 * Retorna o tipo REAL do valor (melhor que typeof).
 * Deve retornar:
 *   'null'      → para null
 *   'array'     → para arrays
 *   'NaN'       → para NaN
 *   'function'  → para funções
 *   'object'    → para objetos (não null, não array)
 *   'string', 'number', 'boolean', 'undefined', 'symbol', 'bigint'
 */
function tipoReal(valor: unknown): string {
  // TODO: implemente aqui
  return typeof valor
}

/**
 * Converte para número com coerção EXPLÍCITA e regras claras:
 *   - null, false, ''  → 0
 *   - true             → 1
 *   - string numérica  → o número
 *   - qualquer outra coisa não conversível → NaN
 */
function paraNumero(valor: unknown): number {
  // TODO: implemente aqui
  return Number(valor)
}

// ─── Runner de testes (não modifique abaixo) ───────────────────

type Resultado = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }

function testar(desc: string, obtido: unknown, esperado: unknown): Resultado {
  const passou = Object.is(obtido, esperado)
  return { desc, passou, esperado, obtido }
}

const testes: Resultado[] = [
  testar('tipoReal(null) === "null"',      tipoReal(null),       'null'),
  testar('tipoReal([1,2]) === "array"',    tipoReal([1, 2]),     'array'),
  testar('tipoReal(NaN) === "NaN"',        tipoReal(NaN),        'NaN'),
  testar('tipoReal(() => {}) === "function"', tipoReal(() => {}), 'function'),
  testar('tipoReal({}) === "object"',      tipoReal({}),         'object'),
  testar('tipoReal("hi") === "string"',    tipoReal('hi'),       'string'),
  testar('paraNumero(null) === 0',         paraNumero(null),     0),
  testar('paraNumero(false) === 0',        paraNumero(false),    0),
  testar('paraNumero(true) === 1',         paraNumero(true),     1),
  testar('paraNumero("42") === 42',        paraNumero('42'),     42),
  testar('paraNumero("abc") é NaN',        isNaN(paraNumero('abc') as number), true),
]

const passou = testes.filter(t => t.passou).length
const total = testes.length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Types & Coercion</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
        {passou}/{total} testes passando
        {passou === total ? ' 🎉' : ''}
      </p>
      {testes.map((t, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <span style={{ color: t.passou ? '#4ade80' : '#f87171', marginRight: 8 }}>
            {t.passou ? '✅' : '❌'}
          </span>
          <span style={{ color: t.passou ? '#d1d5db' : '#f87171' }}>{t.desc}</span>
          {!t.passou && (
            <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24, marginTop: 2 }}>
              esperado: <code style={{ color: '#60a5fa' }}>{JSON.stringify(t.esperado)}</code>
              {' '}| obtido: <code style={{ color: '#f97316' }}>{JSON.stringify(t.obtido)}</code>
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
  'App.tsx': `// SOLUÇÃO: Types & Coercion

function tipoReal(valor: unknown): string {
  if (valor === null) return 'null'
  if (Array.isArray(valor)) return 'array'
  if (typeof valor === 'number' && isNaN(valor)) return 'NaN'
  return typeof valor
}

function paraNumero(valor: unknown): number {
  return Number(valor)
  // Number() já faz o que queremos:
  //   Number(null)  → 0
  //   Number(false) → 0
  //   Number(true)  → 1
  //   Number('42')  → 42
  //   Number('abc') → NaN
  // A chave é usar Number() explicitamente em vez de depender de coerção implícita (+, ==)
}

// ─── Runner de testes ───────────────────────────────────────────

type Resultado = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }

function testar(desc: string, obtido: unknown, esperado: unknown): Resultado {
  const passou = Object.is(obtido, esperado)
  return { desc, passou, esperado, obtido }
}

const testes: Resultado[] = [
  testar('tipoReal(null) === "null"',      tipoReal(null),       'null'),
  testar('tipoReal([1,2]) === "array"',    tipoReal([1, 2]),     'array'),
  testar('tipoReal(NaN) === "NaN"',        tipoReal(NaN),        'NaN'),
  testar('tipoReal(() => {}) === "function"', tipoReal(() => {}), 'function'),
  testar('tipoReal({}) === "object"',      tipoReal({}),         'object'),
  testar('tipoReal("hi") === "string"',    tipoReal('hi'),       'string'),
  testar('paraNumero(null) === 0',         paraNumero(null),     0),
  testar('paraNumero(false) === 0',        paraNumero(false),    0),
  testar('paraNumero(true) === 1',         paraNumero(true),     1),
  testar('paraNumero("42") === 42',        paraNumero('42'),     42),
  testar('paraNumero("abc") é NaN',        isNaN(paraNumero('abc') as number), true),
]

const passou = testes.filter(t => t.passou).length
const total = testes.length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Types & Coercion</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>
        {passou}/{total} testes passando
        {passou === total ? ' 🎉' : ''}
      </p>
      {testes.map((t, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <span style={{ color: t.passou ? '#4ade80' : '#f87171', marginRight: 8 }}>
            {t.passou ? '✅' : '❌'}
          </span>
          <span style={{ color: t.passou ? '#d1d5db' : '#f87171' }}>{t.desc}</span>
          {!t.passou && (
            <div style={{ color: '#9ca3af', fontSize: 12, marginLeft: 24, marginTop: 2 }}>
              esperado: <code style={{ color: '#60a5fa' }}>{JSON.stringify(t.esperado)}</code>
              {' '}| obtido: <code style={{ color: '#f97316' }}>{JSON.stringify(t.obtido)}</code>
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
  'Para null: `typeof null` retorna "object" — você precisa checar `valor === null` explicitamente antes.',
  'Para arrays: use `Array.isArray(valor)` — `typeof []` também retorna "object".',
  'Para NaN: use `typeof valor === "number" && isNaN(valor)` — NaN é tecnicamente do tipo number.',
  'Para `paraNumero`: `Number()` já faz a conversão correta para todos os casos. A diferença para o starter é tratar NaN como caso esperado, não como bug.',
]
