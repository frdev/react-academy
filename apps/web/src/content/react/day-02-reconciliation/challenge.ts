import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `import { useState } from 'react'

// DESAFIO: Reconciliation & Keys
//
// Este componente usa o ÍNDICE do array como key.
// Isso causa um bug: ao reordenar os itens, os inputs
// ficam "grudados" na posição errada.
//
// TODO: Corrija o problema para que:
// 1. Cada item tenha uma chave estável (não baseada no índice)
// 2. Ao embaralhar, os inputs se movam junto com o item correto
//
// DICA: O que o React usa para identificar um elemento entre renders?

const initialItems = [
  { label: 'React', color: '#61dafb' },
  { label: 'TypeScript', color: '#3178c6' },
  { label: 'Vite', color: '#646cff' },
  { label: 'Tailwind', color: '#06b6d4' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function App() {
  const [items, setItems] = useState(initialItems)

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16 }}>Lista de Tecnologias</h2>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
        {items.map((item, index) => (
          // ← BUG: usando index como key!
          <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              background: item.color,
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 4,
              minWidth: 100,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
              {item.label}
            </span>
            <input
              placeholder=\`Nota sobre \${item.label}\`
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', flex: 1 }}
            />
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        1. Digite algo nos inputs<br/>
        2. Clique "Embaralhar"<br/>
        3. Observe os inputs ficarem na posição errada!
      </p>
      <button
        onClick={() => setItems(shuffle(items))}
        style={{ padding: '8px 16px', cursor: 'pointer' }}
      >
        Embaralhar
      </button>
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `import { useState } from 'react'

// SOLUÇÃO: Reconciliation & Keys
//
// O problema era usar o índice do array como key. O React usa a key
// para identificar elementos entre renders. Quando os itens mudam
// de posição, as keys (índices) também mudam — o React pensa que
// é um elemento diferente e reutiliza o DOM do antigo, incluindo
// o estado do input.
//
// Com IDs estáveis, o React rastreia cada elemento corretamente
// e move o DOM junto com o item, incluindo o que está no input.

// ✓ Adicionamos um campo id único para cada item
const initialItems = [
  { id: 'react', label: 'React', color: '#61dafb' },
  { id: 'typescript', label: 'TypeScript', color: '#3178c6' },
  { id: 'vite', label: 'Vite', color: '#646cff' },
  { id: 'tailwind', label: 'Tailwind', color: '#06b6d4' },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function App() {
  const [items, setItems] = useState(initialItems)

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16 }}>Lista de Tecnologias</h2>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
        {items.map((item) => (
          // ✓ Usando item.id como key — estável e único
          <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              background: item.color,
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 4,
              minWidth: 100,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
              {item.label}
            </span>
            <input
              placeholder=\`Nota sobre \${item.label}\`
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', flex: 1 }}
            />
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 13, color: '#4ade80', marginBottom: 8 }}>
        ✓ Agora os inputs se movem com o item correto ao embaralhar!
      </p>
      <button
        onClick={() => setItems(shuffle(items))}
        style={{ padding: '8px 16px', cursor: 'pointer' }}
      >
        Embaralhar
      </button>
    </div>
  )
}
`,
}

export const hints = [
  'Por que o React usa `key` para identificar elementos em listas?',
  'O que acontece quando o `key` muda para um elemento — o React reutiliza ou recria o componente?',
  'Adicione um campo `id` em cada item (ex: `id: "react"`) e use `item.id` como key ao invés de `index`.',
]
