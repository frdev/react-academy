import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `import { useState } from 'react'

// DESAFIO: Controlled vs Uncontrolled
//
// Este formulário mistura os dois padrões e está bugado:
// - Os campos têm "value" mas sem "onChange" → inputs travados (read-only)
// - O submit tenta ler de estado que nunca atualiza
//
// TODO: Escolha UMA das abordagens e corrija o formulário:
//
// OPÇÃO A — Controlled (recomendada):
//   useState para cada campo + value={state} + onChange={e => setState(e.target.value)}
//
// OPÇÃO B — Uncontrolled:
//   Remova o value, use defaultValue + useRef, leia com ref.current?.value no submit
//
// DICA: Um input com 'value' mas sem 'onChange' é read-only para o usuário.
//       O React avisa no console quando isso acontece.

export default function App() {
  // Estado existe, mas nunca é atualizado!
  const [name, setName] = useState('João')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(\`Nome: \${name} | Email: \${email} | Mensagem: \${message}\`)
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h2>Formulário de Contato</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Nome</label>
          {/* BUG: value sem onChange — o input fica travado! */}
          <input
            value={name}
            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Email</label>
          {/* BUG: mesmo problema */}
          <input
            type="email"
            value={email}
            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Mensagem</label>
          {/* BUG: mesmo problema */}
          <textarea
            value={message}
            rows={4}
            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>
      {submitted && (
        <div style={{ marginTop: 16, padding: 12, background: '#dcfce7', borderRadius: 8, fontSize: 13 }}>
          <strong>Enviado:</strong> {submitted}
        </div>
      )}
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `import { useState } from 'react'

// SOLUÇÃO: Controlled vs Uncontrolled — Opção A (Controlled)
//
// Um input controlled tem TRÊS partes obrigatórias:
// 1. Estado: const [value, setValue] = useState('')
// 2. value={value} — React controla o que aparece no input
// 3. onChange={e => setValue(e.target.value)} — atualiza o estado ao digitar
//
// Sem o onChange, o React mantém o input com o valor do estado (que não muda)
// tornando-o efetivamente read-only — mesmo que o usuário tente digitar.
//
// ALTERNATIVA (Uncontrolled) estaria nos comentários abaixo.

export default function App() {
  const [name, setName] = useState('João')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(\`Nome: \${name} | Email: \${email} | Mensagem: \${message}\`)
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h2>Formulário de Contato</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Nome</label>
          {/* ✓ Controlled: value + onChange */}
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Email</label>
          {/* ✓ Controlled: value + onChange */}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Mensagem</label>
          {/* ✓ Controlled: value + onChange */}
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>
      {submitted && (
        <div style={{ marginTop: 16, padding: 12, background: '#dcfce7', borderRadius: 8, fontSize: 13 }}>
          <strong>Enviado:</strong> {submitted}
        </div>
      )}
      <p style={{ fontSize: 12, color: '#888', marginTop: 12 }}>
        💡 Alternativa uncontrolled: use defaultValue + useRef, leia com ref.current?.value no submit.
      </p>
    </div>
  )
}
`,
}

export const hints = [
  'Um input com `value` mas sem `onChange` é read-only para o usuário — o React avisa sobre isso no console.',
  'Escolha: controlled (`useState` + `value` + `onChange`) ou uncontrolled (`defaultValue` + `useRef`).',
  'Controlled: adicione `onChange={e => setName(e.target.value)}` em cada input. Uncontrolled: troque `value` por `defaultValue` e use `useRef` para ler no submit.',
]
