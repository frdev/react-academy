import { useNavigate } from 'react-router'
import { STACKS, groupStacksByLevel } from './data/stacks'
import type { Stack } from './types'
import { Badge } from '@academy/ui'

const COLOR_MAP: Record<string, { ring: string; bg: string; text: string; icon: string; hoverBorder: string }> = {
  blue:    { ring: 'ring-blue-500',    bg: 'bg-blue-600',    text: 'text-blue-400',    icon: 'bg-blue-500/10',    hoverBorder: 'hover:border-blue-500/50' },
  yellow:  { ring: 'ring-yellow-500',  bg: 'bg-yellow-600',  text: 'text-yellow-400',  icon: 'bg-yellow-500/10',  hoverBorder: 'hover:border-yellow-500/50' },
  indigo:  { ring: 'ring-indigo-500',  bg: 'bg-indigo-600',  text: 'text-indigo-400',  icon: 'bg-indigo-500/10',  hoverBorder: 'hover:border-indigo-500/50' },
  green:   { ring: 'ring-green-500',   bg: 'bg-green-600',   text: 'text-green-400',   icon: 'bg-green-500/10',   hoverBorder: 'hover:border-green-500/50' },
  orange:  { ring: 'ring-orange-500',  bg: 'bg-orange-600',  text: 'text-orange-400',  icon: 'bg-orange-500/10',  hoverBorder: 'hover:border-orange-500/50' },
  pink:    { ring: 'ring-pink-500',    bg: 'bg-pink-600',    text: 'text-pink-400',    icon: 'bg-pink-500/10',    hoverBorder: 'hover:border-pink-500/50' },
  purple:  { ring: 'ring-purple-500',  bg: 'bg-purple-600',  text: 'text-purple-400',  icon: 'bg-purple-500/10',  hoverBorder: 'hover:border-purple-500/50' },
  red:     { ring: 'ring-red-500',     bg: 'bg-red-600',     text: 'text-red-400',     icon: 'bg-red-500/10',     hoverBorder: 'hover:border-red-500/50' },
  rose:    { ring: 'ring-rose-500',    bg: 'bg-rose-600',    text: 'text-rose-400',    icon: 'bg-rose-500/10',    hoverBorder: 'hover:border-rose-500/50' },
  amber:   { ring: 'ring-amber-500',   bg: 'bg-amber-600',   text: 'text-amber-400',   icon: 'bg-amber-500/10',   hoverBorder: 'hover:border-amber-500/50' },
  sky:     { ring: 'ring-sky-500',     bg: 'bg-sky-600',     text: 'text-sky-400',     icon: 'bg-sky-500/10',     hoverBorder: 'hover:border-sky-500/50' },
  teal:    { ring: 'ring-teal-500',    bg: 'bg-teal-600',    text: 'text-teal-400',    icon: 'bg-teal-500/10',    hoverBorder: 'hover:border-teal-500/50' },
  emerald: { ring: 'ring-emerald-500', bg: 'bg-emerald-600', text: 'text-emerald-400', icon: 'bg-emerald-500/10', hoverBorder: 'hover:border-emerald-500/50' },
}

const STACK_ICONS: Record<string, string> = {
  react:                   '⚛️',
  javascript:              'JS',
  typescript:              'TS',
  nodejs:                  '🟢',
  algorithms:              '🧮',
  css:                     '🎨',
  html:                    '📄',
  'css-essentials':        '🖌️',
  'javascript-essentials': '📜',
  'typescript-essentials': '🔷',
  git:                     '🌿',
  'frontend-architecture': '🏛️',
}

function StackCard({ stack }: { stack: Stack }) {
  const navigate = useNavigate()
  const colors = COLOR_MAP[stack.color] ?? COLOR_MAP.blue
  const isAvailable = stack.status === 'available'

  return (
    <div
      onClick={() => isAvailable && navigate(`/${stack.id}`)}
      className={[
        'group relative rounded-2xl border p-6 transition-all duration-200',
        isAvailable
          ? `border-gray-700 bg-gray-900 ${colors.hoverBorder} hover:bg-gray-800/80 cursor-pointer ring-0 hover:ring-1 ${colors.ring}`
          : 'border-gray-800 bg-gray-900/50 cursor-not-allowed opacity-60',
      ].join(' ')}
    >
      {!isAvailable && (
        <div className="absolute top-4 right-4">
          <Badge variant="default">Em breve</Badge>
        </div>
      )}

      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.icon} mb-4`}>
        <span className="text-2xl">{STACK_ICONS[stack.id] ?? '📚'}</span>
      </div>

      <h3 className="text-xl font-bold text-white mb-1">{stack.name}</h3>
      <p className={`text-sm font-medium mb-3 ${isAvailable ? colors.text : 'text-gray-500'}`}>
        {stack.tagline}
      </p>
      <p className="text-sm text-gray-400 leading-relaxed">{stack.description}</p>

      {isAvailable && (
        <div className={`mt-5 inline-flex items-center gap-2 text-sm font-medium ${colors.text} group-hover:gap-3 transition-all`}>
          Começar agora
          <span>→</span>
        </div>
      )}
    </div>
  )
}

function StackSection({ title, subtitle, stacks }: { title: string; subtitle: string; stacks: Stack[] }) {
  if (stacks.length === 0) return null
  return (
    <section className="mb-16">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stacks.map(stack => (
          <StackCard key={stack.id} stack={stack} />
        ))}
      </div>
    </section>
  )
}

export default function StackSelectorPage() {
  const { fundamentos, avancado } = groupStacksByLevel(STACKS)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-bold text-white tracking-tight">Academy</h1>
          <p className="text-sm text-gray-500 mt-0.5">Aprenda no seu ritmo, um dia de cada vez</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Comece agora!</h2>
          <p className="text-gray-400 text-lg">Comece pelos fundamentos e avance para os stacks aprofundados.</p>
        </div>

        <StackSection
          title="Fundamentos"
          subtitle="A base do desenvolvimento frontend — comece por aqui."
          stacks={fundamentos}
        />
        <StackSection
          title="Avançado"
          subtitle="Mergulhos profundos para dominar cada tecnologia."
          stacks={avancado}
        />
      </main>
    </div>
  )
}
