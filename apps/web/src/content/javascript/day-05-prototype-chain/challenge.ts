import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `// DESAFIO: Prototype Chain
//
// Implemente herança entre Animal → Cachorro → Labrador
// usando APENAS Object.create() e Object.assign().
// Não use a keyword class nem extends.

// --- Nível 1: Animal ---
const Animal = {
  // TODO: adicione um método 'descrever' que retorna:
  // "Sou um {this.tipo} chamado {this.nome}"
}

// --- Nível 2: Cachorro (herda de Animal) ---
const Cachorro = Object.create(Animal)
// TODO: adicione um método 'latir' que retorna "Au au!"
// TODO: adicione um método 'descrever' que retorna:
// "Sou um cachorro da raça {this.raca} chamado {this.nome}"

// --- Nível 3: Labrador (herda de Cachorro) ---
const Labrador = Object.create(Cachorro)
// TODO: adicione um método 'buscar' que retorna "{this.nome} trouxe a bolinha!"

// --- Factory functions para criar instâncias ---
function criarAnimal(nome: string, tipo: string) {
  // TODO: crie um objeto com Animal como prototype, com nome e tipo
  return {}
}

function criarCachorro(nome: string, raca: string) {
  // TODO: crie um objeto com Cachorro como prototype, com nome e raca
  return {}
}

function criarLabrador(nome: string) {
  // TODO: crie um objeto com Labrador como prototype, com nome e raca='Labrador'
  return {}
}

// ─── Runner de testes ───────────────────────────────────────────

const bicho = criarAnimal('Leão', 'felino')
const dog   = criarCachorro('Rex', 'Vira-lata')
const lab   = criarLabrador('Buddy')

type R = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }
const t = (desc: string, obt: unknown, esp: unknown): R =>
  ({ desc, passou: Object.is(obt, esp), esperado: esp, obtido: obt })

const testes: R[] = [
  t('animal.descrever()',     (bicho as any).descrever?.(),  'Sou um felino chamado Leão'),
  t('dog.latir()',            (dog as any).latir?.(),        'Au au!'),
  t('dog.descrever()',        (dog as any).descrever?.(),    'Sou um cachorro da raça Vira-lata chamado Rex'),
  t('dog herda descrever de Animal também', Animal.isPrototypeOf(dog as object), true),
  t('lab.buscar()',           (lab as any).buscar?.(),       'Buddy trouxe a bolinha!'),
  t('lab.latir() (herdado)',  (lab as any).latir?.(),        'Au au!'),
  t('Labrador.__proto__ === Cachorro', Object.getPrototypeOf(Labrador) === Cachorro, true),
  t('lab é instância da cadeia de Cachorro', Cachorro.isPrototypeOf(lab as object), true),
]

const ok = testes.filter(r => r.passou).length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Prototype Chain</h2>
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
  'App.tsx': `// SOLUÇÃO: Prototype Chain

const Animal = {
  descrever(this: { tipo: string; nome: string }) {
    return \`Sou um \${this.tipo} chamado \${this.nome}\`
  }
}

const Cachorro = Object.create(Animal)
Cachorro.latir = function() { return 'Au au!' }
Cachorro.descrever = function(this: { raca: string; nome: string }) {
  return \`Sou um cachorro da raça \${this.raca} chamado \${this.nome}\`
}

const Labrador = Object.create(Cachorro)
Labrador.buscar = function(this: { nome: string }) {
  return \`\${this.nome} trouxe a bolinha!\`
}

function criarAnimal(nome: string, tipo: string) {
  return Object.assign(Object.create(Animal), { nome, tipo })
}

function criarCachorro(nome: string, raca: string) {
  return Object.assign(Object.create(Cachorro), { nome, raca })
}

function criarLabrador(nome: string) {
  return Object.assign(Object.create(Labrador), { nome, raca: 'Labrador' })
}

// ─── Runner de testes ───────────────────────────────────────────

const bicho = criarAnimal('Leão', 'felino')
const dog   = criarCachorro('Rex', 'Vira-lata')
const lab   = criarLabrador('Buddy')

type R = { desc: string; passou: boolean; esperado: unknown; obtido: unknown }
const t = (desc: string, obt: unknown, esp: unknown): R =>
  ({ desc, passou: Object.is(obt, esp), esperado: esp, obtido: obt })

const testes: R[] = [
  t('animal.descrever()',     (bicho as any).descrever?.(),  'Sou um felino chamado Leão'),
  t('dog.latir()',            (dog as any).latir?.(),        'Au au!'),
  t('dog.descrever()',        (dog as any).descrever?.(),    'Sou um cachorro da raça Vira-lata chamado Rex'),
  t('dog herda descrever de Animal também', Animal.isPrototypeOf(dog as object), true),
  t('lab.buscar()',           (lab as any).buscar?.(),       'Buddy trouxe a bolinha!'),
  t('lab.latir() (herdado)',  (lab as any).latir?.(),        'Au au!'),
  t('Labrador.__proto__ === Cachorro', Object.getPrototypeOf(Labrador) === Cachorro, true),
  t('lab é instância da cadeia de Cachorro', Cachorro.isPrototypeOf(lab as object), true),
]

const ok = testes.filter(r => r.passou).length

export default function App() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 24, background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>
      <h2 style={{ color: '#f0c040', marginBottom: 4 }}>Prototype Chain</h2>
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
  'Para adicionar métodos ao objeto: `Animal.descrever = function() { return \`Sou um \${this.tipo}...\` }`. Note que deve ser function (não arrow) para que this seja dinâmico.',
  'Para criarAnimal: use `Object.create(Animal)` para criar um objeto com Animal como prototype, depois `Object.assign` ou atribuição direta para definir nome e tipo.',
  'Para criar a instância: `Object.assign(Object.create(Cachorro), { nome, raca })` — cria objeto com prototype Cachorro e adiciona as propriedades próprias.',
  '`Object.getPrototypeOf(Labrador) === Cachorro` deve ser true — garanta que `Object.create(Cachorro)` foi usado para criar Labrador.',
]
