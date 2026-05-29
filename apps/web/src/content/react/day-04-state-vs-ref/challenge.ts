import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `import { useState, useEffect } from 'react'

// DESAFIO: State vs Ref — Cronômetro
//
// Este cronômetro tem dois bugs relacionados ao uso incorreto de estado:
//
// BUG 1: O ID do intervalo é guardado em useState. Isso causa re-renders
//        desnecessários quando o intervalo é criado/destruído.
//
// BUG 2: A função stop() usa uma closure stale — ela captura o valor
//        inicial de intervalId (null) e nunca consegue parar o intervalo.
//
// TODO: Corrija o componente para que:
// 1. O ID do intervalo seja armazenado em useRef (não useState)
// 2. O start/stop funcione corretamente sem bugs de closure
// 3. O display de segundos atualize normalmente na tela
//
// DICA: useState para o que o usuário VÊ, useRef para o que você
//       precisa GUARDAR entre renders sem causar re-render.

export default function App() {
  const [seconds, setSeconds] = useState(0)
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null)  // ← problema
  const [running, setRunning] = useState(false)

  const start = () => {
    if (running) return
    setRunning(true)
    const id = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    setIntervalId(id)  // ← re-render desnecessário aqui
  }

  const stop = () => {
    // BUG: intervalId aqui é sempre null (closure stale)!
    // useState não garante o valor mais recente na closure
    clearInterval(intervalId!)
    setRunning(false)
  }

  const reset = () => {
    clearInterval(intervalId!)
    setSeconds(0)
    setRunning(false)
    setIntervalId(null)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return \`\${m}:\${s}\`
  }

  return (
    <div style={{ padding: 24, fontFamily: 'monospace', textAlign: 'center' }}>
      <h1 style={{ fontSize: 64, letterSpacing: 4, margin: '16px 0' }}>
        {formatTime(seconds)}
      </h1>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={start}
          disabled={running}
          style={{ padding: '10px 24px', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}
        >
          Iniciar
        </button>
        <button
          onClick={stop}
          disabled={!running}
          style={{ padding: '10px 24px', cursor: !running ? 'not-allowed' : 'pointer', opacity: !running ? 0.5 : 1 }}
        >
          Parar
        </button>
        <button
          onClick={reset}
          style={{ padding: '10px 24px', cursor: 'pointer' }}
        >
          Resetar
        </button>
      </div>
      {running && (
        <p style={{ color: '#f59e0b', marginTop: 16, fontSize: 13 }}>
          ⚠️ Tente parar o cronômetro — funciona?
        </p>
      )}
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `import { useState, useRef } from 'react'

// SOLUÇÃO: State vs Ref — Cronômetro
//
// Correções aplicadas:
//
// 1. intervalId agora usa useRef ao invés de useState.
//    O ref sempre aponta para o valor mais recente, sem causar
//    re-renders quando muda — perfeito para armazenar o ID do intervalo.
//
// 2. Como intervalRef.current é sempre atualizado (mutação direta),
//    a função stop() lê o valor correto mesmo dentro de closures.
//
// Regra prática:
// - useState → valores que afetam o que o usuário VÊ na tela
// - useRef  → valores que você precisa GUARDAR entre renders
//             sem precisar re-renderizar (ex: IDs, referências DOM)

export default function App() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  // ✓ useRef para o ID do intervalo — sem re-render, sem stale closure
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    if (running) return
    setRunning(true)
    // ✓ Atribuição direta ao ref — não causa re-render
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
  }

  const stop = () => {
    // ✓ intervalRef.current sempre tem o valor mais recente
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSeconds(0)
    setRunning(false)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return \`\${m}:\${s}\`
  }

  return (
    <div style={{ padding: 24, fontFamily: 'monospace', textAlign: 'center' }}>
      <h1 style={{ fontSize: 64, letterSpacing: 4, margin: '16px 0' }}>
        {formatTime(seconds)}
      </h1>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={start}
          disabled={running}
          style={{ padding: '10px 24px', cursor: running ? 'not-allowed' : 'pointer', opacity: running ? 0.5 : 1 }}
        >
          Iniciar
        </button>
        <button
          onClick={stop}
          disabled={!running}
          style={{ padding: '10px 24px', cursor: !running ? 'not-allowed' : 'pointer', opacity: !running ? 0.5 : 1 }}
        >
          Parar
        </button>
        <button
          onClick={reset}
          style={{ padding: '10px 24px', cursor: 'pointer' }}
        >
          Resetar
        </button>
      </div>
      <p style={{ color: '#4ade80', marginTop: 16, fontSize: 13 }}>
        ✓ Agora o stop() funciona — useRef não tem problema de stale closure!
      </p>
    </div>
  )
}
`,
}

export const hints = [
  'O ID do intervalo (retornado por `setInterval`) precisa causar um re-render quando muda?',
  'Use `useRef` para armazenar valores mutáveis que não devem causar re-render: `const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)`.',
  'Ao usar ref, leia e escreva via `intervalRef.current`. Isso não cria stale closures — o ref sempre aponta para o valor atual.',
]
