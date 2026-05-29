import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `import { useState } from 'react'

// DESAFIO: Render Cycle
//
// Este componente tem um bug clássico: o contador NÃO está usando
// o sistema de estado do React, então a UI nunca atualiza.
//
// TODO: Corrija o componente para que:
// 1. O contador exiba o valor correto na tela
// 2. Cada clique no botão incremente o contador
// 3. A UI atualize automaticamente a cada incremento
//
// DICA: O que trigera um re-render no React?

let counter = 0  // ← problema aqui

export default function App() {
  const increment = () => {
    counter++
    console.log('Counter:', counter)  // funciona no console...
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Contador: {counter}</h2>
      <button onClick={increment} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Incrementar
      </button>
      <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
        Por que a UI não atualiza?
      </p>
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `import { useState } from 'react'

// SOLUÇÃO: Render Cycle
//
// O problema era usar uma variável let comum (counter) ao invés de
// estado React (useState). Variáveis comuns não estão conectadas
// ao sistema de reatividade do React — quando mudam, o React não
// sabe que precisa re-renderizar.
//
// useState armazena o valor dentro do mecanismo interno do React,
// e cada chamada ao setter TRIGERA um novo ciclo de render.

export default function App() {
  const [counter, setCounter] = useState(0)

  const increment = () => {
    setCounter(prev => prev + 1)  // ← o setter trigera o re-render
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>Contador: {counter}</h2>
      <button onClick={increment} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Incrementar
      </button>
      <p style={{ color: '#4ade80', fontSize: 14, marginTop: 8 }}>
        ✓ Agora a UI atualiza porque useState trigera re-renders
      </p>
    </div>
  )
}
`,
}

export const hints = [
  'O que é diferente entre uma variável `let` e o que `useState` retorna?',
  'Tente importar `useState` do React e substituir `let counter = 0` por `const [counter, setCounter] = useState(0)`.',
  'Use `setCounter(prev => prev + 1)` dentro do `increment` — e remova a linha `counter++`.',
]
