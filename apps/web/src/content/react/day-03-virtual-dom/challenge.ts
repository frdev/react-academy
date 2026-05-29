import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `// DESAFIO: Virtual DOM
//
// Este componente usa dangerouslySetInnerHTML desnecessariamente e
// tem um bug de renderização condicional: quando type="warning",
// deveria mostrar um texto em laranja, mas mostra o padrão.
//
// TODO: Corrija o componente para que:
// 1. Remova o uso de dangerouslySetInnerHTML (use JSX puro)
// 2. Renderize corretamente com base no prop 'type'
// 3. Use operadores JSX padrão para renderização condicional
//
// DICA: O React sabe comparar elementos JSX eficientemente — não
// precisamos de innerHTML para nada que o JSX já faz melhor.

type AlertType = 'info' | 'warning' | 'error' | 'success'

interface AlertProps {
  type: AlertType
  message: string
}

const styles: Record<AlertType, { background: string; color: string; border: string }> = {
  info:    { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' },
  warning: { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' },
  error:   { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
  success: { background: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
}

const icons: Record<AlertType, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  success: '✅',
}

function Alert({ type, message }: AlertProps) {
  const style = styles[type]

  // BUG: usando dangerouslySetInnerHTML desnecessariamente
  // e a lógica condicional está quebrada
  const icon = type === 'info' ? icons.info
    : type === 'error' ? icons.error
    : type === 'success' ? icons.success
    : null  // ← BUG: esqueceu o caso 'warning'!

  return (
    <div style={{ ...style, padding: '12px 16px', borderRadius: 8, marginBottom: 8, display: 'flex', gap: 8 }}>
      {/* BUG: usando innerHTML para renderizar o ícone */}
      <span dangerouslySetInnerHTML={{ __html: icon ?? '?' }} />
      <span dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  )
}

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16 }}>Sistema de Alertas</h2>
      <Alert type="success" message="Operação concluída com sucesso!" />
      <Alert type="info" message="Sua sessão expira em 30 minutos." />
      <Alert type="warning" message="Espaço em disco quase cheio." />
      <Alert type="error" message="Falha ao salvar o arquivo." />
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `// SOLUÇÃO: Virtual DOM
//
// Problemas corrigidos:
// 1. dangerouslySetInnerHTML removido — o JSX já renderiza strings
//    diretamente de forma segura. Além de desnecessário, innerHTML
//    desabilita as proteções XSS do React.
//
// 2. A renderização condicional do ícone estava incompleta —
//    o caso 'warning' retornava null. Corrigido usando o objeto
//    icons diretamente com a key do tipo.
//
// O Virtual DOM do React é eficiente: ele compara o JSX anterior
// com o novo e atualiza apenas o que mudou no DOM real.

type AlertType = 'info' | 'warning' | 'error' | 'success'

interface AlertProps {
  type: AlertType
  message: string
}

const styles: Record<AlertType, { background: string; color: string; border: string }> = {
  info:    { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' },
  warning: { background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' },
  error:   { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
  success: { background: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
}

const icons: Record<AlertType, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  success: '✅',
}

function Alert({ type, message }: AlertProps) {
  const style = styles[type]

  // ✓ Usando o objeto icons diretamente — sem switch, sem bugs de omissão
  const icon = icons[type]

  return (
    <div style={{ ...style, padding: '12px 16px', borderRadius: 8, marginBottom: 8, display: 'flex', gap: 8 }}>
      {/* ✓ JSX renderiza strings diretamente — sem dangerouslySetInnerHTML */}
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 400 }}>
      <h2 style={{ marginBottom: 16 }}>Sistema de Alertas</h2>
      <Alert type="success" message="Operação concluída com sucesso!" />
      <Alert type="info" message="Sua sessão expira em 30 minutos." />
      <Alert type="warning" message="Espaço em disco quase cheio." />
      <Alert type="error" message="Falha ao salvar o arquivo." />
    </div>
  )
}
`,
}

export const hints = [
  'Você realmente precisa de `dangerouslySetInnerHTML` para renderizar uma string ou emoji?',
  'O React sabe comparar elementos JSX eficientemente — use `{icon}` e `{message}` diretamente no JSX.',
  'Para o bug do ícone: ao invés de uma cadeia de ternários que pode esquecer casos, use `icons[type]` para acessar o ícone diretamente pelo tipo.',
]
