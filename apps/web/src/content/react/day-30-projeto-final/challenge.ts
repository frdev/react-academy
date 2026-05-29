import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `import { Suspense, lazy } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { UserList } from './UserList'
import { ErrorBoundary } from './ErrorBoundary'

// TODO 5: Lazy-load o UserForm usando React.lazy + Suspense
// const UserForm = lazy(() => import('./UserForm'))
import { UserForm } from './UserForm'

export default function App() {
  return (
    <ThemeProvider>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1>React Patterns Showcase</h1>

        {/* TODO 6: Envolver UserForm em ErrorBoundary + Suspense */}
        <UserForm />

        <ErrorBoundary fallback={<p style={{ color: 'red' }}>Erro ao carregar lista.</p>}>
          <Suspense fallback={<p>Carregando usuários...</p>}>
            <UserList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  )
}
`,
  'ThemeProvider.tsx': `import { createContext, useContext, useState, memo, ReactNode } from 'react'

interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}

// TODO 1: O ThemeProvider está re-renderizando todos os filhos quando o tema muda.
// Separe o value em um objeto estável ou use useMemo para evitar re-renders desnecessários.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{
        background: theme === 'dark' ? '#111' : '#fff',
        color: theme === 'dark' ? '#eee' : '#111',
        minHeight: '100vh',
        padding: 24,
        transition: 'background 0.2s',
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// TODO 1b: Este botão re-renderiza toda vez que o ThemeProvider re-renderiza.
// Envolva-o em React.memo para protegê-lo.
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} style={{ padding: '6px 14px', cursor: 'pointer' }}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
`,
  'UserList.tsx': `import { useReducer } from 'react'
import { useUsers } from './useUsers'
import { useTheme } from './ThemeProvider'
import { ThemeToggle } from './ThemeProvider'

// TODO 2: Implemente o reducer para gerenciar filtros de usuários.
// O estado deve ter: { search: string; role: 'all' | 'admin' | 'user' }
// As actions devem ser: SET_SEARCH e SET_ROLE
type FilterState = { search: string; role: 'all' | 'admin' | 'user' }
type FilterAction = { type: 'SET_SEARCH'; payload: string } | { type: 'SET_ROLE'; payload: FilterState['role'] }

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  // TODO: implementar o reducer
  return state
}

const initialFilter: FilterState = { search: '', role: 'all' }

export function UserList() {
  const { theme } = useTheme()
  const [filter, dispatch] = useReducer(filterReducer, initialFilter)
  const { data: users = [], isLoading } = useUsers()

  // TODO 3: Filtre os usuários usando filter.search e filter.role
  const filtered = users

  if (isLoading) return <p>Carregando...</p>

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <input
          placeholder="Buscar usuário..."
          value={filter.search}
          onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #444', background: 'transparent', color: 'inherit' }}
        />
        <select
          value={filter.role}
          onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value as FilterState['role'] })}
          style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #444', background: 'transparent', color: 'inherit' }}
        >
          <option value="all">Todos</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <ThemeToggle />
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {filtered.map(user => (
          <div key={user.id} style={{
            padding: 12,
            borderRadius: 8,
            border: \`1px solid \${theme === 'dark' ? '#333' : '#ddd'}\`,
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div>
              <strong>{user.name}</strong>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>{user.email}</p>
            </div>
            <span style={{
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 12,
              background: user.role === 'admin' ? '#7c3aed' : '#374151',
            }}>
              {user.role}
            </span>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ opacity: 0.5 }}>Nenhum usuário encontrado.</p>}
      </div>
    </div>
  )
}
`,
  'UserForm.tsx': `import { useState } from 'react'

// TODO 4: Implemente validação básica com React Hook Form + Zod
// Por enquanto, o formulário usa estado local sem validação.
// Substitua por useForm do react-hook-form com schema Zod:
// - name: string, min 2 chars
// - email: string, email válido
// - role: 'admin' | 'user'

interface FormData {
  name: string
  email: string
  role: 'admin' | 'user'
}

export function UserForm() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', role: 'user' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted:', form)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
      <h2 style={{ margin: 0 }}>Adicionar Usuário</h2>
      <input
        placeholder="Nome"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        required
        style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #444', background: 'transparent', color: 'inherit' }}
      />
      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        required
        style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #444', background: 'transparent', color: 'inherit' }}
      />
      <select
        value={form.role}
        onChange={e => setForm(f => ({ ...f, role: e.target.value as 'admin' | 'user' }))}
        style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #444', background: 'transparent', color: 'inherit' }}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 4 }}>
        {submitted ? '✓ Adicionado!' : 'Adicionar'}
      </button>
    </form>
  )
}
`,
  'useUsers.ts': `import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

// Simula TanStack Query com um hook customizado
// TODO 7: Substitua este hook por useQuery do TanStack Query
export function useUsers() {
  const [data, setData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula fetch com delay
    const timeout = setTimeout(() => {
      setData([
        { id: 1, name: 'Ana Silva', email: 'ana@example.com', role: 'admin' },
        { id: 2, name: 'Bruno Costa', email: 'bruno@example.com', role: 'user' },
        { id: 3, name: 'Carla Dias', email: 'carla@example.com', role: 'user' },
        { id: 4, name: 'Daniel Rocha', email: 'daniel@example.com', role: 'admin' },
        { id: 5, name: 'Eva Martins', email: 'eva@example.com', role: 'user' },
      ])
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timeout)
  }, [])

  return { data, isLoading }
}
`,
  'ErrorBoundary.tsx': `import { Component, ErrorInfo, ReactNode } from 'react'

// TODO 6b: Este ErrorBoundary captura erros em filhos React.
// Não precisa modificar — entenda como ele funciona:
// - componentDidCatch é chamado quando um filho joga um erro
// - getDerivedStateFromError atualiza o state para mostrar o fallback

interface Props {
  children: ReactNode
  fallback: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `import { Suspense, lazy } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { UserList } from './UserList'
import { ErrorBoundary } from './ErrorBoundary'

// TODO 5 RESOLVIDO: UserForm lazy-loaded
const UserForm = lazy(() => import('./UserForm').then(m => ({ default: m.UserForm })))

export default function App() {
  return (
    <ThemeProvider>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
        <h1>React Patterns Showcase</h1>

        {/* TODO 6 RESOLVIDO: ErrorBoundary + Suspense em volta do UserForm */}
        <ErrorBoundary fallback={<p style={{ color: 'red' }}>Erro no formulário.</p>}>
          <Suspense fallback={<p>Carregando formulário...</p>}>
            <UserForm />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<p style={{ color: 'red' }}>Erro ao carregar lista.</p>}>
          <Suspense fallback={<p>Carregando usuários...</p>}>
            <UserList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  )
}
`,
  'ThemeProvider.tsx': `import { createContext, useContext, useState, useMemo, memo, useCallback, ReactNode } from 'react'

interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}

// SOLUÇÃO TODO 1: useMemo para value estável — evita re-renders desnecessários
// nos consumers quando o componente pai re-renderiza por outros motivos.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      <div style={{
        background: theme === 'dark' ? '#111' : '#fff',
        color: theme === 'dark' ? '#eee' : '#111',
        minHeight: '100vh',
        padding: 24,
        transition: 'background 0.2s',
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// SOLUÇÃO TODO 1b: React.memo protege ThemeToggle de re-renders do pai
export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} style={{ padding: '6px 14px', cursor: 'pointer' }}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
})
`,
  'UserList.tsx': `import { useReducer } from 'react'
import { useUsers } from './useUsers'
import { useTheme } from './ThemeProvider'
import { ThemeToggle } from './ThemeProvider'

type FilterState = { search: string; role: 'all' | 'admin' | 'user' }
type FilterAction = { type: 'SET_SEARCH'; payload: string } | { type: 'SET_ROLE'; payload: FilterState['role'] }

// SOLUÇÃO TODO 2: Reducer implementado com switch/case
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH': return { ...state, search: action.payload }
    case 'SET_ROLE': return { ...state, role: action.payload }
    default: return state
  }
}

const initialFilter: FilterState = { search: '', role: 'all' }

export function UserList() {
  const { theme } = useTheme()
  const [filter, dispatch] = useReducer(filterReducer, initialFilter)
  const { data: users = [], isLoading } = useUsers()

  // SOLUÇÃO TODO 3: Filtro aplicado com search + role
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(filter.search.toLowerCase())
      || u.email.toLowerCase().includes(filter.search.toLowerCase())
    const matchRole = filter.role === 'all' || u.role === filter.role
    return matchSearch && matchRole
  })

  if (isLoading) return <p>Carregando...</p>

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <input
          placeholder="Buscar usuário..."
          value={filter.search}
          onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          style={{ flex: 1, padding: '6px 12px', borderRadius: 4, border: '1px solid #444', background: 'transparent', color: 'inherit' }}
        />
        <select
          value={filter.role}
          onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value as FilterState['role'] })}
          style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #444', background: 'transparent', color: 'inherit' }}
        >
          <option value="all">Todos</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <ThemeToggle />
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {filtered.map(user => (
          <div key={user.id} style={{
            padding: 12,
            borderRadius: 8,
            border: \`1px solid \${theme === 'dark' ? '#333' : '#ddd'}\`,
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div>
              <strong>{user.name}</strong>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>{user.email}</p>
            </div>
            <span style={{
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 12,
              background: user.role === 'admin' ? '#7c3aed' : '#374151',
            }}>
              {user.role}
            </span>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ opacity: 0.5 }}>Nenhum usuário encontrado.</p>}
      </div>
    </div>
  )
}
`,
  'UserForm.tsx': `import { useState } from 'react'

// SOLUÇÃO TODO 4: Validação básica implementada
// (Em produção: react-hook-form + zod. Aqui: validação manual para funcionar no Sandpack)

interface FormData {
  name: string
  email: string
  role: 'admin' | 'user'
}

interface FormErrors {
  name?: string
  email?: string
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (data.name.length < 2) errors.name = 'Nome deve ter ao menos 2 caracteres'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Email inválido'
  return errors
}

export function UserForm() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', role: 'user' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    console.log('Submitted:', form)
    setSubmitted(true)
    setForm({ name: '', email: '', role: 'user' })
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
      <h2 style={{ margin: 0 }}>Adicionar Usuário</h2>
      <div>
        <input
          placeholder="Nome"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 4, border: \`1px solid \${errors.name ? '#ef4444' : '#444'}\`, background: 'transparent', color: 'inherit' }}
        />
        {errors.name && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.name}</p>}
      </div>
      <div>
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 4, border: \`1px solid \${errors.email ? '#ef4444' : '#444'}\`, background: 'transparent', color: 'inherit' }}
        />
        {errors.email && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#ef4444' }}>{errors.email}</p>}
      </div>
      <select
        value={form.role}
        onChange={e => setForm(f => ({ ...f, role: e.target.value as 'admin' | 'user' }))}
        style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #444', background: 'transparent', color: 'inherit' }}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 4 }}>
        {submitted ? '✓ Adicionado!' : 'Adicionar'}
      </button>
    </form>
  )
}
`,
  'useUsers.ts': `import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export function useUsers() {
  const [data, setData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setData([
        { id: 1, name: 'Ana Silva', email: 'ana@example.com', role: 'admin' },
        { id: 2, name: 'Bruno Costa', email: 'bruno@example.com', role: 'user' },
        { id: 3, name: 'Carla Dias', email: 'carla@example.com', role: 'user' },
        { id: 4, name: 'Daniel Rocha', email: 'daniel@example.com', role: 'admin' },
        { id: 5, name: 'Eva Martins', email: 'eva@example.com', role: 'user' },
      ])
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timeout)
  }, [])

  return { data, isLoading }
}
`,
  'ErrorBoundary.tsx': `import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
`,
}

export const hints = [
  'TODO 1: Use useMemo para estabilizar o value do ThemeContext e useCallback para toggleTheme, evitando que todos os consumers re-renderizem quando o pai re-renderiza por outros motivos.',
  'TODO 2: Implemente o filterReducer com um switch/case para SET_SEARCH e SET_ROLE — cada case retorna o state anterior com a propriedade atualizada via spread.',
  'TODO 3: Use Array.filter() encadeando dois predicados: um para search (name ou email inclui o texto) e outro para role (role === filter.role ou filter.role === "all").',
  'TODO 4: Adicione uma função validate() que retorna um objeto de erros. Chame-a no handleSubmit e só submeta se não houver erros.',
  'TODO 5: Substitua o import estático do UserForm por const UserForm = lazy(() => import("./UserForm").then(m => ({ default: m.UserForm }))) e envolva em Suspense.',
]
