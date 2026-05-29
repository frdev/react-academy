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
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    tagline: '30 dias do sistema de tipos ao type-level programming',
    description: 'Sistema de tipos, generics, conditional types, infer, mapped types e patterns avançados.',
    totalDays: 30,
    status: 'available',
    color: 'indigo',
  },
  {
    id: 'react',
    name: 'React',
    tagline: '30 dias de React avançado',
    description: 'Domine os internals do React: render cycle, hooks, performance e arquitetura.',
    totalDays: 30,
    status: 'available',
    color: 'blue',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    tagline: 'Em breve',
    description: 'APIs, streams, performance e arquitetura backend com Node.js.',
    totalDays: 30,
    status: 'coming-soon',
    color: 'green',
  },
]

export function getStackById(id: string): Stack | undefined {
  return STACKS.find(s => s.id === id)
}
