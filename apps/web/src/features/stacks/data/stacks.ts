import type { Stack } from '../types'

export const STACKS: Stack[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    tagline: '30 dias do básico ao avançado de verdade',
    description: 'Types, closures, prototype, event loop, V8 internals, Proxy, generators e muito mais.',
    totalDays: 30,
    status: 'available',
    color: 'yellow',
    weekThemes: ['Fundamentos da Linguagem', 'Async & Estruturas', 'Metaprogramação', 'Internals & Performance'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    tagline: '30 dias do sistema de tipos ao type-level programming',
    description: 'Sistema de tipos, generics, conditional types, infer, mapped types e patterns avançados.',
    totalDays: 30,
    status: 'available',
    color: 'indigo',
    weekThemes: ['Sistema de Tipos', 'Generics & Narrowing', 'Type-Level Programming', 'Ferramentas & Internals'],
  },
  {
    id: 'react',
    name: 'React',
    tagline: '30 dias de React avançado',
    description: 'Domine os internals do React: render cycle, hooks, performance e arquitetura.',
    totalDays: 30,
    status: 'available',
    color: 'blue',
    weekThemes: ['Fundamentos Profundos', 'Hooks Avançados', 'Arquitetura', 'Performance'],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    tagline: 'Em breve',
    description: 'APIs, streams, performance e arquitetura backend com Node.js.',
    totalDays: 30,
    status: 'coming-soon',
    color: 'green',
    weekThemes: ['APIs & Módulos', 'Streams & Eventos', 'Performance', 'Arquitetura'],
  },
  {
    id: 'ai',
    name: 'AI Moderna',
    tagline: '14 dias construindo com AI: da API aos agentes',
    description: 'LLMs, Anthropic API, tool use, RAG, MCP, Skills, agents e multi-agentes — hands-on, do zero ao sistema agêntico.',
    totalDays: 14,
    status: 'coming-soon',
    color: 'purple',
    weekThemes: ['Fundamentos & Ferramentas', 'Agentes & Produção'],
  },
  {
    id: 'algorithms',
    name: 'Algoritmos & Estruturas de Dados',
    tagline: '14 dias de DSA com JavaScript, do Big-O à programação dinâmica',
    description: 'Complexidade, arrays, hash maps, listas, pilhas, filas, recursão, busca binária, sorting, árvores, heaps, grafos (BFS/DFS), backtracking e programação dinâmica — tudo em JavaScript.',
    totalDays: 14,
    status: 'available',
    color: 'orange',
    weekThemes: ['Fundamentos & Estruturas Lineares', 'Algoritmos & Estruturas Não-Lineares'],
  },
]

export function getStackById(id: string): Stack | undefined {
  return STACKS.find(s => s.id === id)
}
