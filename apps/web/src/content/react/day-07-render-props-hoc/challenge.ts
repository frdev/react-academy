import type { SandpackFiles } from '@codesandbox/sandpack-react'

export const starterCode: SandpackFiles = {
  'App.tsx': `import { useState, useEffect } from 'react'

// DESAFIO: Render Props
//
// O componente DataFetcher abaixo faz duas coisas ao mesmo tempo:
// 1. Busca dados de uma URL
// 2. Renderiza os dados como um card de usuário
//
// Isso torna impossível reutilizar a lógica de fetch para exibir
// outros tipos de dados (posts, produtos, etc.)
//
// TODO: Refatore DataFetcher para usar o padrão Render Props:
// - Adicione uma prop 'render: (data: T, isLoading: boolean) => JSX.Element'
// - DataFetcher só deve buscar dados e chamar render(data, isLoading)
// - Quem usa DataFetcher decide como exibir os dados
//
// DICA: O DataFetcher não deveria saber nada sobre User — só sobre fetch.

interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

// ← Este componente está acoplado à exibição de User
function DataFetcher() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      setUser({
        id: 1,
        name: 'Leanne Graham',
        email: 'sincere@april.biz',
        phone: '1-770-736-8031',
        website: 'hildegard.org',
      })
      setIsLoading(false)
    }, 1200)
  }, [])

  // ← Hardcoded para exibir User — não pode ser reutilizado para Post, Product, etc.
  if (isLoading) {
    return <div style={{ padding: 20, color: '#9ca3af' }}>Carregando usuário...</div>
  }

  return (
    <div style={{ padding: 20, border: '1px solid #e5e7eb', borderRadius: 12, maxWidth: 320, fontFamily: 'sans-serif' }}>
      <h3 style={{ margin: '0 0 8px' }}>{user?.name}</h3>
      <p style={{ margin: '4px 0', fontSize: 14, color: '#6b7280' }}>📧 {user?.email}</p>
      <p style={{ margin: '4px 0', fontSize: 14, color: '#6b7280' }}>📞 {user?.phone}</p>
      <p style={{ margin: '4px 0', fontSize: 14, color: '#6b7280' }}>🌐 {user?.website}</p>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontFamily: 'sans-serif', marginBottom: 16 }}>Perfil do Usuário</h2>
      <DataFetcher />
    </div>
  )
}
`,
}

export const solutionCode: SandpackFiles = {
  'App.tsx': `import { useState, useEffect } from 'react'

// SOLUÇÃO: Render Props
//
// DataFetcher agora é um componente genérico que:
// 1. Recebe uma prop 'url' (de onde buscar)
// 2. Recebe uma prop 'render' (como exibir os dados)
// 3. Gerencia loading/error internamente
// 4. Chama render(data, isLoading) — quem decide como mostrar é o pai
//
// Isso permite reutilizar DataFetcher para qualquer tipo de dado:
// <DataFetcher url="/users/1" render={(user) => <UserCard user={user} />} />
// <DataFetcher url="/posts/1" render={(post) => <PostCard post={post} />} />

interface DataFetcherProps<T> {
  url: string
  render: (data: T | null, isLoading: boolean) => JSX.Element
}

// ✓ DataFetcher é genérico — não sabe nada sobre User, Post, etc.
function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula fetch pela URL recebida como prop
    const timer = setTimeout(() => {
      // Em produção, usaria: fetch(url).then(r => r.json()).then(setData)
      if (url.includes('users')) {
        setData({
          id: 1,
          name: 'Leanne Graham',
          email: 'sincere@april.biz',
          phone: '1-770-736-8031',
          website: 'hildegard.org',
        } as T)
      } else if (url.includes('posts')) {
        setData({
          id: 1,
          title: 'React é incrível',
          body: 'Composição, reatividade e o Virtual DOM tornam o React poderoso.',
        } as T)
      }
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [url])

  // ✓ Delega completamente a renderização para a prop 'render'
  return render(data, isLoading)
}

interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

interface Post {
  id: number
  title: string
  body: string
}

// ✓ Componentes de exibição separados — cada um sabe renderizar seu tipo
function UserCard({ user }: { user: User | null }) {
  return (
    <div style={{ padding: 20, border: '1px solid #e5e7eb', borderRadius: 12, maxWidth: 320, fontFamily: 'sans-serif' }}>
      <h3 style={{ margin: '0 0 8px' }}>{user?.name}</h3>
      <p style={{ margin: '4px 0', fontSize: 14, color: '#6b7280' }}>📧 {user?.email}</p>
      <p style={{ margin: '4px 0', fontSize: 14, color: '#6b7280' }}>📞 {user?.phone}</p>
      <p style={{ margin: '4px 0', fontSize: 14, color: '#6b7280' }}>🌐 {user?.website}</p>
    </div>
  )
}

function PostCard({ post }: { post: Post | null }) {
  return (
    <div style={{ padding: 20, border: '1px solid #dbeafe', borderRadius: 12, maxWidth: 320, fontFamily: 'sans-serif', background: '#f0f7ff' }}>
      <h3 style={{ margin: '0 0 8px', color: '#1e40af' }}>{post?.title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{post?.body}</p>
    </div>
  )
}

// ✓ Mesmo DataFetcher, dois usos completamente diferentes
export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 8 }}>Render Props em Ação</h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
        O mesmo DataFetcher renderiza User e Post de formas diferentes.
      </p>

      <h3 style={{ marginBottom: 8 }}>Perfil do Usuário</h3>
      <DataFetcher<User>
        url="/users/1"
        render={(user, isLoading) =>
          isLoading
            ? <div style={{ color: '#9ca3af' }}>Carregando usuário...</div>
            : <UserCard user={user} />
        }
      />

      <h3 style={{ margin: '24px 0 8px' }}>Último Post</h3>
      <DataFetcher<Post>
        url="/posts/1"
        render={(post, isLoading) =>
          isLoading
            ? <div style={{ color: '#9ca3af' }}>Carregando post...</div>
            : <PostCard post={post} />
        }
      />
    </div>
  )
}
`,
}

export const hints = [
  'O componente faz duas coisas: busca dados E renderiza. Separe essas responsabilidades — DataFetcher deve só buscar.',
  'Adicione uma prop `render: (data: T | null, isLoading: boolean) => JSX.Element` ao DataFetcher. Remova todo o JSX de User de dentro dele.',
  'O DataFetcher só deve retornar `render(data, isLoading)` — quem decide como exibir é quem usa o componente.',
]
