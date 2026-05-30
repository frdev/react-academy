# Plano de Implementação — CSS Essencial (Módulo de 7 dias)

> Handoff para execução. Este arquivo é autocontido: contém contexto, padrões a seguir, os 6 pontos de integração e a divisão dos 7 dias. Siga o molde do módulo `typescript-essentials` em tudo.

## Contexto

A **Trilha de Fundamentos** da plataforma tem o stack `css-essentials` cadastrado em `stacks.ts`, mas como placeholder `status: 'coming-soon'`, sem nenhum conteúdo. É um dos dois módulos que faltam para completar a trilha (o outro é `javascript-essentials`).

**Não confundir** com o stack `css` existente, que é o **CSS Moderno & Avançado** (14 dias, `level: 'avancado'`, conteúdo em `src/content/css/`). Este aqui é a base introdutória de 7 dias ("do box model ao layout responsivo", `level: 'fundamentos'`), com conteúdo novo em `src/content/css-essentials/`.

**Requisito central — reprodutibilidade:** cada conceito deve ser ensinado por meio de um trecho **HTML+CSS autocontido**, copiável direto para um arquivo `.html` ou CodePen, produzindo um resultado visível — sem dependências, sem build. Quando um exemplo precisar de HTML, inclua o HTML mínimo junto do CSS. O Dia 7 culmina em um arquivo único copiável de ponta a ponta.

Ao final, mudar o stack de `coming-soon` para `available`.

## Padrão a reproduzir (módulos Essentials)

Cada dia é uma pasta em `apps/web/src/content/css-essentials/` com **3 arquivos**, idênticos em formato aos de `apps/web/src/content/typescript-essentials/day-01-tipos-e-inferencia/` (use como molde):

- **`metadata.json`** — campos: `id` (`"day-0N"`), `day` (número), `week: 1`, `title`, `slug`, `topics` (array de strings descritivas), `difficulty: "foundational"`, `estimatedMinutes` (40–50), `prerequisites` (`[]` no dia 1; `["day-0N-1"]` nos demais, conforme fizer sentido), `hasVisualizer: false`, `hasChallenge: false`, `xpReward: 100`.
- **`theory.mdx`** — `# Título` na primeira linha, parágrafo de abertura motivando o tema, seções `##` com blocos de código, e um `> **Resumo:**` ao final. Português, tom direto e prático, igual ao de `typescript-essentials/day-01/theory.mdx`. **Os exemplos principais devem ser blocos HTML+CSS completos e autocontidos.** Use blocos ```` ```html ```` e ```` ```css ````.
- **`quiz.json`** — `lessonId` (`"day-0N"`), `passingScore: 70`, e `questions`: ~6 questões, a maioria `multiple-choice` (campo `options` com 4 itens, `correctAnswer` índice 0-based) e ao menos uma `true-false` (`options: ["Verdadeiro", "Falso"]`). Cada questão tem `id` (`q1`..`q6`), `type`, `question`, `options`, `correctAnswer`, e uma `explanation` rica que ensina, não só justifica.

Validar campos contra o tipo `LessonMetadata` em `apps/web/src/features/curriculum/types.ts`.

## Divisão dos 7 dias

| Dia | Slug da pasta | Título (`title`) | Tópicos a cobrir |
|-----|---------------|------------------|------------------|
| 1 | `day-01-seletores-cascata-especificidade` | Como o CSS Aplica Estilo | seletores (tipo, classe, id, descendente, agrupamento); cascata (ordem, origem); especificidade (como é calculada, id vs classe vs tag); herança; `inherit`/`initial` |
| 2 | `day-02-box-model-display-position` | Box Model, Display e Posicionamento | content/padding/border/margin; `box-sizing: border-box`; colapso de margens; `display` (block/inline/inline-block/none); `position` (static/relative/absolute/fixed/sticky); `z-index` |
| 3 | `day-03-valores-unidades-cores-tipografia` | Valores, Cores e Tipografia | unidades absolutas e relativas (px, %, em, rem); cores (hex, rgb, hsl); `color`/`background`; `font-family`, `font-size`, `font-weight`; `line-height`; `text-align` |
| 4 | `day-04-flexbox` | Flexbox — Layout em Uma Dimensão | `display: flex`; `flex-direction`; `justify-content`; `align-items`; `gap`; `flex-wrap`; `flex` (grow/shrink/basis) |
| 5 | `day-05-grid` | Grid — Layout em Duas Dimensões | `display: grid`; `grid-template-columns`; unidade `fr`; `repeat()`; `gap`; `minmax()`; `auto-fit`/`auto-fill`; posicionar itens em linhas/colunas |
| 6 | `day-06-responsividade` | Responsividade | unidades relativas; `max-width`; meta viewport; `@media` (min/max-width); mobile-first; imagens fluidas (`max-width: 100%`) |
| 7 | `day-07-projeto-final-landing` | Projeto Final — Landing Responsiva | capstone que junta tudo: header + hero + grid de cards + footer, com cascata, box model, flex, grid e media queries. Entregar **um arquivo HTML completo copiável** de ponta a ponta. |

## Pontos de integração (6 itens)

1. **Criar** 7 pastas × 3 arquivos em `apps/web/src/content/css-essentials/` (21 arquivos no total).

2. **Criar** `apps/web/src/features/curriculum/data/css-essentials-lessons.ts` — espelhar `typescript-essentials-lessons.ts`:
   - importar os 7 `metadata.json` (`day01`..`day07`);
   - `export const CSS_ESSENTIALS_LESSONS: LessonMetadata[] = [...].map(l => l as LessonMetadata)`;
   - helpers `getCssEssentialsLessonById(id)` e `getCssEssentialsLessonsByWeek(week)`.

3. **Editar** `apps/web/src/features/curriculum/data/index.ts`:
   - `import { CSS_ESSENTIALS_LESSONS } from './css-essentials-lessons'`;
   - dentro de `getLessonsForStack`: `if (stackId === 'css-essentials') return CSS_ESSENTIALS_LESSONS`.

4. **Editar** `apps/web/src/features/lessons/components/TheoryReader.tsx` — adicionar, no mapa de loaders de `theory.mdx`, um bloco `'css-essentials': { 'day-01': () => import('@/content/css-essentials/day-01-.../theory.mdx'), ... 'day-07': ... }` (modelo: o bloco `'typescript-essentials'`).

5. **Editar** `apps/web/src/features/lessons/components/QuizRunner.tsx` — adicionar bloco análogo `'css-essentials': { 'day-01'..'day-07' }` apontando para `quiz.json` (modelo: bloco `'typescript-essentials'`).

6. **Editar** `apps/web/src/features/stacks/data/stacks.ts` — no objeto do stack `css-essentials`, trocar `status: 'coming-soon'` → `status: 'available'`.

> Nota: o ícone `'css-essentials': '🖌️'` em `StackSelectorPage.tsx` (`STACK_ICONS`) **já existe** — nada a fazer lá.

## Arquivos de referência (molde, não reinventar)

- `apps/web/src/content/typescript-essentials/day-01-tipos-e-inferencia/{metadata.json,theory.mdx,quiz.json}`
- `apps/web/src/features/curriculum/data/typescript-essentials-lessons.ts`
- `apps/web/src/features/curriculum/types.ts` (tipo `LessonMetadata`)

## Verificação (end-to-end)

1. `cd apps/web && npm run build` (ou `npx tsc --noEmit`) — garante que todos os imports de `metadata.json`/`theory.mdx`/`quiz.json` resolvem e o data file tipa.
2. `npm run dev`; na home (seção **Fundamentos**) o card **CSS Essencial** deve aparecer disponível (não "em breve").
3. Abrir cada um dos 7 dias: a teoria (MDX) renderiza com blocos de código destacados; o quiz carrega ~6 questões e permite submeter (corte 70).
4. **Teste de reprodutibilidade:** copiar 2–3 exemplos de teoria (ex.: Flexbox e Grid) para um `.html` local e abrir no navegador — o resultado visual deve bater com o texto.
5. Dia 7: o arquivo final da landing deve ser copiável inteiro e renderizar uma página responsiva (redimensionar a janela para ver as media queries agindo).
