# Trilha de Fundamentos — Design Spec

**Date:** 2026-05-30
**Status:** Approved

---

## Context

Hoje a plataforma React Academy é uma **grade plana de stacks densos/avançados** (JavaScript "avançado de verdade", TypeScript a partir de `conditional types`, React internals, CSS Moderno, AI, Algoritmos). **Não existe nenhuma porta de entrada:** quem não domina o básico cai direto no nível difícil, e "primeiras posições" hoje é só ordem do array `STACKS`, sem nenhuma noção visível de nível.

Este spec cria uma **Trilha de Fundamentos**: 6 mini-cursos de **7 dias / 1 semana** cada, posicionados antes dos stacks aprofundados, e uma **reestruturação da home** que separa visualmente "Fundamentos" de "Avançado".

**Princípio de simetria:** todo stack pesado de linguagem ganha seu gêmeo de Fundamentos. JS, TS e CSS têm stack avançado; logo, cada um ganha uma rampa (`JavaScript Essencial`, `TypeScript Essencial`, `CSS Essencial`). Sem isso, esses três seriam os únicos stacks avançados sem fundação.

**Decisões fechadas com o usuário:**
- 6 cursos, **7 dias cada**, na ordem **estrutura primeiro**: HTML/a11y → CSS Essencial → JS Essencial → TS Essencial → Git → Boas Práticas.
- Home dividida em **duas seções**: "Fundamentos" (em cima) e "Avançado" (embaixo).
- Cursos entram já na home como **`coming-soon`** (roadmap visível desde o dia 1); cada um vira `available` quando o conteúdo fica pronto.
- Sem challenge (`hasChallenge: false`), consistente com os stacks recentes.
- Conteúdo em **pt-BR**, mesmo formato/arquitetura do stack de CSS — só que pela metade (7 dias).

**Escopo deste spec:** o **roadmap** (os 6 cursos) + a **reestruturação da home**. A reestruturação é o primeiro plano de implementação; cada curso é construído individualmente depois (spec já embutido aqui → plano → conteúdo dos 7 dias), exatamente como tocamos o CSS.

---

## A Trilha — 6 Cursos (7 dias cada)

Ordem da trilha = ordem de exibição na seção "Fundamentos" e ordem de construção.

| # | Curso | `id` | `color` | Recorte |
|---|-------|------|---------|---------|
| 1 | HTML Semântico & Acessibilidade | `html` | `red` | semântica, landmarks, formulários, ARIA, teclado, WCAG |
| 2 | CSS Essencial | `css-essentials` | `rose` | box model, especificidade, flexbox, grid básico, responsividade |
| 3 | JavaScript Essencial | `javascript-essentials` | `amber` | tipos, funções, arrays/objetos, async, `fetch`, DOM |
| 4 | TypeScript Essencial | `typescript-essentials` | `sky` | tipos, interfaces, unions, generics-101, utility types, React |
| 5 | Git & Fluxo de Trabalho | `git` | `teal` | commits, branches, merge/rebase, conflitos, PRs |
| 6 | Boas Práticas & Arquitetura Frontend | `frontend-architecture` | `emerald` | clean code, componentização, organização, estado, abstração |

**Cores:** `css-essentials` (`rose`), `javascript-essentials` (`amber`) e `typescript-essentials` (`sky`) ecoam a família dos gêmeos avançados (`pink`, `yellow`, `indigo`). `html`, `git` e `frontend-architecture` ganham acentos novos. Ícones e shades são facilmente ajustáveis.

**Dificuldade:** `beginner → intermediate`. Os primeiros dias de cada curso `beginner`; dias de síntese/aplicação `intermediate`.

### 1. HTML Semântico & Acessibilidade (`html`)

> *weekTheme:* `Estrutura & Acessibilidade`

| Dia | Título | Tópicos |
|-----|--------|---------|
| 01 | Anatomia do Documento | estrutura HTML, `<head>`, metadados, encoding, viewport, o que o navegador monta |
| 02 | Tags Semânticas & Landmarks | `header/nav/main/article/section/aside/footer`, outline, hierarquia de headings |
| 03 | Texto, Listas & Links | semântica de conteúdo, `<a>` vs `<button>`, `<time>`, `<figure>`, listas |
| 04 | Imagens & Mídia Acessível | `alt` eficaz, `<picture>`, `<figure>/<figcaption>`, legendas, lazy loading |
| 05 | Formulários & Validação | `<label>`, tipos de input, `required`/`pattern`, validação nativa, `<fieldset>`, erros acessíveis |
| 06 | ARIA Quando o HTML Não Basta | roles, states/properties, live regions, "no ARIA é melhor que ARIA ruim", foco programático |
| 07 | Teclado & WCAG na Prática | ordem de tabulação, foco visível, skip links, contraste, leitor de tela, checklist WCAG |

### 2. CSS Essencial (`css-essentials`)

> *weekTheme:* `Fundamentos de Estilo & Layout`

| Dia | Título | Tópicos |
|-----|--------|---------|
| 01 | Como o CSS Funciona | seletores, cascata, herança, especificidade, origem, `!important` (e por que evitar) |
| 02 | Box Model & Display | `box-sizing`, margin/border/padding, `display`, margin collapse |
| 03 | Cores, Unidades & Tipografia | hex/rgb/hsl, `px`/`rem`/`em`/`%`/`vw`, web fonts, propriedades de texto |
| 04 | Flexbox | eixo principal/cruzado, `justify-content`/`align-items`, `flex-grow/shrink/basis`, `gap`, wrap |
| 05 | Grid Básico | `grid-template-columns/rows`, `fr`, `gap`, posicionamento, áreas nomeadas |
| 06 | Posicionamento & Fluxo | `position` (relative/absolute/fixed/sticky), `z-index`, stacking context, overflow |
| 07 | Responsividade | media queries, mobile-first, unidades fluidas, imagens responsivas, breakpoints |

### 3. JavaScript Essencial (`javascript-essentials`)

> *weekTheme:* `A Linguagem na Prática`

| Dia | Título | Tópicos |
|-----|--------|---------|
| 01 | Valores, Tipos & Variáveis | `let`/`const`, primitivos, coerção, `typeof`, template strings |
| 02 | Operadores, Condicionais & Loops | `===`, truthy/falsy, `if`/`switch`, `for`/`while`, `for...of` |
| 03 | Funções | declaração vs expressão, arrow, parâmetros/default/rest, escopo, intro a closures |
| 04 | Objetos & Arrays | criação, acesso, destructuring, spread, métodos básicos |
| 05 | Métodos de Array | `map`/`filter`/`reduce`/`find`/`some`/`every`/`sort`, imutabilidade, encadeamento |
| 06 | Assíncrono | event loop (intro), callbacks, promises, `async`/`await`, `fetch` e JSON |
| 07 | DOM, Eventos & Módulos | selecionar/manipular DOM, eventos, delegação, `import`/`export` |

### 4. TypeScript Essencial (`typescript-essentials`)

> *weekTheme:* `Tipos do Básico ao React`

| Dia | Título | Tópicos |
|-----|--------|---------|
| 01 | Por que TS & Tipos Básicos | setup, inferência, primitivos, `any`/`unknown`, arrays/tuplas |
| 02 | Objetos, `interface` & `type` | tipando objetos, opcionais, `readonly`, interface vs type, extensão |
| 03 | Unions, Literais & Narrowing | union types, literal types, type guards, narrowing, `never` |
| 04 | Funções Tipadas | parâmetros/retorno, opcionais/default, overloads (intro), `void` |
| 05 | Generics-101 | funções genéricas, constraints, generics em tipos, por que importam |
| 06 | Utility Types & Manipulação | `Partial`/`Pick`/`Omit`/`Record`/`Readonly`, `keyof`, indexed access |
| 07 | TS no React | tipando props, `useState`/`useRef`, eventos, `children`, componentes |

### 5. Git & Fluxo de Trabalho (`git`)

> *weekTheme:* `Versionamento & Colaboração`

| Dia | Título | Tópicos |
|-----|--------|---------|
| 01 | Fundamentos & Primeiro Repositório | o que é Git, `init`/`clone`, working tree/staging/repo, `status`/`add`/`commit` |
| 02 | Histórico & Desfazer | `log`, `diff`, `show`, `restore`/`reset`/`revert`, `.gitignore` |
| 03 | Branches | criar/trocar, por que ramificar, `HEAD`, fast-forward vs 3-way merge |
| 04 | Merge, Rebase & Conflitos | `merge` vs `rebase`, resolver conflitos, quando usar cada um |
| 05 | Remotos & GitHub | `remote`, `push`/`pull`/`fetch`, tracking branches, autenticação |
| 06 | Pull Requests & Code Review | fluxo de PR, review, comentários, conventional commits, boas mensagens |
| 07 | Fluxos de Trabalho na Prática | trunk-based vs git-flow, feature branches, hotfix, boas práticas de equipe |

### 6. Boas Práticas & Arquitetura Frontend (`frontend-architecture`)

> *weekTheme:* `Código Limpo & Arquitetura`

| Dia | Título | Tópicos |
|-----|--------|---------|
| 01 | Clean Code | nomes, funções pequenas, early return, comentários úteis, código legível |
| 02 | Componentização | responsabilidade única, composição, props bem desenhadas, quando quebrar |
| 03 | Organização do Projeto | feature-based vs por tipo, colocation, barrel files, convenções |
| 04 | Separação de Responsabilidades | UI vs lógica vs dados, custom hooks, camadas, dependências |
| 05 | Gestão de Estado | local vs global vs servidor, quando usar o quê, evitar over-engineering |
| 06 | Quando Abstrair (e Quando Não) | DRY vs WET, regra dos três, premature abstraction, acoplamento/coesão |
| 07 | Qualidade & Revisão | o que testar, lint/format, a11y, performance básica, checklist de PR |

---

## Reestruturação da Home

### Tipo `Stack`

Adicionar campo **obrigatório** `level`:

```ts
export interface Stack {
  id: string
  name: string
  tagline: string
  description: string
  totalDays: number
  status: 'available' | 'coming-soon'
  level: 'fundamentos' | 'avancado'   // novo
  color: string
  weekThemes?: string[]
}
```

- Os **7 stacks atuais** (javascript, typescript, react, css, ai, algorithms, nodejs) recebem `level: 'avancado'`.
- Os **6 novos** recebem `level: 'fundamentos'` e `status: 'coming-soon'`.

### `StackSelectorPage.tsx`

- Agrupar `STACKS` por `level` e renderizar **duas seções rotuladas**, "Fundamentos" primeiro e "Avançado" depois, cada uma com o mesmo grid de cards. Ordem dentro da seção = ordem do array.
- **Copy do header:** o subtítulo atual ("30 dias de conteúdo focado…") está defasado (a trilha é de 7 dias). Trocar por algo de nível, ex.: *"Comece pelos fundamentos e avance para os stacks aprofundados."*
- **`COLOR_MAP`:** adicionar as 6 cores novas (`red`, `rose`, `amber`, `sky`, `teal`, `emerald`) **e** o `purple` que falta hoje (o card de AI usa `color: 'purple'` mas cai no fallback azul). Cada entrada com strings literais completas (`ring-*`, `bg-*`, `text-*`, `icon`).
- **Borda de hover:** hoje o card usa a classe dinâmica `hover:border-${stack.color}-500/50`, que o Tailwind não consegue gerar estaticamente (template em runtime). Mover a borda de hover para o `COLOR_MAP` como string literal (campo `hoverBorder`, ex.: `'hover:border-red-500/50'`) e consumir `colors.hoverBorder`. Conserta um problema latente dos stacks atuais e garante que as cores novas funcionem.
- **`STACK_ICONS`:** ícones para os 6 novos (placeholders ajustáveis): `html: '📄'`, `css-essentials: '🖌️'`, `javascript-essentials: '📜'`, `typescript-essentials: '🔷'`, `git: '🌿'`, `frontend-architecture: '🏛️'`.

### Entradas em `stacks.ts` (registro dos 6, como `coming-soon`)

```ts
{ id: 'html', name: 'HTML Semântico & Acessibilidade',
  tagline: '7 dias da base semântica e acessível da web',
  description: 'Estrutura de documentos, tags semânticas, formulários, ARIA e WCAG — a fundação que todo front pressupõe.',
  totalDays: 7, status: 'coming-soon', level: 'fundamentos', color: 'red',
  weekThemes: ['Estrutura & Acessibilidade'] },

{ id: 'css-essentials', name: 'CSS Essencial',
  tagline: '7 dias do box model ao layout responsivo',
  description: 'Cascata, especificidade, box model, flexbox, grid e responsividade — a base antes do CSS moderno.',
  totalDays: 7, status: 'coming-soon', level: 'fundamentos', color: 'rose',
  weekThemes: ['Fundamentos de Estilo & Layout'] },

{ id: 'javascript-essentials', name: 'JavaScript Essencial',
  tagline: '7 dias de JavaScript do zero ao assíncrono',
  description: 'Tipos, funções, arrays, objetos, async/await, fetch e DOM — a rampa para o JS avançado.',
  totalDays: 7, status: 'coming-soon', level: 'fundamentos', color: 'amber',
  weekThemes: ['A Linguagem na Prática'] },

{ id: 'typescript-essentials', name: 'TypeScript Essencial',
  tagline: '7 dias de tipos, do básico ao React',
  description: 'Tipos, interfaces, unions, narrowing, generics e utility types — a rampa para o TS avançado.',
  totalDays: 7, status: 'coming-soon', level: 'fundamentos', color: 'sky',
  weekThemes: ['Tipos do Básico ao React'] },

{ id: 'git', name: 'Git & Fluxo de Trabalho',
  tagline: '7 dias de Git e colaboração de verdade',
  description: 'Commits, branches, merge/rebase, conflitos, PRs e conventional commits — o fluxo do dia a dia.',
  totalDays: 7, status: 'coming-soon', level: 'fundamentos', color: 'teal',
  weekThemes: ['Versionamento & Colaboração'] },

{ id: 'frontend-architecture', name: 'Boas Práticas & Arquitetura Frontend',
  tagline: '7 dias de código limpo e arquitetura',
  description: 'Clean code, componentização, organização por feature, estado e quando abstrair — síntese dos fundamentos.',
  totalDays: 7, status: 'coming-soon', level: 'fundamentos', color: 'emerald',
  weekThemes: ['Código Limpo & Arquitetura'] },
```

---

## Arquitetura de Conteúdo (por curso)

Idêntica à do stack de CSS, só que 7 dias. Quando um curso `<id>` é construído:

### Arquivos novos

```
apps/web/src/content/<id>/
  day-01-<slug>/   metadata.json + theory.mdx + quiz.json
  ... (7 pastas) ...
  day-07-<slug>/

apps/web/src/features/curriculum/data/<id>-lessons.ts
  (exporta <ID>_LESSONS, get<Id>LessonById, get<Id>LessonsByWeek — cópia de css-lessons.ts)
```

### Arquivos modificados (fiação, 4 pontos por curso)

| Arquivo | Mudança |
|---------|---------|
| `features/curriculum/data/index.ts` | `import { <ID>_LESSONS }` + `if (stackId === '<id>') return <ID>_LESSONS` |
| `features/lessons/components/TheoryReader.tsx` | bloco `'<id>'` no `MDX_IMPORTS` (7 entradas `theory.mdx`) |
| `features/lessons/components/QuizRunner.tsx` | bloco `'<id>'` no `QUIZ_IMPORTS` (7 entradas `quiz.json`) |
| `features/stacks/data/stacks.ts` | flipar o stack `<id>` de `coming-soon` → `available` |

> `MDX_IMPORTS`/`QUIZ_IMPORTS` são objetos com chave = `stackId`. Ids com hífen (`css-essentials`) são chaves de string válidas; os nomes de export viram `CSS_ESSENTIALS_LESSONS` etc.

### Content format

**`metadata.json`** — mesmo schema de `LessonMetadata`:
```json
{
  "id": "day-01", "day": 1, "week": 1,
  "title": "...", "slug": "...",
  "topics": ["...", "..."],
  "difficulty": "beginner",
  "estimatedMinutes": 45,
  "prerequisites": [],
  "hasVisualizer": false, "hasChallenge": false,
  "xpReward": 100
}
```
- `week`: 1 para todos os 7 dias.
- `prerequisites`: dia N lista `[day-(N-1)]`; dia 1 = `[]`.
- `xpReward`: 100 (dia 7 = 150).

**`theory.mdx`** — ~120–180 linhas (mais enxuto que os 14-dias): H1, seções `##` com prosa + blocos de código (` ```html `/` ```css `/` ```js `/` ```ts `/` ```bash `/` ```text `), terminando com `> **Resumo:**`. Cuidado MDX: `{`/`}`/`<` só dentro de fences ou backticks.

**`quiz.json`** — `lessonId`, `passingScore: 70`, **7 questões** `multiple-choice` (4 `options`, `correctAnswer` 0-indexed, `explanation` que ensina o porquê).

---

## Ordem de Execução

1. **Plano 1 — Reestruturação da home** (este é o próximo passo via writing-plans):
   - Campo `level` no tipo `Stack`; taggear os 7 stacks atuais como `avancado`.
   - Registrar os 6 novos em `stacks.ts` (`coming-soon`, `level: 'fundamentos'`).
   - Duas seções no `StackSelectorPage`; copy do header; `COLOR_MAP` (6 cores + `purple` + `hoverBorder`); `STACK_ICONS` (6 ícones).
   - Nenhum conteúdo ainda — os 6 aparecem como "Em breve" na seção Fundamentos.
2. **Planos 2–7 — um por curso**, na ordem da trilha (HTML → CSS Essencial → JS Essencial → TS Essencial → Git → Boas Práticas):
   - Criar `content/<id>/day-01..07/`, `<id>-lessons.ts`, registrar no `index.ts`, fiar `TheoryReader`/`QuizRunner`, flipar o stack para `available`.

---

## Verification

Por plano:

- `pnpm -C apps/web typecheck` — sem erros de tipo (pega metadata fora do schema, imports quebrados, `level` faltando em algum stack).
- `pnpm -C apps/web test:run` — todos os testes passando.
- `pnpm -C apps/web build` — `tsc -b && vite build` compila (pega paths de `import()` de MDX/JSON digitados errado — o erro mais provável).
- **Manual (home):** `/` mostra duas seções; os 6 cards de Fundamentos aparecem como "Em breve" (e ficam disponíveis conforme construídos), com cor/ícone corretos e borda de hover funcionando.
- **Manual (curso):** `/<id>` → lista de 7 dias; `/<id>/day/day-01/theory` → teoria renderiza; quiz → score e explicações; fluxo `theory → quiz → complete`.

### Riscos / pontos de atenção

- **Paths de `import()`** em `TheoryReader`/`QuizRunner` precisam casar exatamente com os nomes das pastas (Vite exige paths estáticos). Erro de digitação só aparece no `build`.
- **Ids com hífen** (`css-essentials`, `javascript-essentials`, `typescript-essentials`) — manter consistência entre `id`, nome da pasta `content/<id>/`, chave em `MDX_IMPORTS`/`QUIZ_IMPORTS` e o `if (stackId === ...)` no `index.ts`.
- **Tailwind + cores dinâmicas** — resolvido movendo `hoverBorder` para o `COLOR_MAP` como literal; as 6 cores novas precisam existir lá como strings completas para o Tailwind gerar as classes.
- **Volume** — 6 × 7 dias = 42 dias de conteúdo. Construir curso a curso (1 plano cada) mantém revisável e cada entrega fica verde.
