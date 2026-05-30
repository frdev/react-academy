# Trilha de Fundamentos — Plano 1: Reestruturação da Home

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dividir a home em duas seções — "Fundamentos" e "Avançado" — e registrar os 6 mini-cursos da trilha como "Em breve", sem ainda criar conteúdo.

**Architecture:** Adiciona um campo `level` ao tipo `Stack`, taggeia os 7 stacks atuais como `avancado` e adiciona 6 stacks `fundamentos` (`coming-soon`). Um helper puro `groupStacksByLevel` separa os stacks por nível (única lógica, testada via TDD). `StackSelectorPage` passa a renderizar duas seções rotuladas. De quebra, conserta o `COLOR_MAP` (cor `purple` ausente + borda de hover dinâmica que o Tailwind não gera) movendo a borda de hover para uma string literal.

**Tech Stack:** React 19, TypeScript, Tailwind v4, react-router v7, Vitest (+ happy-dom).

**Spec:** `docs/superpowers/specs/2026-05-30-trilha-fundamentos-design.md`

**Posição no roadmap:** Este é o **Plano 1 de 7**. Os planos 2–7 (conteúdo de cada curso: HTML/a11y → CSS Essencial → JS Essencial → TS Essencial → Git → Boas Práticas) são escritos individualmente depois, cada um flipando seu stack de `coming-soon` → `available`.

**Commits:** toda mensagem de commit deste plano deve terminar com a trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` (omitida nos exemplos abaixo por brevidade).

---

## Pré-voo (estado do working tree)

Há **edições não commitadas do usuário** em `apps/web/src/features/stacks/data/stacks.ts` (reordenou os stacks; trocou a tagline do JS) e em `apps/web/src/features/stacks/StackSelectorPage.tsx` (header virou *"Comece agora!"*). Estas edições **devem ser preservadas**:

- [ ] **Passo 0: Baseline das edições do usuário.** Commitar as edições atuais como baseline antes de começar, para não misturá-las nos commits das tasks:

```bash
cd /Users/ristow/Documents/projects/react-academy
git add apps/web/src/features/stacks/data/stacks.ts apps/web/src/features/stacks/StackSelectorPage.tsx
git commit -m "chore(home): reordena stacks e ajusta copy do header (WIP do usuário)"
```

> Se o usuário preferir não commitar isso como baseline, as tasks abaixo continuam válidas — só não execute o Passo 0 e tome cuidado para o `git add` de cada task incluir **apenas** os arquivos daquela task. O código das tasks já incorpora o `"Comece agora!"` do usuário.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade | Ação |
|---------|------------------|------|
| `apps/web/src/features/stacks/types.ts` | Interface `Stack` | Modificar (campo `level`) |
| `apps/web/src/features/stacks/data/stacks.ts` | Dados dos stacks + helpers | Modificar (`level` nos 7, +6 novos, +`groupStacksByLevel`) |
| `apps/web/src/features/stacks/data/stacks.test.ts` | Teste do helper | Criar |
| `apps/web/src/features/stacks/StackSelectorPage.tsx` | UI da home | Modificar (cores, ícones, 2 seções) |

---

## Task 1: Modelo de dados — `level` + 6 novos stacks

**Files:**
- Modify: `apps/web/src/features/stacks/types.ts`
- Modify: `apps/web/src/features/stacks/data/stacks.ts`

- [ ] **Step 1: Adicionar `level` à interface `Stack`**

Em `types.ts`, a interface inteira fica assim:

```ts
export interface Stack {
  id: string
  name: string
  tagline: string
  description: string
  totalDays: number
  status: 'available' | 'coming-soon'
  level: 'fundamentos' | 'avancado'
  color: string
  weekThemes?: string[]
}
```

- [ ] **Step 2: Taggear os 7 stacks atuais como `avancado`**

Em `stacks.ts`, adicionar a linha `level: 'avancado',` (logo após a linha `status: ...,`) em **cada um** dos 7 objetos existentes: `javascript`, `typescript`, `react`, `css`, `ai`, `algorithms`, `nodejs`. Exemplo no objeto `javascript`:

```ts
  {
    id: 'javascript',
    name: 'JavaScript',
    tagline: '30 dias de JavaScript avançado de verdade',
    description: 'Types, closures, prototype, event loop, V8 internals, Proxy, generators e muito mais.',
    totalDays: 30,
    status: 'available',
    level: 'avancado',
    color: 'yellow',
    weekThemes: ['Fundamentos da Linguagem', 'Async & Estruturas', 'Metaprogramação', 'Internals & Performance'],
  },
```

> Não reordenar os objetos existentes — apenas inserir a linha `level` em cada um.

- [ ] **Step 3: Adicionar os 6 stacks de Fundamentos**

Inserir estes 6 objetos no array `STACKS`, **mantendo esta ordem entre eles** (é a ordem da trilha). O agrupamento por nível decide a *seção*; a ordem entre estes 6 define a ordem dentro de "Fundamentos". Sugestão: inserir o bloco logo após `export const STACKS: Stack[] = [`.

```ts
  {
    id: 'html',
    name: 'HTML Semântico & Acessibilidade',
    tagline: '7 dias da base semântica e acessível da web',
    description: 'Estrutura de documentos, tags semânticas, formulários, ARIA e WCAG — a fundação que todo front pressupõe.',
    totalDays: 7,
    status: 'coming-soon',
    level: 'fundamentos',
    color: 'red',
    weekThemes: ['Estrutura & Acessibilidade'],
  },
  {
    id: 'css-essentials',
    name: 'CSS Essencial',
    tagline: '7 dias do box model ao layout responsivo',
    description: 'Cascata, especificidade, box model, flexbox, grid e responsividade — a base antes do CSS moderno.',
    totalDays: 7,
    status: 'coming-soon',
    level: 'fundamentos',
    color: 'rose',
    weekThemes: ['Fundamentos de Estilo & Layout'],
  },
  {
    id: 'javascript-essentials',
    name: 'JavaScript Essencial',
    tagline: '7 dias de JavaScript do zero ao assíncrono',
    description: 'Tipos, funções, arrays, objetos, async/await, fetch e DOM — a rampa para o JS avançado.',
    totalDays: 7,
    status: 'coming-soon',
    level: 'fundamentos',
    color: 'amber',
    weekThemes: ['A Linguagem na Prática'],
  },
  {
    id: 'typescript-essentials',
    name: 'TypeScript Essencial',
    tagline: '7 dias de tipos, do básico ao React',
    description: 'Tipos, interfaces, unions, narrowing, generics e utility types — a rampa para o TS avançado.',
    totalDays: 7,
    status: 'coming-soon',
    level: 'fundamentos',
    color: 'sky',
    weekThemes: ['Tipos do Básico ao React'],
  },
  {
    id: 'git',
    name: 'Git & Fluxo de Trabalho',
    tagline: '7 dias de Git e colaboração de verdade',
    description: 'Commits, branches, merge/rebase, conflitos, PRs e conventional commits — o fluxo do dia a dia.',
    totalDays: 7,
    status: 'coming-soon',
    level: 'fundamentos',
    color: 'teal',
    weekThemes: ['Versionamento & Colaboração'],
  },
  {
    id: 'frontend-architecture',
    name: 'Boas Práticas & Arquitetura Frontend',
    tagline: '7 dias de código limpo e arquitetura',
    description: 'Clean code, componentização, organização por feature, estado e quando abstrair — síntese dos fundamentos.',
    totalDays: 7,
    status: 'coming-soon',
    level: 'fundamentos',
    color: 'emerald',
    weekThemes: ['Código Limpo & Arquitetura'],
  },
```

- [ ] **Step 4: Verificar typecheck**

Run: `pnpm -C apps/web typecheck`
Expected: PASS, sem erros. (Se faltar `level` em algum stack, o TS aponta exatamente qual objeto.)

- [ ] **Step 5: Commit**

```bash
cd /Users/ristow/Documents/projects/react-academy
git add apps/web/src/features/stacks/types.ts apps/web/src/features/stacks/data/stacks.ts
git commit -m "feat(fundamentos): adiciona campo level e registra os 6 stacks de fundamentos (coming-soon)"
```

---

## Task 2: Helper `groupStacksByLevel` (TDD)

**Files:**
- Test: `apps/web/src/features/stacks/data/stacks.test.ts` (criar)
- Modify: `apps/web/src/features/stacks/data/stacks.ts`

- [ ] **Step 1: Escrever o teste que falha**

Criar `apps/web/src/features/stacks/data/stacks.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { groupStacksByLevel } from './stacks'
import type { Stack } from '../types'

function makeStack(id: string, level: Stack['level']): Stack {
  return {
    id,
    name: id,
    tagline: '',
    description: '',
    totalDays: 7,
    status: 'coming-soon',
    level,
    color: 'blue',
  }
}

describe('groupStacksByLevel', () => {
  it('separa stacks por nível', () => {
    const stacks = [
      makeStack('a', 'fundamentos'),
      makeStack('b', 'avancado'),
      makeStack('c', 'fundamentos'),
    ]
    const { fundamentos, avancado } = groupStacksByLevel(stacks)
    expect(fundamentos.map(s => s.id)).toEqual(['a', 'c'])
    expect(avancado.map(s => s.id)).toEqual(['b'])
  })

  it('preserva a ordem do array dentro de cada nível', () => {
    const stacks = [
      makeStack('x', 'avancado'),
      makeStack('y', 'fundamentos'),
      makeStack('z', 'avancado'),
    ]
    const { avancado } = groupStacksByLevel(stacks)
    expect(avancado.map(s => s.id)).toEqual(['x', 'z'])
  })

  it('retorna arrays vazios quando não há stacks', () => {
    const { fundamentos, avancado } = groupStacksByLevel([])
    expect(fundamentos).toEqual([])
    expect(avancado).toEqual([])
  })
})
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `pnpm -C apps/web test:run -- stacks.test`
Expected: FAIL — `groupStacksByLevel` não existe / não é exportado (erro de import).

- [ ] **Step 3: Implementar o helper (mínimo)**

Em `stacks.ts`, adicionar ao final do arquivo (depois de `getStackById`):

```ts
export function groupStacksByLevel(stacks: Stack[]): { fundamentos: Stack[]; avancado: Stack[] } {
  return {
    fundamentos: stacks.filter(s => s.level === 'fundamentos'),
    avancado: stacks.filter(s => s.level === 'avancado'),
  }
}
```

> `Stack` já está importado no topo de `stacks.ts` (`import type { Stack } from '../types'`). `Array.prototype.filter` preserva a ordem original, garantindo o segundo teste.

- [ ] **Step 4: Rodar o teste e confirmar que passa**

Run: `pnpm -C apps/web test:run -- stacks.test`
Expected: PASS — 3 testes verdes.

- [ ] **Step 5: Commit**

```bash
cd /Users/ristow/Documents/projects/react-academy
git add apps/web/src/features/stacks/data/stacks.ts apps/web/src/features/stacks/data/stacks.test.ts
git commit -m "feat(fundamentos): helper groupStacksByLevel para agrupar stacks por nível"
```

---

## Task 3: Home em duas seções + correção de cores

**Files:**
- Modify: `apps/web/src/features/stacks/StackSelectorPage.tsx`

- [ ] **Step 1: Atualizar imports**

No topo de `StackSelectorPage.tsx`, garantir que `groupStacksByLevel` é importado junto de `STACKS`:

```tsx
import { useNavigate } from 'react-router'
import { STACKS, groupStacksByLevel } from './data/stacks'
import type { Stack } from './types'
import { Badge } from '@academy/ui'
```

- [ ] **Step 2: Substituir o `COLOR_MAP` (adiciona `hoverBorder`, `purple` e 6 cores novas)**

Trocar a constante `COLOR_MAP` inteira por:

```tsx
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
```

> As strings de classe são literais completas para o Tailwind v4 conseguir gerá-las no build (classes montadas por template em runtime não são detectadas).

- [ ] **Step 3: Adicionar os 6 ícones ao `STACK_ICONS`**

Trocar a constante `STACK_ICONS` por:

```tsx
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
```

- [ ] **Step 4: Usar `colors.hoverBorder` no `StackCard`**

Dentro de `StackCard`, no array de classes do `<div>`, trocar a classe dinâmica `hover:border-${stack.color}-500/50` pela literal do mapa. O ramo `isAvailable ? ... : ...` fica:

```tsx
        isAvailable
          ? `border-gray-700 bg-gray-900 ${colors.hoverBorder} hover:bg-gray-800/80 cursor-pointer ring-0 hover:ring-1 ${colors.ring}`
          : 'border-gray-800 bg-gray-900/50 cursor-not-allowed opacity-60',
```

- [ ] **Step 5: Adicionar o componente `StackSection`**

Logo antes de `export default function StackSelectorPage()`, adicionar:

```tsx
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
```

- [ ] **Step 6: Renderizar duas seções em `StackSelectorPage`**

Substituir a função `StackSelectorPage` inteira por (preserva o `"Comece agora!"` do usuário no `<h2>`):

```tsx
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
```

- [ ] **Step 7: Verificar typecheck e build**

Run: `pnpm -C apps/web typecheck`
Expected: PASS, sem erros.

Run: `pnpm -C apps/web build`
Expected: `tsc -b && vite build` conclui com sucesso.

- [ ] **Step 8: Commit**

```bash
cd /Users/ristow/Documents/projects/react-academy
git add apps/web/src/features/stacks/StackSelectorPage.tsx
git commit -m "feat(fundamentos): home em seções Fundamentos/Avançado + corrige cores e borda de hover"
```

---

## Verificação final (end-to-end)

- [ ] **Suíte completa**

Run: `pnpm -C apps/web test:run`
Expected: todos os testes passam, incluindo os 3 novos de `groupStacksByLevel`.

- [ ] **Typecheck + build**

Run: `pnpm -C apps/web typecheck && pnpm -C apps/web build`
Expected: ambos sem erro.

- [ ] **Navegação manual**

Run: `pnpm -C apps/web dev` e abrir `/`.
Verificar:
- Duas seções aparecem: **Fundamentos** (em cima) e **Avançado** (embaixo).
- Em "Fundamentos", 6 cards com badge **"Em breve"**: HTML Semântico & Acessibilidade, CSS Essencial, JavaScript Essencial, TypeScript Essencial, Git & Fluxo de Trabalho, Boas Práticas & Arquitetura Frontend — cada um com cor e ícone próprios.
- Em "Avançado", os 7 cards atuais; o card de **AI** agora aparece **roxo** (antes caía no fallback azul).
- Ao passar o mouse sobre um card disponível, a **borda muda para a cor do stack**.
- Os cards de Fundamentos (coming-soon) não são clicáveis (cursor `not-allowed`).

### Notas

- **Não há conteúdo de curso neste plano.** Os 6 stacks de Fundamentos ficam `coming-soon` até seus planos individuais (2–7) serem executados, quando cada um vira `available`.
- **Edições do usuário preservadas:** o `<h2>` mantém o `"Comece agora!"`; o subtítulo passa a refletir a estrutura por níveis.
