# React Essencial (`react-essentials`) — Design Spec

**Date:** 2026-05-30
**Status:** Approved

---

## Context

`react-essentials` é um curso da seção **Fundamentos** adicionado **fora dos 6 do roadmap** da Trilha de Fundamentos (a pedido do usuário, logo após `typescript-essentials`). Hoje está em `stacks.ts` como placeholder (`status: 'coming-soon'`, `totalDays: 7`, cor `blue`, ícone `⚛️` já presente no `STACK_ICONS`), sem conteúdo. Com os 6 cursos do roadmap concluídos, este é o último módulo de Fundamentos a construir.

**Papel — rampa, não overlap:** é a porta de entrada para o stack avançado `react` (30 dias, que começa em render-cycle/reconciliation/virtual-dom/fiber — internals profundos). O Essencial cobre o básico do dia a dia (componentes, JSX, props, estado, eventos, listas, `useEffect`) e entrega o aluno pronto para o avançado. **Nada de internals** (sem reconciliation, sem fiber, sem performance).

**React com TypeScript desde o 1º componente:** decisão central do stack. Todo exemplo é `.tsx` com **props e estado tipados** (`type`/`interface`, `useState<T>`, tipos de evento). Isso também cobre a lacuna deixada quando o `typescript-essentials` teve seu Dia 7 ("TS no React") removido por escolha do usuário — o React tipado mora aqui.

Segue o mesmo molde já entregue em `css-essentials`, `typescript-essentials` e `javascript-essentials` (estrutura de arquivos, fiação em 5 pontos, formato de conteúdo).

## Decisões fechadas com o usuário

- **7 dias** (como o stack indica e como `css`/`javascript`-essentials ficaram).
- **Reprodutibilidade — TSX ilustrativo + nota de setup:** React precisa de build (TSX + bundler), então **não** dá para "copiar para um `.html`" como em CSS/JS. Os exemplos são **componentes `.tsx` focados e bem explicados**; o **Dia 1** traz um passo curto de como criar um projeto React+TS de verdade (`npm create vite@latest -- --template react-ts`) e um ponteiro para um sandbox online (ex.: StackBlitz) para quem quiser rodar. Mantém TypeScript real; **não** usar Babel-no-navegador (contradiz o "TS desde o 1º componente" e ensina um padrão fora de produção).
- **Dia 7 = capstone** reescrevendo o **mesmo todo app do Dia 7 do `javascript-essentials`**, agora em React+TS. Contraste pedagógico explícito: "ontem você manipulou o DOM à mão; hoje o React faz por você" (declarativo, dirigido por estado).
- **7 questões por quiz** (6 `multiple-choice` + 1 `true-false`), consistente com `javascript-essentials`.
- Ao final, flipar o stack de `coming-soon` → `available`.

## Os 7 dias

Cada dia é uma pasta em `apps/web/src/content/react-essentials/` com 3 arquivos (`metadata.json`, `theory.mdx`, `quiz.json`), idênticos em formato aos de `content/javascript-essentials/`.

| Dia | Slug da pasta | Título (`title`) | Tópicos a cobrir |
|-----|---------------|------------------|------------------|
| 1 | `day-01-componentes-e-jsx` | Componentes e JSX | o que é React (UI declarativa, "descreva o resultado"); componente = função que retorna JSX; JSX é JavaScript (`className`, `{expressões}`, um elemento raiz / `<>...</>`); arquivos `.tsx`; **nota de setup**: criar projeto com `npm create vite@latest -- --template react-ts`, onde fica o componente, como `App` é renderizado |
| 2 | `day-02-props-tipadas` | Props e Composição | passar dados de pai para filho via props; **tipar props** com `type`/`interface`; destructuring de props; valores default; `children` e o tipo `ReactNode`; compor componentes (componentes dentro de componentes) |
| 3 | `day-03-estado-usestate` | Estado com useState | estado vs props; `useState<T>` (tipado); ler valor e usar o setter; por que mudar o estado re-renderiza; **atualização imutável** (criar novo valor, não mutar); múltiplos estados |
| 4 | `day-04-eventos-formularios` | Eventos e Formulários | manipular eventos (`onClick`, `onChange`, `onSubmit`); tipos de evento (`React.ChangeEvent<HTMLInputElement>`, `React.FormEvent`); **inputs controlados** (value + onChange ligados ao estado); `preventDefault` num form |
| 5 | `day-05-listas-condicional` | Listas e Renderização Condicional | renderizar arrays com `.map()` → JSX; a prop **`key`** (por que e qual usar); renderização condicional (`&&`, ternário, early return); tipar uma lista de itens (`Item[]`) |
| 6 | `day-06-useeffect-dados` | useEffect e Dados | efeitos colaterais (o que são); `useEffect(fn, deps)`; o **array de dependências** (vazio = uma vez); buscar dados com `fetch` dentro do effect (função async interna); estados de **loading/erro**; cleanup (intro curta) |
| 7 | `day-07-projeto-final-tarefas` | Projeto Final — Tarefas em React | **capstone**: o todo app do `javascript-essentials` reescrito em React+TS. Estado `tarefas` tipado (`Tarefa[]`), `useEffect` para carregar via `fetch` (com fallback), `.map` renderizando um `<TarefaItem>` tipado, **form controlado** para adicionar, `filter` (imutável) para remover. Mostrar o app completo (multi-componente) e como rodá-lo no Vite. **Contraste explícito** com a versão DOM-manual do Dia 7 do JS |

**Arco pedagógico:** componente → props → estado → interação → listas → efeitos/dados → tudo junto. O capstone fecha resolvendo o **mesmo problema** do JS de forma declarativa, evidenciando o que o React acrescenta (renderização dirigida por estado em vez de manipulação manual do DOM).

**Ramo para o avançado:** ao terminar, o aluno escreve componentes tipados com estado, eventos, listas e data fetching — e está pronto para o stack `react` avançado, que aprofunda os *porquês* (render cycle, reconciliation, performance, hooks avançados).

## Arquitetura de conteúdo (molde — não reinventar)

Referências de molde: `content/javascript-essentials/day-01-valores-tipos-variaveis/{metadata.json,theory.mdx,quiz.json}`, `features/curriculum/data/javascript-essentials-lessons.ts`, e o tipo `LessonMetadata` em `features/curriculum/types.ts`.

### Arquivos novos
```
apps/web/src/content/react-essentials/
  day-01-componentes-e-jsx/         metadata.json + theory.mdx + quiz.json
  day-02-props-tipadas/             "
  day-03-estado-usestate/           "
  day-04-eventos-formularios/       "
  day-05-listas-condicional/        "
  day-06-useeffect-dados/           "
  day-07-projeto-final-tarefas/     "

apps/web/src/features/curriculum/data/react-essentials-lessons.ts
  (exporta REACT_ESSENTIALS_LESSONS, getReactEssentialsLessonById,
   getReactEssentialsLessonsByWeek — espelha javascript-essentials-lessons.ts)
```

### Pontos de integração (5 edits, mesmo padrão dos anteriores)
1. **Criar** 7 pastas × 3 arquivos (21 arquivos) em `content/react-essentials/`.
2. **Criar** `data/react-essentials-lessons.ts` (importa os 7 `metadata.json`, exporta o array + os 2 helpers).
3. **Editar** `data/index.ts`: `import { REACT_ESSENTIALS_LESSONS }` + `if (stackId === 'react-essentials') return REACT_ESSENTIALS_LESSONS`.
4. **Editar** `TheoryReader.tsx`: bloco `'react-essentials'` no `MDX_IMPORTS` (7 entradas `theory.mdx`).
5. **Editar** `QuizRunner.tsx`: bloco `'react-essentials'` no `QUIZ_IMPORTS` (7 entradas `quiz.json`); **e** `stacks.ts`: flipar `react-essentials` de `coming-soon` → `available`.

> Nota: o ícone `'react-essentials': '⚛️'` em `StackSelectorPage.tsx` **já existe** (mesmo do `react` avançado) — nada a fazer lá.

## Formato de conteúdo

**`metadata.json`** — schema `LessonMetadata`:
- `id` (`"day-0N"`), `day`, `week: 1`, `title`, `slug`, `topics` (array).
- `difficulty: "foundational"`, `estimatedMinutes` 45–55.
- `prerequisites`: dia 1 = `[]`; dias seguintes = `["day-0(N-1)"]`.
- `hasVisualizer: false`, `hasChallenge: false`, `xpReward: 100`.

**`theory.mdx`** — `# Título` na 1ª linha, parágrafo de abertura motivando o tema, seções `##` com prosa + blocos de código, e `> **Resumo:**` ao final. pt-BR, tom direto e prático (igual aos irmãos).
- Exemplos em blocos **```` ```tsx ````** com **props e estado tipados** desde o início. Validar na execução que o highlighter (rehype-pretty-code/Shiki) destaca `tsx`; se houver problema, usar **```` ```jsx ````** (já usado pelo stack `react` avançado) — sem bloquear a entrega.
- O Dia 1 inclui um bloco curto de **setup** (`bash`/`text`) com `npm create vite@latest -- --template react-ts` e a localização do componente.
- **Cuidado MDX:** chaves `{`/`}` e `<` aparecem o tempo todo em JSX — manter **todo** JSX dentro de fences ```` ```tsx ````. Na prosa fora de código, evitar `<Componente>` solto (usar backticks: `` `<Botao>` ``).

**`quiz.json`** — `lessonId` (`"day-0N"`), `passingScore: 70`, e `questions`: **7 questões** (6 `multiple-choice` com 4 `options` + `correctAnswer` 0-indexed, e **1 `true-false`** com `options: ["Verdadeiro", "Falso"]`). `id` `q1`..`q7`, `explanation` que **ensina** o porquê.

## Verificação (end-to-end)

1. `pnpm -C apps/web build` (`tsc -b && vite build`) — garante que todos os imports de `metadata.json`/`theory.mdx`/`quiz.json` resolvem e o data file tipa. (Erro de path de `import()` em `TheoryReader`/`QuizRunner` só aparece aqui.)
2. `pnpm -C apps/web test:run` — todos os testes passando.
3. `pnpm -C apps/web dev` + preview: na home (seção **Fundamentos**) o card **React Essencial** aparece disponível (não "Em breve").
4. Abrir os 7 dias: teoria (MDX) renderiza com blocos TSX destacados; quiz carrega 7 questões e permite submeter (corte 70); fluxo `theory → quiz → complete`.
5. **Reprodutibilidade adaptada:** como React exige build, verificar a coerência dos exemplos compilando o **app do capstone (Dia 7)** num scaffold Vite React+TS temporário (montar, conferir que roda, **remover depois**) — em vez de "abrir um `.html`".

## Riscos / pontos de atenção

- **MDX + JSX:** este é o módulo com mais risco de MDX, porque JSX usa `{`, `}` e `<>` o tempo todo. **Todo** trecho de JSX deve estar dentro de fences ```` ```tsx ````; na prosa, nomes de componentes vão entre backticks. Um `<Algo>` solto fora de código quebra o parse do MDX.
- **Fence `tsx`:** confirmar que o highlighter destaca `tsx`. Fallback: `jsx` (já em uso no stack avançado). Não é bloqueante.
- **Paths de `import()`** em `TheoryReader`/`QuizRunner` devem casar exatamente com os nomes das pastas (Vite exige paths estáticos) — erro de digitação só falha no `build`.
- **Id com hífen** (`react-essentials`): consistência entre `id`, pasta `content/react-essentials/`, chave em `MDX_IMPORTS`/`QUIZ_IMPORTS` e o `if (stackId === ...)` no `index.ts`. Export = `REACT_ESSENTIALS_LESSONS`.
- **`fetch` no Dia 6/7:** usar uma URL pública estável (ex.: `https://jsonplaceholder.typicode.com/todos`) com fallback via `try/catch` para o exemplo não depender de rede; o capstone deve funcionar mesmo se o fetch falhar.
- **Overlap com o `react` avançado:** manter o recorte introdutório — `useEffect` entra como "efeito + data fetching básico", sem dependências exaustivas, sem `useRef`/`useMemo`/`useCallback` (isso é do avançado).
