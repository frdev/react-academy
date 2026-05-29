import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `// DESAFIO: Composition Pattern
//
// O componente Card abaixo sofre de "prop explosion" — tem props demais.
// Cada nova variação requer mais props, e o componente fica cada vez mais
// difícil de manter e usar.
//
// TODO: Refatore usando composição:
// 1. Crie subcomponentes: CardHeader, CardContent, CardFooter
// 2. Card deve aceitar apenas 'children' (e talvez 'className')
// 3. Quem usa o Card decide o que vai dentro — sem props de conteúdo
//
// DICA: "Favor composition over configuration."
//       Props controlam comportamento, children controlam estrutura.

interface CardProps {
  title: string
  subtitle?: string
  content: string
  footer?: string
  hasButton?: boolean
  buttonText?: string
  onButtonClick?: () => void
  variant?: 'default' | 'featured'
  imageUrl?: string
  badge?: string
}

// ← Este componente já tem muitos props. Imagina quando precisar
//   de mais variações: hasSecondButton, footerIcon, titleColor...
function Card({
  title,
  subtitle,
  content,
  footer,
  hasButton,
  buttonText = 'Saiba mais',
  onButtonClick,
  variant = 'default',
  imageUrl,
  badge,
}: CardProps) {
  return (
    <div style={{
      border: variant === 'featured' ? '2px solid #6366f1' : '1px solid #e5e7eb',
      borderRadius: 12,
      overflow: 'hidden',
      maxWidth: 320,
      fontFamily: 'sans-serif',
      boxShadow: variant === 'featured' ? '0 4px 24px #6366f133' : '0 1px 4px #0001',
    }}>
      {imageUrl && (
        <img src={imageUrl} alt={title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
      )}
      <div style={{ padding: 20 }}>
        {badge && (
          <span style={{ background: '#6366f1', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 'bold' }}>
            {badge}
          </span>
        )}
        <h3 style={{ margin: '8px 0 4px', fontSize: 18 }}>{title}</h3>
        {subtitle && <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 12px' }}>{subtitle}</p>}
        <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{content}</p>
      </div>
      {(footer || hasButton) && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {footer && <span style={{ fontSize: 13, color: '#9ca3af' }}>{footer}</span>}
          {hasButton && (
            <button onClick={onButtonClick} style={{ padding: '6px 14px', cursor: 'pointer', borderRadius: 6, border: 'none', background: '#6366f1', color: '#fff' }}>
              {buttonText}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div style={{ padding: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Card
        title="React Fundamentals"
        subtitle="Semana 1"
        content="Aprenda como o React renderiza componentes e gerencia estado."
        footer="45 min"
        hasButton
        buttonText="Começar"
        onButtonClick={() => alert('Iniciando!')}
        variant="featured"
        badge="NOVO"
      />
      <Card
        title="TypeScript Básico"
        content="Tipos, interfaces e generics para código mais seguro."
        footer="30 min"
        hasButton
      />
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `import { ReactNode } from 'react'

// SOLUÇÃO: Composition Pattern
//
// Ao invés de um componente monolítico com muitos props,
// criamos subcomponentes menores que o pai compõe livremente.
//
// Vantagens:
// - Flexibilidade: o pai decide exatamente o que renderizar
// - Sem prop explosion: nenhum componente cresce indefinidamente
// - Legibilidade: a estrutura do JSX reflete a estrutura visual
// - Reutilização: CardHeader, CardContent, CardFooter são independentes

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'featured'
  className?: string
}

// ✓ Card só precisa saber sobre layout/estilo — não conteúdo
function Card({ children, variant = 'default' }: CardProps) {
  return (
    <div style={{
      border: variant === 'featured' ? '2px solid #6366f1' : '1px solid #e5e7eb',
      borderRadius: 12,
      overflow: 'hidden',
      maxWidth: 320,
      fontFamily: 'sans-serif',
      boxShadow: variant === 'featured' ? '0 4px 24px #6366f133' : '0 1px 4px #0001',
    }}>
      {children}
    </div>
  )
}

// ✓ Subcomponentes focados em uma responsabilidade
function CardImage({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
}

function CardHeader({ children }: { children: ReactNode }) {
  return <div style={{ padding: '20px 20px 0' }}>{children}</div>
}

function CardBadge({ children }: { children: ReactNode }) {
  return (
    <span style={{ background: '#6366f1', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 'bold' }}>
      {children}
    </span>
  )
}

function CardTitle({ children }: { children: ReactNode }) {
  return <h3 style={{ margin: '8px 0 4px', fontSize: 18 }}>{children}</h3>
}

function CardSubtitle({ children }: { children: ReactNode }) {
  return <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 12px' }}>{children}</p>
}

function CardContent({ children }: { children: ReactNode }) {
  return <div style={{ padding: 20 }}>{children}</div>
}

function CardFooter({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {children}
    </div>
  )
}

// ✓ Uso: o pai decide a estrutura — total flexibilidade sem mais props
export default function App() {
  return (
    <div style={{ padding: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Card variant="featured">
        <CardHeader>
          <CardBadge>NOVO</CardBadge>
          <CardTitle>React Fundamentals</CardTitle>
          <CardSubtitle>Semana 1</CardSubtitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Aprenda como o React renderiza componentes e gerencia estado.
          </p>
        </CardContent>
        <CardFooter>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>45 min</span>
          <button onClick={() => alert('Iniciando!')} style={{ padding: '6px 14px', cursor: 'pointer', borderRadius: 6, border: 'none', background: '#6366f1', color: '#fff' }}>
            Começar
          </button>
        </CardFooter>
      </Card>

      <Card>
        <CardContent>
          <CardTitle>TypeScript Básico</CardTitle>
          <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Tipos, interfaces e generics para código mais seguro.
          </p>
        </CardContent>
        <CardFooter>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>30 min</span>
          <button style={{ padding: '6px 14px', cursor: 'pointer', borderRadius: 6, border: 'none', background: '#6366f1', color: '#fff' }}>
            Saiba mais
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
`,
}

export const hints = [
  'Quantos props esse componente tem? O que acontece quando precisar de mais variações — mais botões, ícones, cores?',
  'Passe `children` ao invés de `content`. O pai decide o que vai dentro do Card — sem prop `title`, `subtitle`, `content`.',
  'Crie `CardHeader`, `CardContent`, `CardFooter` como componentes separados que aceitam `children`. Card só precisa de `children` e talvez `variant`.',
]
