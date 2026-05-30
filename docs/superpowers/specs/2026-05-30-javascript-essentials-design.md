# JavaScript Essencial (`javascript-essentials`) — Design Spec

**Date:** 2026-05-30
**Status:** Approved

---

## Context

`javascript-essentials` é o 5º (e penúltimo) curso a ser construído da **Trilha de Fundamentos** (spec: `2026-05-30-trilha-fundamentos-design.md`) e o **último `coming-soon`** dos 6 mini-cursos do roadmap. Hoje está cadastrado em `stacks.ts` como placeholder (`status: 'coming-soon'`, `totalDays: 7`, cor `amber`, ícone `📜` já presente no `STACK_ICONS`), sem nenhum conteúdo.

**Papel — rampa, não overlap:** é a porta de entrada para o stack avançado `javascript` (30 dias, "JavaScript avançado de verdade", que começa em coerção/closures/prototype/event-loop). O Essencial cobre o básico de verdade — a linguagem na prática — e entrega o aluno pronto para o avançado. **Nada de internals** (sem V8, sem prototype chain profundo, sem event loop detalhado — só uma intro conceitual no dia de assíncrono).

**Não confundir** com o stack `javascript` (avançado, `level: 'avancado'`, conteúdo em `src/content/javascript/`). Este é a base introdutória de 7 dias, `level: 'fundamentos'`, conteúdo novo em `src/content/javascript-essentials/`.

Segue o mesmo molde já entregue em `typescript-essentials` e `css-essentials` (estrutura de arquivos, fiação em 5 pontos, formato de conteúdo).

## Decisões fechadas com o usuário

- **7 dias** (mantém o spec da trilha e os irmãos `html`/`css-essentials`; não redimensionado para 3 como `git`/`ts-essentials`/`frontend-architecture`).
- **Exemplos console-first (requisito de reprodutibilidade):** Dias 1–5 são **JS puro rodável** no console do navegador ou Node, com a saída mostrada em comentário (ex.: `console.log(total) // → 42`). Os Dias 6 (DOM) e 7 (capstone) usam trechos **HTML+JS mínimos e completos**, copiáveis para um `.html`. Mantém a pedagogia "copia e vê funcionar" do CSS, adaptada ao JS.
- **DOM e Eventos ganham um dia próprio (Dia 6)** e o **Dia 7 = capstone** (mini-app interativo de síntese), espelhando o Dia 7 do CSS. Para abrir esse dia sem passar de 7, **"Objetos & Arrays" e "Métodos de Array" foram fundidos** num único dia de dados (Dia 4).
- **7 questões por quiz** (volta ao número do spec da trilha; mantém o formato dos irmãos com 6 `multiple-choice` + 1 `true-false`).
- Ao final, flipar o stack de `coming-soon` → `available`.

## Os 7 dias

Cada dia é uma pasta em `apps/web/src/content/javascript-essentials/` com 3 arquivos (`metadata.json`, `theory.mdx`, `quiz.json`), idênticos em formato aos de `content/css-essentials/`.

| Dia | Slug da pasta | Título (`title`) | Tópicos a cobrir |
|-----|---------------|------------------|------------------|
| 1 | `day-01-valores-tipos-variaveis` | Valores, Tipos e Variáveis | `let` vs `const` (e por que não `var`); primitivos (string, number, boolean, null, undefined); `typeof`; coerção (e os perigos do `==`); template strings |
| 2 | `day-02-operadores-condicionais-loops` | Operadores, Condicionais e Loops | aritméticos/comparação/lógicos; `===` vs `==`; truthy/falsy; `if`/`else`/ternário/`switch`; `for`, `while`, `for...of`; `break`/`continue` |
| 3 | `day-03-funcoes` | Funções | declaração vs expressão; arrow functions; parâmetros, default, rest; retorno; escopo (global/função/bloco); introdução a closures |
| 4 | `day-04-objetos-arrays-metodos` | Objetos, Arrays e Métodos de Array | criar e acessar objetos (dot vs bracket); arrays e indexação; destructuring e spread; foco em `map`/`filter`/`reduce`/`find` (imutabilidade, encadeamento), com menções curtas a `forEach`/`some`/`every`/`sort` |
| 5 | `day-05-assincrono` | Assíncrono | síncrono vs assíncrono; event loop (intro conceitual); callbacks; promises (`.then`/`.catch`); `async`/`await`; `try/catch`; `fetch` + `await res.json()` |
| 6 | `day-06-dom-e-eventos` | DOM e Eventos | o que é o DOM; selecionar (`querySelector`); manipular (`textContent`, `classList`, `createElement`/`append`); `addEventListener` e o objeto `event`; delegação de eventos |
| 7 | `day-07-projeto-final-app` | Projeto Final — App Interativo | **capstone de síntese**: lista de tarefas que (a) carrega itens iniciais via `fetch`, (b) renderiza no DOM com `map`, (c) adiciona via input + evento de clique, (d) remove via delegação de eventos. Reúne objetos/arrays/métodos (Dia 4), async (Dia 5) e DOM/eventos (Dia 6). `import`/`export` aparece numa seção curta de fechamento ("como você dividiria este app em arquivos"). Entregar o app final inteiro copiável num `.html`. |

**Decisão estrutural:** para dar ao **DOM e Eventos um dia próprio** (Dia 6) sem passar de 7 dias, **"Objetos & Arrays" e "Métodos de Array" foram fundidos** no Dia 4 (dia de dados). Com isso o **capstone (Dia 7) vira síntese pura** — reutiliza o DOM/eventos do Dia 6, como o Dia 7 do CSS reutilizava flex/grid dos dias anteriores, em vez de introduzir DOM "na hora". **Trade-off assumido:** o Dia 4 é o **mais denso** do curso (objetos + arrays + métodos juntos), então será escopado com foco nos métodos de maior uso (`map`/`filter`/`reduce`/`find`) e menções curtas aos demais (`forEach`/`some`/`every`/`sort`); `estimatedMinutes` ~55 nesse dia.

**Ramo para o avançado:** ao terminar, o aluno conhece a sintaxe e os padrões do dia a dia (variáveis, fluxo, funções, dados, async, DOM) e está pronto para o stack `javascript` avançado, que aprofunda os *porquês* (coerção em detalhe, closures, prototype, event loop, V8).

## Arquitetura de conteúdo (molde — não reinventar)

Referências de molde: `content/css-essentials/day-01-seletores-cascata-especificidade/{metadata.json,theory.mdx,quiz.json}`, `features/curriculum/data/css-essentials-lessons.ts`, e o tipo `LessonMetadata` em `features/curriculum/types.ts`.

### Arquivos novos
```
apps/web/src/content/javascript-essentials/
  day-01-valores-tipos-variaveis/      metadata.json + theory.mdx + quiz.json
  ... (7 pastas) ...
  day-07-projeto-final-app/

apps/web/src/features/curriculum/data/javascript-essentials-lessons.ts
  (exporta JAVASCRIPT_ESSENTIALS_LESSONS, getJavaScriptEssentialsLessonById,
   getJavaScriptEssentialsLessonsByWeek — espelha css-essentials-lessons.ts)
```

### Pontos de integração (5 edits, mesmo padrão do CSS)
1. **Criar** 7 pastas × 3 arquivos (21 arquivos) em `content/javascript-essentials/`.
2. **Criar** `data/javascript-essentials-lessons.ts` (importa os 7 `metadata.json`, exporta o array + os 2 helpers).
3. **Editar** `data/index.ts`: `import { JAVASCRIPT_ESSENTIALS_LESSONS }` + `if (stackId === 'javascript-essentials') return JAVASCRIPT_ESSENTIALS_LESSONS`.
4. **Editar** `TheoryReader.tsx`: bloco `'javascript-essentials'` no `MDX_IMPORTS` (7 entradas `theory.mdx`).
5. **Editar** `QuizRunner.tsx`: bloco `'javascript-essentials'` no `QUIZ_IMPORTS` (7 entradas `quiz.json`); **e** `stacks.ts`: flipar `javascript-essentials` de `coming-soon` → `available`.

> Nota: o ícone `'javascript-essentials': '📜'` em `StackSelectorPage.tsx` **já existe** — nada a fazer lá.

## Formato de conteúdo

**`metadata.json`** — schema `LessonMetadata`:
- `id` (`"day-0N"`), `day` (número), `week: 1`, `title`, `slug`, `topics` (array descritivo).
- `difficulty: "foundational"`, `estimatedMinutes` 45–55 (o Dia 4, mais denso, fica ~55).
- `prerequisites`: dia 1 = `[]`; dias seguintes = `["day-0(N-1)"]`.
- `hasVisualizer: false`, `hasChallenge: false`, `xpReward: 100`.

**`theory.mdx`** — `# Título` na 1ª linha, parágrafo de abertura motivando o tema, seções `##` com prosa + blocos de código, e `> **Resumo:**` ao final. pt-BR, tom direto e prático (igual a `css-essentials`/`typescript-essentials`).
- Exemplos principais são **blocos ```` ```js ```` autocontidos e rodáveis** (console-first), com a saída em comentário (`// → ...`).
- Nos Dias 6 e 7, usar ```` ```html ```` / ```` ```js ```` com trechos completos copiáveis (o app final inteiro de ponta a ponta no Dia 7).
- **Cuidado MDX:** `{`, `}` e `<` só dentro de fences ou backticks (senão o MDX tenta interpretar como JSX/expressão).

**`quiz.json`** — `lessonId` (`"day-0N"`), `passingScore: 70`, e `questions`: **7 questões** (6 `multiple-choice` com 4 `options` e `correctAnswer` 0-indexed + 1 `true-false` com `options: ["Verdadeiro", "Falso"]`). Cada questão com `id` (`q1`..`q7`), `type`, `question`, `options`, `correctAnswer`, e uma `explanation` que ensina o porquê (não só justifica).

## Verificação (end-to-end)

1. `pnpm -C apps/web build` (`tsc -b && vite build`) — garante que todos os imports de `metadata.json`/`theory.mdx`/`quiz.json` resolvem e o data file tipa. (Erro de path de `import()` em `TheoryReader`/`QuizRunner` só aparece aqui.)
2. `pnpm -C apps/web test:run` — todos os testes passando.
3. `pnpm -C apps/web dev` + preview: na home (seção **Fundamentos**) o card **JavaScript Essencial** aparece disponível (não "Em breve").
4. Abrir os 7 dias: teoria (MDX) renderiza com blocos de código destacados; quiz carrega 7 questões e permite submeter (corte 70); fluxo `theory → quiz → complete`.
5. **Teste de reprodutibilidade:** copiar 2–3 exemplos console (Dias 1–5) para o Node/console e conferir a saída; copiar trechos de DOM (Dia 6) e o app do Dia 7 para um `.html`, abrir no navegador e ver a lista de tarefas carregar (fetch), renderizar e responder a adicionar/remover.

## Riscos / pontos de atenção

- **Paths de `import()`** em `TheoryReader`/`QuizRunner` devem casar exatamente com os nomes das pastas (Vite exige paths estáticos) — erro de digitação só falha no `build`.
- **Id com hífen** (`javascript-essentials`): manter consistência entre `id`, pasta `content/javascript-essentials/`, chave em `MDX_IMPORTS`/`QUIZ_IMPORTS` e o `if (stackId === ...)` no `index.ts`. Export = `JAVASCRIPT_ESSENTIALS_LESSONS`.
- **MDX + JS:** muitos exemplos terão `{`, `}`, `<`, `=>`, comparações — todos devem ficar dentro de fences ```` ```js ````. Atenção especial a texto fora de código.
- **`fetch` no Dia 7:** usar uma URL pública estável (ex.: `https://jsonplaceholder.typicode.com/todos`) ou degradar com dados locais/`try/catch`, para o exemplo não quebrar offline. O capstone deve funcionar mesmo se o fetch falhar (fallback a uma lista inicial).
- **Overlap com o `javascript` avançado:** manter o recorte introdutório; o event loop entra só como intro conceitual no Dia 6, sem detalhar microtasks/macrotasks (isso é do avançado).
