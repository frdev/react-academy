import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `// DESAFIO: this keyword
//
// Os quatro objetos/classes abaixo têm bugs relacionados ao this.
// Corrija cada um para que os testes passem.

// --- Bug 1: método perdendo o this quando extraído ---
const pessoa = {
  nome: 'Ana',
  saudar() {
    return \`Olá, sou \${this.nome}\`
  }
}
const saudar = pessoa.saudar  // perde o binding!
// TODO: faça saudarFixo() retornar "Olá, sou Ana"
const saudarFixo = saudar  // corrija aqui (use bind)

// --- Bug 2: callback perdendo o this ---
class Timer {
  segundos = 0

  // TODO: corriga tick para que this.segundos incremente corretamente
  tick() {
    function incrementar() {
      this.segundos++  // this está errado aqui!
    }
    incrementar()
  }
}

// --- Bug 3: arrow function como método de objeto ---
const calculadora = {
  acumulado: 0,
  // TODO: corrija adicionar para que this.acumulado funcione
  adicionar: (n: number) => {
    calculadora.acumulado += n  // workaround ruim — corrija usando this
  }
}

// --- Bug 4: encadeamento com callbacks ---
class Processador {
  valores: number[] = []

  adicionar(ns: number[]) {
    // TODO: corrija para que this.valores.push funcione no forEach
    ns.forEach(function(n) {
      this.valores.push(n)  // this errado!
    })
    return this
  }
}

// ─── Runner de testes ───────────────────────────────────────────

const timer = new Timer()
timer.tick(); timer.tick(); timer.tick()

calculadora.adicionar(5)
calculadora.adicionar(3)

const proc = new Processador()
try { proc.adicionar([1, 2, 3]) } catch(e) {}

type R = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }
const t = (desc: string, obt: unknown, esp: unknown): R =>
  ({ desc, passou: Object.is(obt, esp), esperado: esp, obtido: obt })

const testes: R[] = [
  t('Bug1: saudarFixo() retorna "Olá, sou Ana"', saudarFixo(), 'Olá, sou Ana'),
  t('Bug2: timer.segundos === 3 após 3 ticks', timer.segundos, 3),
  t('Bug3: calculadora.acumulado === 8', calculadora.acumulado, 8),
  t('Bug4: proc.valores tem 3 elementos', proc.valores.length, 3),
]

const ok = testes.filter(r => r.passou).length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>this keyword — Corrija os Bugs</h2>
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
  'App.tsx': `// SOLUÇÃO: this keyword

const pessoa = {
  nome: 'Ana',
  saudar() { return \`Olá, sou \${this.nome}\` }
}
const saudar = pessoa.saudar
const saudarFixo = saudar.bind(pessoa)  // bind fixa o this

class Timer {
  segundos = 0
  tick() {
    // Solução: arrow function captura o this léxico do método
    const incrementar = () => { this.segundos++ }
    incrementar()
    // Alternativa: .bind(this) ou const self = this
  }
}

const calculadora = {
  acumulado: 0,
  // Solução: usar shorthand de método (não arrow) para que this seja o objeto
  adicionar(n: number) {
    this.acumulado += n
  }
}

class Processador {
  valores: number[] = []
  adicionar(ns: number[]) {
    // Solução 1: arrow function no forEach
    ns.forEach((n) => { this.valores.push(n) })
    // Solução 2: .bind(this) → ns.forEach(function(n) { this.valores.push(n) }.bind(this))
    // Solução 3: segundo argumento do forEach → ns.forEach(function(n) { this.valores.push(n) }, this)
    return this
  }
}

// ─── Runner de testes ───────────────────────────────────────────

const timer = new Timer()
timer.tick(); timer.tick(); timer.tick()

calculadora.adicionar(5)
calculadora.adicionar(3)

const proc = new Processador()
try { proc.adicionar([1, 2, 3]) } catch(e) {}

type R = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }
const t = (desc: string, obt: unknown, esp: unknown): R =>
  ({ desc, passou: Object.is(obt, esp), esperado: esp, obtido: obt })

const testes: R[] = [
  t('Bug1: saudarFixo() retorna "Olá, sou Ana"', saudarFixo(), 'Olá, sou Ana'),
  t('Bug2: timer.segundos === 3 após 3 ticks', timer.segundos, 3),
  t('Bug3: calculadora.acumulado === 8', calculadora.acumulado, 8),
  t('Bug4: proc.valores tem 3 elementos', proc.valores.length, 3),
]

const ok = testes.filter(r => r.passou).length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>this keyword — Corrija os Bugs</h2>
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
  'Bug1: quando você faz `const fn = obj.metodo`, perde o binding. Use `saudar.bind(pessoa)` para criar uma nova função com this fixo.',
  'Bug2: dentro de `tick`, a função `incrementar` usa default binding (this é undefined/global). Troque para arrow function: `const incrementar = () => { this.segundos++ }` — arrow captura o this de tick.',
  'Bug3: arrow functions como propriedades de objeto literal capturam o this do escopo externo (global), não o objeto. Use sintaxe de método: `adicionar(n) { this.acumulado += n }`.',
  'Bug4: no forEach, a callback de função regular perde o this. Use arrow function `ns.forEach((n) => { this.valores.push(n) })`, ou passe this como segundo argumento do forEach.',
]
