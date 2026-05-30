# React Essencial (`react-essentials`) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans para implementar tarefa a tarefa. Os passos usam checkbox (`- [ ]`).

**Goal:** Construir o módulo `react-essentials` (7 dias, React+TypeScript) — 21 arquivos de conteúdo + 5 pontos de fiação — e deixar o stack `available`.

**Architecture:** Conteúdo-como-arquivos por dia (`metadata.json` + `theory.mdx` + `quiz.json`) em `apps/web/src/content/react-essentials/`, registrado num data file e fiado em `TheoryReader`/`QuizRunner`/`index.ts`/`stacks.ts`. Idêntico ao molde de `javascript-essentials`.

**Tech Stack:** React 19 + Vite + MDX (`@mdx-js/rollup` + `rehype-pretty-code`/Shiki) + JSON imports; TypeScript; pnpm. Sem libs novas.

**Spec:** `docs/superpowers/specs/2026-05-30-react-essentials-design.md` (aprovado).

**Commits:** por preferência do usuário, o **commit fica a cargo dele**. **Não rodar `git commit` automaticamente.**

---

## Contexto (autocontido)

`react-essentials` está em `stacks.ts` como placeholder (`status: 'coming-soon'`, `totalDays: 7`, cor `blue`, `weekThemes: ['React com TypeScript na Prática']`). O ícone `'react-essentials': '⚛️'` já existe em `StackSelectorPage.tsx` — **nada a fazer lá**.

É a **rampa** para o stack avançado `react` (que começa em render-cycle/reconciliation/fiber). Mantenha tudo **introdutório**: sem internals, sem `useRef`/`useMemo`/`useCallback`/performance.

**React com TypeScript desde o 1º componente:** todo exemplo é `.tsx` com **props e estado tipados** (`type`/`interface`, `useState<T>`, tipos de evento).

**Reprodutibilidade (TSX ilustrativo + setup):** React precisa de build, então **não** se copia para `.html`. Exemplos são componentes `.tsx` focados; o **Dia 1** traz um passo curto de `npm create vite@latest -- --template react-ts` e um ponteiro para sandbox online. **Não** usar Babel-no-navegador.

## Padrão a reproduzir (molde — não reinventar)

Cada dia é uma pasta com **3 arquivos**, idênticos em formato aos de `apps/web/src/content/javascript-essentials/day-01-valores-tipos-variaveis/`:

- **`metadata.json`** — schema `LessonMetadata`: `id` (`"day-0N"`), `day`, `week: 1`, `title`, `slug`, `topics` (array), `difficulty: "foundational"`, `estimatedMinutes` (45–55), `prerequisites` (`[]` no dia 1; `["day-0(N-1)"]` nos demais), `hasVisualizer: false`, `hasChallenge: false`, `xpReward: 100`.
- **`theory.mdx`** — `# Título` na 1ª linha, parágrafo de abertura, seções `##` com prosa + blocos **```` ```tsx ````** (props/estado tipados desde o início), e `> **Resumo:**` ao final. pt-BR, tom direto.
- **`quiz.json`** — `lessonId`, `passingScore: 70`, **7 questões** (6 `multiple-choice` com 4 `options` + `correctAnswer` 0-indexed, e **1 `true-false`**). `id` `q1`..`q7`, `explanation` que ensina.

**⚠️ MDX + JSX (risco principal deste módulo):** JSX usa `{`, `}`, `<`, `</>` o tempo todo. **Todo** trecho de JSX deve estar dentro de fences ```` ```tsx ````. Na prosa fora de código, nomes de componentes vão entre backticks (`` `<Botao>` ``) — um `<Algo>` solto quebra o parse do MDX. **Validar com `build` após cada dia** (ou ao final), pois erro de MDX só aparece no build.

**Fence `tsx`:** confirmar no preview que o highlighter destaca `tsx`. Fallback (não-bloqueante): `jsx` (já usado pelo stack `react` avançado).

## Arquivos de referência (molde)

- `apps/web/src/content/javascript-essentials/day-07-projeto-final-app/{metadata.json,theory.mdx,quiz.json}` (capstone — o app que o Dia 7 daqui reescreve em React).
- `apps/web/src/features/curriculum/data/javascript-essentials-lessons.ts` (data file).
- `apps/web/src/features/curriculum/types.ts` (tipo `LessonMetadata`).

## Estrutura de arquivos

**Criar (21 conteúdo + 1 data file):**
```
apps/web/src/content/react-essentials/
  day-01-componentes-e-jsx/        metadata.json + theory.mdx + quiz.json
  day-02-props-tipadas/            "
  day-03-estado-usestate/          "
  day-04-eventos-formularios/      "
  day-05-listas-condicional/       "
  day-06-useeffect-dados/          "
  day-07-projeto-final-tarefas/    "
apps/web/src/features/curriculum/data/react-essentials-lessons.ts
```

**Modificar (fiação):** `data/index.ts`, `lessons/components/TheoryReader.tsx`, `lessons/components/QuizRunner.tsx`, `stacks/data/stacks.ts`.

---

## Task 1: Dia 1 — Componentes e JSX

**Files — Create:** `.../day-01-componentes-e-jsx/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`**

```json
{
  "id": "day-01",
  "day": 1,
  "week": 1,
  "title": "Componentes e JSX",
  "slug": "componentes-e-jsx",
  "topics": [
    "o que é React (UI declarativa)",
    "componente: função que retorna JSX",
    "JSX é JavaScript (className, {expressões}, raiz única)",
    "arquivos .tsx",
    "como criar e rodar um projeto React+TS com Vite"
  ],
  "difficulty": "foundational",
  "estimatedMinutes": 45,
  "prerequisites": [],
  "hasVisualizer": false,
  "hasChallenge": false,
  "xpReward": 100
}
```

- [ ] **Step 2: `theory.mdx`** — H1 `# Componentes e JSX`; abertura: React deixa você **descrever** a interface e cuida de atualizar a tela. Seções:
  - `## O que é React` — UI declarativa (você descreve o resultado para um estado; o React reconcilia o DOM). Contraste com o "manipular o DOM à mão" do JS Essencial.
  - `## Seu primeiro componente` — um componente é uma **função em PascalCase que retorna JSX**:
    ```tsx
    function Ola() {
      return <h1>Olá, React!</h1>
    }
    ```
  - `## JSX é JavaScript, não HTML` — `className` (não `class`); `{expressao}` para inserir JS; **um elemento raiz** (ou Fragment `<>...</>`); tags sempre fechadas (`<img />`).
    ```tsx
    function Cartao() {
      const nome = "Ana"
      return (
        <>
          <h2 className="titulo">{nome}</h2>
          <p>{nome.length} letras</p>
        </>
      )
    }
    ```
  - `## Como criar e rodar` — bloco `bash`: `npm create vite@latest meu-app -- --template react-ts`, `cd meu-app`, `npm install`, `npm run dev`. Explicar: `src/App.tsx` é o componente raiz; `src/main.tsx` renderiza `<App />` na página. Mencionar que dá para testar em sandbox online (StackBlitz "React + TS").
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) o que torna o React "declarativo"; (q2) o que um componente retorna (JSX); (q3) `className` vs `class`; (q4) como inserir uma expressão JS no JSX (`{}`); (q5) por que envolver em `<>...</>` (um único elemento raiz); (q6) convenção de nome (PascalCase); (q7 **true-false**) "JSX é HTML de verdade dentro do JS" → Falso (é açúcar que vira chamadas JS).

---

## Task 2: Dia 2 — Props e Composição

**Files — Create:** `.../day-02-props-tipadas/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-02"`, `"day": 2`, `"title": "Props e Composição"`, `"slug": "props-tipadas"`, `"prerequisites": ["day-01"]`, `"estimatedMinutes": 50`. `topics`: `["passar dados via props", "tipar props com type/interface", "destructuring e valores default", "children e ReactNode", "compor componentes"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Props e Composição`; abertura: props deixam um componente receber dados de fora, como parâmetros de função. Seções:
  - `## Passando dados com props` — `<Saudacao nome="Ana" />`.
  - `## Tipando props` — o ponto-chave do módulo:
    ```tsx
    type Props = { nome: string; idade: number }

    function Saudacao({ nome, idade }: Props) {
      return <p>{nome}, {idade} anos</p>
    }
    ```
  - `## Opcionais e default` — `type Props = { nome: string; saudacao?: string }` e `{ saudacao = "Olá" }`.
  - `## children e ReactNode` — componente que envolve conteúdo:
    ```tsx
    function Cartao({ children }: { children: React.ReactNode }) {
      return <div className="cartao">{children}</div>
    }
    // uso: <Cartao><h2>Título</h2></Cartao>
    ```
  - `## Composição` — montar telas combinando componentes pequenos (um `App` que usa `<Cartao>` e `<Saudacao>`).
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) o que são props (dados de pai→filho); (q2) como tipar props (`type Props` + anotação); (q3) prop opcional (`?`); (q4) o que é `children`; (q5) tipo de `children` (`React.ReactNode`); (q6) o que é composição; (q7 **true-false**) "um componente pode alterar (mutar) as próprias props" → Falso (props são read-only).

---

## Task 3: Dia 3 — Estado com useState

**Files — Create:** `.../day-03-estado-usestate/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-03"`, `"day": 3`, `"title": "Estado com useState"`, `"slug": "estado-usestate"`, `"prerequisites": ["day-02"]`, `"estimatedMinutes": 50`. `topics`: `["estado vs props", "useState tipado", "o setter e o re-render", "atualização imutável", "múltiplos estados"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Estado com useState`; abertura: props vêm de fora e não mudam ali; **estado** é a memória interna do componente que muda com o tempo. Seções:
  - `## Estado vs props` — props (de fora, read-only) vs estado (interno, muda).
  - `## useState` —
    ```tsx
    import { useState } from "react"

    function Contador() {
      const [contagem, setContagem] = useState<number>(0)
      return <button onClick={() => setContagem(contagem + 1)}>Cliques: {contagem}</button>
    }
    ```
    Explicar o par `[valor, setter]` e o tipo genérico `<number>`.
  - `## Mudar o estado re-renderiza` — chamar o setter agenda um novo render; **não** reatribuir a variável direto (`contagem = 5` não faz nada).
  - `## Atualização imutável` — para objetos/arrays, crie um novo (spread / `filter` / `map`), não mute:
    ```tsx
    const [itens, setItens] = useState<string[]>([])
    setItens([...itens, "novo"])   // novo array, não itens.push
    ```
  - `## Vários estados` — pode-se ter quantos `useState` precisar.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) diferença estado vs props; (q2) o que `useState` devolve (par valor+setter); (q3) como tipar (`useState<number>(0)`); (q4) por que usar o setter (dispara re-render); (q5) atualização imutável de array (`[...itens, x]`); (q6) o que acontece ao mudar o estado (re-render); (q7 **true-false**) "reatribuir a variável de estado diretamente (ex.: `contagem = 5`) atualiza a tela" → Falso (precisa do setter).

---

## Task 4: Dia 4 — Eventos e Formulários

**Files — Create:** `.../day-04-eventos-formularios/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-04"`, `"day": 4`, `"title": "Eventos e Formulários"`, `"slug": "eventos-formularios"`, `"prerequisites": ["day-03"]`, `"estimatedMinutes": 50`. `topics`: `["onClick e handlers", "tipos de evento do React", "inputs controlados", "onChange ligado ao estado", "onSubmit e preventDefault"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Eventos e Formulários`; abertura: interfaces reagem ao usuário — cliques e digitação viram mudanças de estado. Seções:
  - `## Lidando com eventos` — passe a **função**, não a chamada: `onClick={handleClick}` (não `handleClick()`):
    ```tsx
    function Botao() {
      function aoClicar() { console.log("clicou") }
      return <button onClick={aoClicar}>Clique</button>
    }
    ```
  - `## Tipando o evento` — `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent`.
  - `## Inputs controlados` — o estado é a "fonte da verdade"; `value` + `onChange`:
    ```tsx
    const [texto, setTexto] = useState("")
    <input value={texto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTexto(e.target.value)} />
    ```
  - `## Um formulário` — `onSubmit` + `e.preventDefault()` para não recarregar a página.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) `onClick={handle}` vs `onClick={handle()}` (passar vs chamar); (q2) tipo do evento de input (`React.ChangeEvent<HTMLInputElement>`); (q3) o que é input controlado (value+onChange ligados ao estado); (q4) onde está o valor digitado (`e.target.value`); (q5) papel de `preventDefault` no submit; (q6) por que o estado é a "fonte da verdade" do input; (q7 **true-false**) "`onClick={enviar()}` registra a função para o clique" → Falso (chama na hora do render; deve ser `onClick={enviar}`).

---

## Task 5: Dia 5 — Listas e Renderização Condicional

**Files — Create:** `.../day-05-listas-condicional/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-05"`, `"day": 5`, `"title": "Listas e Renderização Condicional"`, `"slug": "listas-condicional"`, `"prerequisites": ["day-04"]`, `"estimatedMinutes": 50`. `topics`: `["renderizar arrays com map", "a prop key", "renderização condicional com && e ternário", "early return", "tipar a lista"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Listas e Renderização Condicional`; abertura: a maior parte das telas é "uma lista de coisas" — e às vezes algo aparece só sob condição. Seções:
  - `## Renderizar listas com map` — array → JSX com `.map` (retoma o `map` do JS Essencial):
    ```tsx
    type Fruta = { id: number; nome: string }
    const frutas: Fruta[] = [{ id: 1, nome: "Maçã" }, { id: 2, nome: "Uva" }]

    function Lista() {
      return <ul>{frutas.map(f => <li key={f.id}>{f.nome}</li>)}</ul>
    }
    ```
  - `## A prop key` — por que o React pede `key`: identidade estável para atualizar a lista eficientemente. Use um **id único e estável** (evite o índice quando a lista muda de ordem/tamanho).
  - `## Renderização condicional` — `{logado && <Sair />}`, ternário `{logado ? <Sair /> : <Entrar />}`, e early return (`if (!dados) return <p>Carregando...</p>`).
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) como renderizar uma lista (`.map` → JSX); (q2) para que serve `key`; (q3) o que faz `{cond && <X/>}`; (q4) renderização condicional com ternário; (q5) o que usar como `key` (id estável, não índice idealmente); (q6) o que é early return numa view; (q7 **true-false**) "a `key` pode ser qualquer coisa, inclusive sempre a mesma para todos" → Falso (deve ser única e estável por item).

---

## Task 6: Dia 6 — useEffect e Dados

**Files — Create:** `.../day-06-useeffect-dados/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-06"`, `"day": 6`, `"title": "useEffect e Dados"`, `"slug": "useeffect-dados"`, `"prerequisites": ["day-05"]`, `"estimatedMinutes": 55`. `topics`: `["efeitos colaterais", "useEffect e o array de dependências", "buscar dados com fetch no effect", "estados de loading e erro", "cleanup (intro)"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# useEffect e Dados`; abertura: renderizar é puro; buscar dados, timers e subscriptions são **efeitos colaterais** — e moram no `useEffect`. Seções:
  - `## O que é um efeito colateral` — algo fora do cálculo do JSX (rede, timer, DOM externo).
  - `## useEffect e dependências` —
    ```tsx
    useEffect(() => {
      console.log("rodou após o render")
    }, [])   // [] = uma vez, ao montar
    ```
    Explicar: `[]` roda uma vez; `[x]` roda quando `x` muda; sem array roda todo render (evitar).
  - `## Buscar dados` — `fetch` dentro do effect via função async interna (o callback do effect **não** pode ser async direto):
    ```tsx
    const [tarefas, setTarefas] = useState<string[]>([])

    useEffect(() => {
      async function carregar() {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3")
        const dados = await res.json()
        setTarefas(dados.map((d: { title: string }) => d.title))
      }
      carregar()
    }, [])
    ```
  - `## Loading e erro` — estados `carregando`/`erro` para refletir o ciclo da requisição (`try/catch/finally`).
  - `## Cleanup (intro)` — `return () => {...}` para limpar (ex.: `clearInterval`); só a ideia.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) o que é efeito colateral; (q2) o que `[]` de deps significa (uma vez ao montar); (q3) o que controla o array de deps (re-executar quando mudam); (q4) por que definir uma função async interna (o callback do effect não pode ser async); (q5) para que servem estados de loading/erro; (q6) o que faz a função de cleanup; (q7 **true-false**) "o callback do `useEffect` roda durante a renderização" → Falso (roda depois que a tela é pintada).

---

## Task 7: Dia 7 — Projeto Final: Tarefas em React (capstone)

**Files — Create:** `.../day-07-projeto-final-tarefas/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-07"`, `"day": 7`, `"title": "Projeto Final — Tarefas em React"`, `"slug": "projeto-final-tarefas"`, `"prerequisites": ["day-06"]`, `"estimatedMinutes": 50`. `topics`: `["modelar o estado com um tipo", "carregar dados com useEffect + fetch", "renderizar a lista com map", "componente de item com props tipadas", "formulário controlado para adicionar", "remover com filter imutável", "declarativo vs DOM manual"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Projeto Final — Tarefas em React`; abertura: lembra o app de tarefas do JS Essencial (feito manipulando o DOM)? Vamos reconstruí-lo em React+TS e ver a diferença. Seções (cada uma um trecho; ao final o **app completo**):
  - `## O que vamos construir` — a mesma lista de tarefas (carregar, renderizar, adicionar, remover), agora declarativa.
  - `## O tipo e o estado` — `type Tarefa = { id: number; texto: string }` + `useState<Tarefa[]>([])` e `useState("")` para o input.
  - `## Carregar com useEffect + fetch` — efeito de montagem com fallback (`try/catch`).
  - `## O componente de item` — `<TarefaItem>` com props tipadas e callback `onRemover`.
  - `## Adicionar` — form controlado (`onSubmit`, `preventDefault`, `setTarefas([...tarefas, nova])`).
  - `## Remover` — `setTarefas(tarefas.filter(t => t.id !== id))` (imutável).
  - `## O app completo` — componente(s) inteiro(s):
    ```tsx
    import { useState, useEffect } from "react"

    type Tarefa = { id: number; texto: string }

    function TarefaItem({ tarefa, onRemover }: { tarefa: Tarefa; onRemover: (id: number) => void }) {
      return (
        <li>
          {tarefa.texto}
          <button onClick={() => onRemover(tarefa.id)}>remover</button>
        </li>
      )
    }

    export default function App() {
      const [tarefas, setTarefas] = useState<Tarefa[]>([])
      const [texto, setTexto] = useState("")

      useEffect(() => {
        async function carregar() {
          try {
            const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3")
            const dados = await res.json()
            setTarefas(dados.map((d: { id: number; title: string }) => ({ id: d.id, texto: d.title })))
          } catch {
            setTarefas([{ id: 1, texto: "Estudar React" }, { id: 2, texto: "Construir o capstone" }])
          }
        }
        carregar()
      }, [])

      function adicionar(e: React.FormEvent) {
        e.preventDefault()
        if (!texto.trim()) return
        setTarefas([...tarefas, { id: Date.now(), texto }])
        setTexto("")
      }

      function remover(id: number) {
        setTarefas(tarefas.filter(t => t.id !== id))
      }

      return (
        <div>
          <h1>Minhas Tarefas</h1>
          <form onSubmit={adicionar}>
            <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Nova tarefa..." />
            <button type="submit">Adicionar</button>
          </form>
          <ul>
            {tarefas.map(t => <TarefaItem key={t.id} tarefa={t} onRemover={remover} />)}
          </ul>
        </div>
      )
    }
    ```
  - `## Como rodar` — colar num projeto Vite React+TS (Dia 1) em `src/App.tsx` e `npm run dev`.
  - `## Declarativo vs manual` — contraste com o Dia 7 do JS: lá você fazia `querySelector`, `createElement`, `innerHTML`, delegação; aqui você só descreve a UI a partir do estado (`tarefas`), e o React atualiza o DOM. Adicionar/remover é só mudar o array de estado.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões integrativas: (q1) como o estado da lista é tipado (`useState<Tarefa[]>`); (q2) por que `[]` no `useEffect` de carregar (rodar uma vez); (q3) como o input adiciona (form controlado + setter imutável); (q4) como remover (`filter`); (q5) por que `key={t.id}` no map; (q6) como o `<TarefaItem>` recebe a função de remover (prop tipada); (q7 **true-false**) "neste app React você seleciona elementos com `querySelector` e mexe no DOM à mão" → Falso (o estado dirige a UI; o React cuida do DOM).

---

## Task 8: Integração (5 edits)

- [ ] **Step 1: Criar `apps/web/src/features/curriculum/data/react-essentials-lessons.ts`** (espelha `javascript-essentials-lessons.ts`):

```ts
import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/react-essentials/day-01-componentes-e-jsx/metadata.json'
import day02 from '@/content/react-essentials/day-02-props-tipadas/metadata.json'
import day03 from '@/content/react-essentials/day-03-estado-usestate/metadata.json'
import day04 from '@/content/react-essentials/day-04-eventos-formularios/metadata.json'
import day05 from '@/content/react-essentials/day-05-listas-condicional/metadata.json'
import day06 from '@/content/react-essentials/day-06-useeffect-dados/metadata.json'
import day07 from '@/content/react-essentials/day-07-projeto-final-tarefas/metadata.json'

export const REACT_ESSENTIALS_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
].map(l => l as LessonMetadata)

export function getReactEssentialsLessonById(id: string): LessonMetadata | undefined {
  return REACT_ESSENTIALS_LESSONS.find(l => l.id === id)
}

export function getReactEssentialsLessonsByWeek(week: number): LessonMetadata[] {
  return REACT_ESSENTIALS_LESSONS.filter(l => l.week === week)
}
```

- [ ] **Step 2: Editar `apps/web/src/features/curriculum/data/index.ts`** — adicionar o import junto dos outros e a linha no `getLessonsForStack` (antes do `return LESSONS`):

```ts
import { REACT_ESSENTIALS_LESSONS } from './react-essentials-lessons'
// ...
  if (stackId === 'react-essentials') return REACT_ESSENTIALS_LESSONS
```

- [ ] **Step 3: Editar `apps/web/src/features/lessons/components/TheoryReader.tsx`** — adicionar bloco no `MDX_IMPORTS` (modelo: bloco `'javascript-essentials'`):

```ts
  'react-essentials': {
    'day-01': () => import('@/content/react-essentials/day-01-componentes-e-jsx/theory.mdx'),
    'day-02': () => import('@/content/react-essentials/day-02-props-tipadas/theory.mdx'),
    'day-03': () => import('@/content/react-essentials/day-03-estado-usestate/theory.mdx'),
    'day-04': () => import('@/content/react-essentials/day-04-eventos-formularios/theory.mdx'),
    'day-05': () => import('@/content/react-essentials/day-05-listas-condicional/theory.mdx'),
    'day-06': () => import('@/content/react-essentials/day-06-useeffect-dados/theory.mdx'),
    'day-07': () => import('@/content/react-essentials/day-07-projeto-final-tarefas/theory.mdx'),
  },
```

- [ ] **Step 4: Editar `apps/web/src/features/lessons/components/QuizRunner.tsx`** — bloco análogo no `QUIZ_IMPORTS`, apontando para `quiz.json`:

```ts
  'react-essentials': {
    'day-01': () => import('@/content/react-essentials/day-01-componentes-e-jsx/quiz.json'),
    'day-02': () => import('@/content/react-essentials/day-02-props-tipadas/quiz.json'),
    'day-03': () => import('@/content/react-essentials/day-03-estado-usestate/quiz.json'),
    'day-04': () => import('@/content/react-essentials/day-04-eventos-formularios/quiz.json'),
    'day-05': () => import('@/content/react-essentials/day-05-listas-condicional/quiz.json'),
    'day-06': () => import('@/content/react-essentials/day-06-useeffect-dados/quiz.json'),
    'day-07': () => import('@/content/react-essentials/day-07-projeto-final-tarefas/quiz.json'),
  },
```

- [ ] **Step 5: Editar `apps/web/src/features/stacks/data/stacks.ts`** — no objeto do stack `react-essentials`, trocar `status: 'coming-soon'` → `status: 'available'`.

---

## Task 9: Verificação (end-to-end)

- [ ] **Step 1: Build** — `pnpm -C apps/web build` (ou `npm run build` em `apps/web`). Esperado: `tsc -b` + `vite build` sem erros. **É aqui que erros de MDX (JSX fora de fence) e paths de import aparecem.**
- [ ] **Step 2: Testes** — `pnpm -C apps/web test:run`. Esperado: todos passando.
- [ ] **Step 3: Preview (home)** — `preview_start` + abrir `/`: na seção **Fundamentos**, o card **React Essencial** deve aparecer **disponível** (sem "Em breve").
- [ ] **Step 4: Preview (curso)** — abrir `/react-essentials`: 7 dias listados. Concluir teoria do Dia 1 → quiz carrega **7 questões** e permite submeter (corte 70). Conferir que os blocos **`tsx` aparecem destacados** (se não, trocar o fence para `jsx` nos 7 theory.mdx). Console sem erros.
- [ ] **Step 5: Reprodutibilidade adaptada** — montar um scaffold Vite React+TS temporário (`npm create vite@latest /tmp/react-check -- --template react-ts`), colar o app do capstone (Dia 7) em `src/App.tsx`, `npm install && npm run build` (ou `dev`) para confirmar que **compila e roda**; **remover o scaffold ao final**. (Alternativa mais leve: `npx tsc --noEmit` num arquivo isolado para checar os tipos do capstone.)
- [ ] **Step 6:** Reportar resultado ao usuário; **commit fica a cargo dele**.

---

## Self-Review (preenchido)

- **Cobertura do spec:** os 7 dias do spec mapeiam 1:1 nas Tasks 1–7; os 5 pontos de fiação → Task 8; verificação + reprodutibilidade adaptada → Task 9. ✓
- **Placeholders:** nenhum "TODO/depois"; cada dia tem seções concretas, snippets TSX representativos e os 7 alvos de quiz. (A prosa final é escrita na execução, seguindo o molde — mesmo grau de detalhe dos planos de css/js-essentials já executados.)
- **Consistência de nomes:** slugs de pasta ↔ imports em `lessons.ts`/`TheoryReader`/`QuizRunner` conferem (`day-01-componentes-e-jsx` … `day-07-projeto-final-tarefas`); export `REACT_ESSENTIALS_LESSONS` e helpers `getReactEssentials*`; chave `'react-essentials'` igual em `index.ts`/`MDX_IMPORTS`/`QUIZ_IMPORTS`/`stacks.ts`. O tipo `Tarefa` e a função `remover`/`onRemover` do capstone batem entre as seções do Dia 7. ✓
- **Risco MDX:** sinalizado em destaque (todo JSX em fences ```` ```tsx ````; validar no build) — o ponto mais provável de falha deste módulo.
