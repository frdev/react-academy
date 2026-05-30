# JavaScript Essencial (`javascript-essentials`) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans para implementar tarefa a tarefa. Os passos usam checkbox (`- [ ]`).

**Goal:** Construir o módulo `javascript-essentials` (7 dias, Trilha de Fundamentos) — 21 arquivos de conteúdo + 5 pontos de fiação — e deixar o stack `available`.

**Architecture:** Conteúdo-como-arquivos por dia (`metadata.json` + `theory.mdx` + `quiz.json`) em `apps/web/src/content/javascript-essentials/`, registrado num data file e fiado em `TheoryReader`/`QuizRunner`/`index.ts`/`stacks.ts`. Idêntico ao molde já entregue em `css-essentials` e `typescript-essentials`.

**Tech Stack:** React 19 + Vite + MDX (`@mdx-js/rollup` + `rehype-pretty-code`) + JSON imports; TypeScript; pnpm. Sem libs novas.

**Spec:** `docs/superpowers/specs/2026-05-30-javascript-essentials-design.md` (aprovado).

**Commits:** por preferência do usuário, o **commit fica a cargo dele** (ou um único commit ao final, como em `css-essentials`). **Não rodar `git commit` automaticamente.**

---

## Contexto (autocontido)

`javascript-essentials` está cadastrado em `stacks.ts` como placeholder (`status: 'coming-soon'`, `totalDays: 7`, cor `amber`, `weekThemes: ['A Linguagem na Prática']`). O ícone `'javascript-essentials': '📜'` já existe em `StackSelectorPage.tsx` (`STACK_ICONS`) — **nada a fazer lá**.

É a **rampa** para o stack avançado `javascript` (que começa em coerção/closures/prototype/event-loop). Mantenha tudo **introdutório**; sem internals.

**Requisito central — reprodutibilidade (console-first):** Dias 1–5 são **JS puro rodável** no console do navegador ou Node, com a saída em comentário (`console.log(x) // → 42`). Dias 6 (DOM) e 7 (capstone) usam **HTML+JS mínimos e completos**, copiáveis para um `.html`. O Dia 7 entrega o app inteiro copiável de ponta a ponta.

## Padrão a reproduzir (molde — não reinventar)

Cada dia é uma pasta com **3 arquivos**, idênticos em formato aos de `apps/web/src/content/css-essentials/day-01-seletores-cascata-especificidade/`:

- **`metadata.json`** — schema `LessonMetadata` (`apps/web/src/features/curriculum/types.ts`): `id` (`"day-0N"`), `day`, `week: 1`, `title`, `slug`, `topics` (array), `difficulty: "foundational"`, `estimatedMinutes` (45–55), `prerequisites` (`[]` no dia 1; `["day-0(N-1)"]` nos demais), `hasVisualizer: false`, `hasChallenge: false`, `xpReward: 100`.
- **`theory.mdx`** — `# Título` na 1ª linha, parágrafo de abertura motivando o tema, seções `##` com prosa + blocos de código, e `> **Resumo:**` ao final. pt-BR, tom direto e prático (igual `css-essentials`). Exemplos principais em blocos ```` ```js ```` autocontidos e rodáveis, **com a saída em comentário** (`// → ...`). **Cuidado MDX:** `{`, `}`, `<`, `=>` só dentro de fences ou backticks.
- **`quiz.json`** — `lessonId` (`"day-0N"`), `passingScore: 70`, e `questions`: **7 questões** (6 `multiple-choice` com 4 `options` + `correctAnswer` 0-indexed, e **1 `true-false`** com `options: ["Verdadeiro", "Falso"]`). `id` `q1`..`q7`, `explanation` que **ensina** o porquê.

## Arquivos de referência (molde)

- `apps/web/src/content/css-essentials/day-01-seletores-cascata-especificidade/{metadata.json,theory.mdx,quiz.json}` (formato + tom + capstone no day-07).
- `apps/web/src/features/curriculum/data/css-essentials-lessons.ts` (data file).
- `apps/web/src/features/curriculum/types.ts` (tipo `LessonMetadata`).

## Estrutura de arquivos

**Criar (21 conteúdo + 1 data file):**
```
apps/web/src/content/javascript-essentials/
  day-01-valores-tipos-variaveis/        metadata.json + theory.mdx + quiz.json
  day-02-operadores-condicionais-loops/  "
  day-03-funcoes/                        "
  day-04-objetos-arrays-metodos/         "
  day-05-assincrono/                     "
  day-06-dom-e-eventos/                  "
  day-07-projeto-final-app/              "
apps/web/src/features/curriculum/data/javascript-essentials-lessons.ts
```

**Modificar (fiação):** `data/index.ts`, `lessons/components/TheoryReader.tsx`, `lessons/components/QuizRunner.tsx`, `stacks/data/stacks.ts`.

---

## Task 1: Dia 1 — Valores, Tipos e Variáveis

**Files — Create:**
- `apps/web/src/content/javascript-essentials/day-01-valores-tipos-variaveis/metadata.json`
- `.../day-01-valores-tipos-variaveis/theory.mdx`
- `.../day-01-valores-tipos-variaveis/quiz.json`

- [ ] **Step 1: `metadata.json`**

```json
{
  "id": "day-01",
  "day": 1,
  "week": 1,
  "title": "Valores, Tipos e Variáveis",
  "slug": "valores-tipos-variaveis",
  "topics": [
    "let e const (e por que evitar var)",
    "tipos primitivos: string, number, boolean, null, undefined",
    "typeof e a checagem de tipo",
    "coerção e os perigos do ==",
    "comparação estrita com ===",
    "template strings com ${}"
  ],
  "difficulty": "foundational",
  "estimatedMinutes": 45,
  "prerequisites": [],
  "hasVisualizer": false,
  "hasChallenge": false,
  "xpReward": 100
}
```

- [ ] **Step 2: `theory.mdx`** — H1 `# Valores, Tipos e Variáveis`; abertura: programas guardam e transformam valores; JS tem tipos dinâmicos e uma coerção traiçoeira. Seções (console-first, cada exemplo com `// →`):
  - `## let e const (e por que esquecer o var)` — `const` (não reatribui), `let` (reatribui); reatribuir `const` → erro; `var` tem escopo de função/hoisting confuso, evite. Ex.: `const nome = "Ana"; nome = "Bia" // ❌ TypeError`.
  - `## Os tipos primitivos` — `string`, `number`, `boolean`, `null`, `undefined` (menção curta a `bigint`/`symbol`). Ex. com valores.
  - `## typeof: descobrindo o tipo` — `typeof "x" // → "string"`, `typeof 3 // → "number"`, e a pegadinha `typeof null // → "object"`.
  - `## Coerção: o lado traiçoeiro do JS` — `"5" + 1 // → "51"` (concatena) vs `"5" - 1 // → 4` (numérico); `==` coage (`"5" == 5 // → true`), `===` não (`"5" === 5 // → false`). Regra: **use sempre `===`**.
  - `## Template strings` — `` `Olá, ${nome}! Você tem ${idade} anos` ``; multilinha.
  - `> **Resumo:**` — let/const, primitivos, typeof, coerção, use `===`, template strings.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) diferença `let`/`const`; (q2) `typeof null` → `"object"`; (q3) `"5" + 1` → `"51"`; (q4) por que `===` em vez de `==`; (q5) qual NÃO é primitivo (ex.: `array`/`object`); (q6) resultado de uma template string; (q7 **true-false**) "`const` impede reatribuir a variável, mas um objeto declarado com `const` pode ter suas propriedades alteradas" → Verdadeiro.

---

## Task 2: Dia 2 — Operadores, Condicionais e Loops

**Files — Create:** `.../day-02-operadores-condicionais-loops/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — igual ao molde, com:
  - `"id": "day-02"`, `"day": 2`, `"title": "Operadores, Condicionais e Loops"`, `"slug": "operadores-condicionais-loops"`, `"prerequisites": ["day-01"]`, `"estimatedMinutes": 50`.
  - `topics`: `["operadores aritméticos e de atribuição", "comparação e a família ===", "valores truthy e falsy", "operadores lógicos && || ! e curto-circuito", "if/else, ternário e switch", "loops for, while e for...of"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Operadores, Condicionais e Loops`; abertura: decisões e repetição. Seções:
  - `## Operadores aritméticos e de atribuição` — `+ - * / %`, `+=`, `++`. Ex. com `// →`.
  - `## Comparação estrita` — `=== !== > <`; reforça `===` (link com Dia 1).
  - `## Truthy e falsy` — lista dos falsy: `false, 0, "", null, undefined, NaN`; todo o resto é truthy. Ex.: `if ("") // não entra`, `if ("0") // entra (string não-vazia)`.
  - `## Operadores lógicos e curto-circuito` — `&&`, `||`, `!`, `??` (nullish); `nome || "anônimo"` (default), `a ?? b` (só null/undefined).
  - `## Condicionais: if, ternário e switch` — `if/else`; ternário `cond ? a : b`; `switch` com `case`/`break`/`default`.
  - `## Loops: for, while e for...of` — `for` clássico; `while`; `for...of` em array; `break`/`continue`. Ex. somando um array com `// → 6`.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) qual valor é falsy (ex.: `0`); (q2) `"0"` é truthy ou falsy (truthy — string não-vazia); (q3) o que `||` faz num default; (q4) `??` vs `||` (nullish só pega null/undefined); (q5) saída de um ternário; (q6) `for...of` itera valores (vs `for...in` chaves); (q7 **true-false**) "`switch` sem `break` cai (fall-through) para o próximo `case`" → Verdadeiro.

---

## Task 3: Dia 3 — Funções

**Files — Create:** `.../day-03-funcoes/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-03"`, `"day": 3`, `"title": "Funções"`, `"slug": "funcoes"`, `"prerequisites": ["day-02"]`, `"estimatedMinutes": 50`. `topics`: `["declaração vs expressão de função", "arrow functions e retorno implícito", "parâmetros: default e rest", "escopo global, de função e de bloco", "introdução a closures"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Funções`; abertura: blocos reutilizáveis. Seções:
  - `## Declaração vs expressão` — `function soma(a,b){}` (hoisted) vs `const soma = function(){}`; diferença de hoisting.
  - `## Arrow functions` — `const dobro = n => n * 2`; retorno implícito; corpo com `{}` exige `return`.
  - `## Parâmetros: default e rest` — `function saudar(nome = "amigo")`; `function somarTudo(...nums)` com `reduce`. Ex. `// →`.
  - `## Escopo: onde a variável vive` — global, de função, de bloco (`let`/`const` em `{}`).
  - `## Closures: a função que lembra` — exemplo do contador: `function criarContador() { let n = 0; return () => ++n }`; `const c = criarContador(); c() // → 1; c() // → 2`.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) declaração vs expressão (hoisting); (q2) retorno implícito de arrow; (q3) o que faz `...nums` (rest); (q4) parâmetro default; (q5) o que é escopo de bloco; (q6) o que uma closure "lembra" (saída do contador); (q7 **true-false**) "arrow functions com corpo `{ }` precisam de `return` explícito para devolver valor" → Verdadeiro.

---

## Task 4: Dia 4 — Objetos, Arrays e Métodos de Array (o dia mais denso)

**Files — Create:** `.../day-04-objetos-arrays-metodos/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-04"`, `"day": 4`, `"title": "Objetos, Arrays e Métodos de Array"`, `"slug": "objetos-arrays-metodos"`, `"prerequisites": ["day-03"]`, `"estimatedMinutes": 55`. `topics`: `["objetos: criar e acessar (dot vs bracket)", "arrays e indexação", "destructuring e spread", "map e filter", "reduce", "find e os primos some/every/sort", "imutabilidade e encadeamento"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Objetos, Arrays e Métodos de Array`; abertura: estruturar dados e transformá-los. **Escopo controlado:** foco em `map`/`filter`/`reduce`/`find`; `forEach`/`some`/`every`/`sort` em menções curtas. Seções:
  - `## Objetos: criar e acessar` — literal `{ nome: "Ana", idade: 30 }`; `obj.nome` vs `obj["nome"]`; quando usar bracket (chave dinâmica).
  - `## Arrays: listas ordenadas` — `["a","b"]`, índice 0-based, `.length`.
  - `## Destructuring e spread` — `const { nome } = usuario`; `const [primeiro] = lista`; spread copiar/mesclar `{ ...obj, nova: 1 }` e `[...arr, novo]`.
  - `## Transformar com map e filter` — `nums.map(n => n*2) // → [2,4,6]`; `nums.filter(n => n > 1)`; ambos **retornam novo array**.
  - `## Acumular com reduce` — `nums.reduce((acc, n) => acc + n, 0) // → 6`; explicar acumulador + valor inicial.
  - `## Buscar e o resto da família` — `find` (primeiro que casa); `some`/`every` (booleano); `sort` (cuidado: ordena como string por padrão, e **muta**). Menções curtas.
  - `## Imutabilidade e encadeamento` — `map`/`filter` não mutam; encadear `arr.filter(...).map(...)`.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) `obj.x` vs `obj["x"]` / quando bracket; (q2) o que destructuring extrai; (q3) `[...a, b]` (cópia + append); (q4) `map` retorna novo array (não muta); (q5) o que `filter` devolve; (q6) resultado de um `reduce` somando; (q7 **true-false**) "`map` e `filter` modificam o array original" → Falso.

---

## Task 5: Dia 5 — Assíncrono

**Files — Create:** `.../day-05-assincrono/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-05"`, `"day": 5`, `"title": "Assíncrono"`, `"slug": "assincrono"`, `"prerequisites": ["day-04"]`, `"estimatedMinutes": 50`. `topics`: `["síncrono vs assíncrono", "event loop (intro conceitual)", "callbacks", "promises com then/catch", "async/await", "try/catch para erros", "fetch e JSON"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Assíncrono`; abertura: o navegador não pode travar esperando a rede. Seções (Dias 1–5 console-first; aqui pode usar `// → (depois de 1s)` para tempo):
  - `## Síncrono vs assíncrono` — JS roda numa thread; tarefas demoradas (rede, timers) não bloqueiam.
  - `## Uma intro ao event loop` — call stack + fila de callbacks; `setTimeout(fn, 0)` roda *depois* do código síncrono. **Sem** microtask/macrotask (isso é do avançado).
  - `## Callbacks (e por que cansam)` — `setTimeout(() => {...}, 1000)`; aninhar callbacks → "callback hell".
  - `## Promises` — estados (pending/fulfilled/rejected); `.then(...).catch(...)`.
  - `## async/await` — açúcar sobre promises; `await` só dentro de `async`; mais legível.
  - `## Tratando erros com try/catch` — envolver `await` em `try/catch`.
  - `## fetch: buscando dados` — `const res = await fetch(url); const dados = await res.json()`. Usar `https://jsonplaceholder.typicode.com/todos/1` como exemplo.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) por que assíncrono (não bloquear); (q2) saída ordem com `setTimeout(…,0)` vs síncrono; (q3) estados de uma promise; (q4) `await` precisa de função `async`; (q5) o que `fetch` retorna (uma promise); (q6) papel do `try/catch` com `await`; (q7 **true-false**) "`async/await` é uma forma mais legível de trabalhar com promises, não um mecanismo diferente" → Verdadeiro.

---

## Task 6: Dia 6 — DOM e Eventos

**Files — Create:** `.../day-06-dom-e-eventos/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-06"`, `"day": 6`, `"title": "DOM e Eventos"`, `"slug": "dom-e-eventos"`, `"prerequisites": ["day-05"]`, `"estimatedMinutes": 50`. `topics`: `["o que é o DOM", "selecionar elementos com querySelector", "manipular: textContent, classList, createElement", "addEventListener e o objeto event", "delegação de eventos"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# DOM e Eventos`; abertura: o DOM é a ponte entre JS e a página. **Exemplos agora são HTML+JS** (trechos completos copiáveis para um `.html`, com `<script>`). Seções:
  - `## O que é o DOM` — o navegador transforma o HTML numa árvore de objetos que o JS manipula.
  - `## Selecionar elementos` — `document.querySelector(".classe")`, `querySelectorAll` (NodeList). Bloco HTML+JS mínimo.
  - `## Manipular elementos` — `el.textContent = "..."`, `el.classList.add/remove/toggle`, `document.createElement` + `parent.append`.
  - `## Reagir a eventos` — `botao.addEventListener("click", (event) => {...})`; o objeto `event` e `event.target`.
  - `## Delegação de eventos` — um listener no pai trata cliques nos filhos via `event.target`; por que é útil (itens criados dinamicamente). Bloco HTML+JS completo.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões: (q1) o que é o DOM; (q2) `querySelector` vs `querySelectorAll`; (q3) como mudar texto (`textContent`); (q4) como ouvir clique (`addEventListener`); (q5) o que é `event.target`; (q6) vantagem da delegação (elementos dinâmicos / 1 listener); (q7 **true-false**) "`querySelector` retorna **todos** os elementos que casam com o seletor" → Falso (retorna só o primeiro).

---

## Task 7: Dia 7 — Projeto Final: App Interativo (capstone)

**Files — Create:** `.../day-07-projeto-final-app/{metadata.json,theory.mdx,quiz.json}`

- [ ] **Step 1: `metadata.json`** — `"id": "day-07"`, `"day": 7`, `"title": "Projeto Final — App Interativo"`, `"slug": "projeto-final-app"`, `"prerequisites": ["day-06"]`, `"estimatedMinutes": 50`. `topics`: `["estruturar um app no DOM", "carregar dados com fetch (com fallback)", "renderizar uma lista com map", "adicionar itens via input + evento", "remover via delegação de eventos", "dividir em módulos com import/export"]`.
- [ ] **Step 2: `theory.mdx`** — H1 `# Projeto Final — App Interativo`; abertura: juntar a semana num app de lista de tarefas. Seções (cada uma um trecho; ao final o **arquivo completo copiável**):
  - `## O que vamos construir` — uma lista de tarefas: carrega itens via `fetch`, renderiza, adiciona e remove.
  - `## A estrutura HTML` — `<input>`, `<button>`, `<ul id="lista">`.
  - `## Carregar tarefas com fetch` — `fetch('https://jsonplaceholder.typicode.com/todos?_limit=3')` → `.json()`; **fallback**: `try/catch` que cai numa lista local se a rede falhar (Dia 5).
  - `## Renderizar com map` — array de tarefas → `map` gerando `<li>`; juntar e jogar em `lista.innerHTML` (ou `createElement`/`append`).
  - `## Adicionar tarefas` — clique no botão lê o `input.value`, dá `push` no array, re-renderiza (Dias 3, 4, 6).
  - `## Remover com delegação` — um listener na `<ul>`; `event.target` identifica o item; `filter` remove do array; re-renderiza (Dias 4, 6).
  - `## O arquivo completo` — **um `.html` inteiro copiável** (HTML + `<script>`), funcionando ponta a ponta, com o fetch tendo fallback offline.
  - `## Dividindo em módulos` — seção curta: `export function render(...)` / `import { render } from './render.js'`; "num projeto real você separaria render, dados e eventos em arquivos".
  - `## O que você usou` — recap citando os dias.
  - `> **Resumo:**`.
- [ ] **Step 3: `quiz.json`** — 7 questões integrativas: (q1) qual API busca os dados (`fetch`); (q2) por que o fallback `try/catch` (app funciona offline); (q3) o que renderiza a lista (`map`); (q4) por que delegação para remover (itens dinâmicos); (q5) o que `import`/`export` resolve (dividir em arquivos); (q6) qual método remove a tarefa do array (`filter`); (q7 **true-false**) "o app inteiro cabe num único `.html` sem build nem dependências" → Verdadeiro.

---

## Task 8: Integração (5 edits)

- [ ] **Step 1: Criar `apps/web/src/features/curriculum/data/javascript-essentials-lessons.ts`** (espelha `css-essentials-lessons.ts`):

```ts
import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/javascript-essentials/day-01-valores-tipos-variaveis/metadata.json'
import day02 from '@/content/javascript-essentials/day-02-operadores-condicionais-loops/metadata.json'
import day03 from '@/content/javascript-essentials/day-03-funcoes/metadata.json'
import day04 from '@/content/javascript-essentials/day-04-objetos-arrays-metodos/metadata.json'
import day05 from '@/content/javascript-essentials/day-05-assincrono/metadata.json'
import day06 from '@/content/javascript-essentials/day-06-dom-e-eventos/metadata.json'
import day07 from '@/content/javascript-essentials/day-07-projeto-final-app/metadata.json'

export const JAVASCRIPT_ESSENTIALS_LESSONS: LessonMetadata[] = [
  day01, day02, day03, day04, day05, day06, day07,
].map(l => l as LessonMetadata)

export function getJavaScriptEssentialsLessonById(id: string): LessonMetadata | undefined {
  return JAVASCRIPT_ESSENTIALS_LESSONS.find(l => l.id === id)
}

export function getJavaScriptEssentialsLessonsByWeek(week: number): LessonMetadata[] {
  return JAVASCRIPT_ESSENTIALS_LESSONS.filter(l => l.week === week)
}
```

- [ ] **Step 2: Editar `apps/web/src/features/curriculum/data/index.ts`** — adicionar o import junto dos outros e a linha no `getLessonsForStack` (antes do `return LESSONS` final):

```ts
import { JAVASCRIPT_ESSENTIALS_LESSONS } from './javascript-essentials-lessons'
// ...
  if (stackId === 'javascript-essentials') return JAVASCRIPT_ESSENTIALS_LESSONS
```

- [ ] **Step 3: Editar `apps/web/src/features/lessons/components/TheoryReader.tsx`** — adicionar bloco no objeto `MDX_IMPORTS` (modelo: bloco `'css-essentials'`):

```ts
  'javascript-essentials': {
    'day-01': () => import('@/content/javascript-essentials/day-01-valores-tipos-variaveis/theory.mdx'),
    'day-02': () => import('@/content/javascript-essentials/day-02-operadores-condicionais-loops/theory.mdx'),
    'day-03': () => import('@/content/javascript-essentials/day-03-funcoes/theory.mdx'),
    'day-04': () => import('@/content/javascript-essentials/day-04-objetos-arrays-metodos/theory.mdx'),
    'day-05': () => import('@/content/javascript-essentials/day-05-assincrono/theory.mdx'),
    'day-06': () => import('@/content/javascript-essentials/day-06-dom-e-eventos/theory.mdx'),
    'day-07': () => import('@/content/javascript-essentials/day-07-projeto-final-app/theory.mdx'),
  },
```

- [ ] **Step 4: Editar `apps/web/src/features/lessons/components/QuizRunner.tsx`** — bloco análogo no `QUIZ_IMPORTS`, apontando para `quiz.json`:

```ts
  'javascript-essentials': {
    'day-01': () => import('@/content/javascript-essentials/day-01-valores-tipos-variaveis/quiz.json'),
    'day-02': () => import('@/content/javascript-essentials/day-02-operadores-condicionais-loops/quiz.json'),
    'day-03': () => import('@/content/javascript-essentials/day-03-funcoes/quiz.json'),
    'day-04': () => import('@/content/javascript-essentials/day-04-objetos-arrays-metodos/quiz.json'),
    'day-05': () => import('@/content/javascript-essentials/day-05-assincrono/quiz.json'),
    'day-06': () => import('@/content/javascript-essentials/day-06-dom-e-eventos/quiz.json'),
    'day-07': () => import('@/content/javascript-essentials/day-07-projeto-final-app/quiz.json'),
  },
```

- [ ] **Step 5: Editar `apps/web/src/features/stacks/data/stacks.ts`** — no objeto do stack `javascript-essentials`, trocar `status: 'coming-soon'` → `status: 'available'`.

---

## Task 9: Verificação (end-to-end)

- [ ] **Step 1: Build** — `pnpm -C apps/web build` (ou `npm run build` em `apps/web`). Esperado: `tsc -b` + `vite build` sem erros (pega imports de MDX/JSON digitados errado e o data file fora do tipo).
- [ ] **Step 2: Testes** — `pnpm -C apps/web test:run`. Esperado: todos passando.
- [ ] **Step 3: Preview (home)** — `preview_start` + abrir `/`: na seção **Fundamentos**, o card **JavaScript Essencial** deve aparecer **disponível** (barra de progresso, sem "Em breve").
- [ ] **Step 4: Preview (curso)** — abrir `/javascript-essentials`: os 7 dias listados com títulos/min/pré-requisitos. Concluir teoria do Dia 1 → quiz carrega **7 questões** e permite submeter (corte 70). Conferir o console sem erros.
- [ ] **Step 5: Reprodutibilidade** — copiar 2–3 exemplos console (Dias 1–5) para o Node/console e conferir as saídas `// →`; copiar o app do Dia 7 para um `.html` (servir via `apps/web/public/_repro.html` no dev server), abrir, e ver a lista carregar (fetch), renderizar e responder a adicionar/remover. **Remover o arquivo temporário ao final.**
- [ ] **Step 6:** Reportar resultado ao usuário; **commit fica a cargo dele**.

---

## Self-Review (preenchido)

- **Cobertura do spec:** os 7 dias do spec mapeiam 1:1 nas Tasks 1–7 (incl. fusão do Dia 4 e DOM próprio no Dia 6); os 5 pontos de fiação → Task 8; verificação + reprodutibilidade → Task 9. ✓
- **Placeholders:** nenhum "TODO/depois"; cada dia tem seções concretas, exemplos representativos com `// →`, e os 7 alvos de quiz. (A prosa final é escrita na execução, seguindo o molde — não é placeholder, é o mesmo grau de detalhe do plano de `css-essentials` que foi executado com sucesso.)
- **Consistência de nomes:** slugs de pasta ↔ imports em `lessons.ts`/`TheoryReader`/`QuizRunner` conferem (`day-04-objetos-arrays-metodos`, `day-05-assincrono`, `day-06-dom-e-eventos`, `day-07-projeto-final-app`); export `JAVASCRIPT_ESSENTIALS_LESSONS` e helpers `getJavaScriptEssentials*` consistentes; chave `'javascript-essentials'` igual em `index.ts`/`MDX_IMPORTS`/`QUIZ_IMPORTS`/`stacks.ts`. ✓
