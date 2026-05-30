# CSS Moderno & Avançado — Design Spec

**Date:** 2026-05-30
**Status:** Approved

---

## Context

Adicionar um stack de **CSS Moderno & Avançado** à plataforma React Academy, com **14 dias / 2 semanas** de conteúdo. A infraestrutura (rotas, passos da lição, quiz runner, theory reader, seleção de stack) já está pronta a partir dos stacks existentes — este spec cobre o desenho do currículo e a integração necessária, espelhando o que foi feito para os stacks **AI** e **Algoritmos** (os dois mais recentes, ambos de 14 dias, sem challenge).

**Audiência:** Devs que já sabem o básico de HTML/CSS (Flexbox/Grid introdutórios, especificidade, box model). Sem revisão de fundamentos — o foco é **técnica, padrão e novidade** de CSS moderno.

**Foco:** Semana 1 = como o CSS moderno **estrutura e seleciona** (layout intrínseco, arquitetura, seletores relacionais). Semana 2 = como o CSS moderno **pinta e move** (cor, tipografia fluida, animação, novidades de interação).

**Challenge step:** Desabilitado (`hasChallenge: false`) em todos os dias, consistente com AI/Algoritmos.

**Idioma:** pt-BR, mesmo tom denso e direto dos stacks AI/Algoritmos.

---

## Currículo — 14 Dias

### Arco Mental

| Semana | Modelo Mental | Pergunta Central |
|--------|---------------|------------------|
| 1 | CSS como **estrutura** | Como descrever layout e relações entre elementos de forma robusta e sem hacks? |
| 2 | CSS como **expressão** | Como dar cor, ritmo e movimento modernos sem JavaScript? |

---

### Semana 1: Layout, Arquitetura & Seletores Modernos (Days 1–7)

| Dia | Título | Tópicos |
|-----|--------|---------|
| 01 | Layout Intrínseco com Grid & Flexbox | `min-content`/`max-content`/`fit-content`, `fr`, `minmax()`, `auto-fill` vs `auto-fit`, intrinsic sizing, `gap`, RAM pattern |
| 02 | Subgrid & Masonry | `subgrid` em linhas e colunas, alinhamento herdado de grids aninhados, layout `masonry`, casos de uso reais |
| 03 | Container Queries | `@container`, `container-type`/`container-name`, unidades `cqi`/`cqb`/`cqw`/`cqh`, style queries, componentes verdadeiramente responsivos |
| 04 | Propriedades Lógicas & Writing Modes | eixo `inline`/`block`, `margin/padding/inset-*-start/-end`, `writing-mode`, `direction`, CSS pronto para i18n e RTL |
| 05 | Custom Properties Avançado & `@property` | variáveis vs preprocessador, `@property` (`syntax`/`inherits`/`initial-value`), fallback, theming dinâmico, animar variáveis tipadas |
| 06 | Cascade Layers & Especificidade | `@layer`, ordenação explícita, `:where()`/`:is()` para controlar especificidade, domar CSS de terceiros |
| 07 | Seletores Modernos: `:has()`, `:is()`, `:where()` | parent/relational selector `:has()`, quantity queries, `:is()`/`:where()`, microssintaxe de `:nth-child(... of ...)` |

---

### Semana 2: Cor, Movimento & Novidades (Days 8–14)

| Dia | Título | Tópicos |
|-----|--------|---------|
| 08 | Cor Moderna | `oklch`/`oklab`/`lab`, `color-mix()`, relative color syntax, gamut amplo (P3), `color-scheme`, `light-dark()` |
| 09 | Tipografia Fluida & Funções Matemáticas | `clamp()`, `min()`/`max()`, `round()`/`mod()`/`rem()`, escala fluida, unidades relativas e de container, `text-wrap: balance/pretty` |
| 10 | Nesting Nativo & `@scope` | nesting nativo, operador `&`, regras de aninhamento, `@scope` e donut scope, relação com Sass/PostCSS |
| 11 | UI Moderna & Responsividade | `aspect-ratio`, `:focus-visible`, `accent-color`, reset moderno, `prefers-reduced-motion`/`prefers-color-scheme`, `inert` |
| 12 | Scroll-Driven Animations | `animation-timeline`, `scroll()`/`view()`, `scroll-snap`, `content-visibility`, `contain`, performance |
| 13 | View Transitions, Popover & Anchor Positioning | View Transitions API (`::view-transition-*`, `view-transition-name`), `@starting-style`, `transition-behavior: allow-discrete`, atributo `popover`, anchor positioning |
| 14 | Projeto Final: Design System Moderno | sintetiza tudo: tokens com `@property` + `@layer`, componentes com container queries + `:has()` + `color-mix()` + view transitions |

**Dificuldade:** progressão `intermediate → advanced`. Day 1 `intermediate`; dias com features de ponta (subgrid, cascade layers, scroll-driven, view transitions, projeto final) `advanced`.

---

## Implementação Técnica

### Arquivos Novos

```
apps/web/src/content/css/
  day-01-layout-intrinseco/          metadata.json + theory.mdx + quiz.json
  day-02-subgrid-masonry/
  day-03-container-queries/
  day-04-propriedades-logicas/
  day-05-custom-properties-at-property/
  day-06-cascade-layers/
  day-07-has-is-where/
  day-08-cor-moderna/
  day-09-tipografia-fluida/
  day-10-nesting-scope/
  day-11-ui-moderna/
  day-12-scroll-driven-animations/
  day-13-view-transitions/
  day-14-projeto-final-design-system/

apps/web/src/features/curriculum/data/
  css-lessons.ts                     (novo — exporta CSS_LESSONS, getCssLessonById, getCssLessonsByWeek)
```

### Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `features/curriculum/data/index.ts` | `import { CSS_LESSONS }` + `if (stackId === 'css') return CSS_LESSONS` |
| `features/lessons/components/TheoryReader.tsx` | adicionar `css` ao `MDX_IMPORTS` |
| `features/lessons/components/QuizRunner.tsx` | adicionar `css` ao `QUIZ_IMPORTS` |
| `features/stacks/data/stacks.ts` | novo objeto `css` no array `STACKS` (`status: 'available'`, `color: 'pink'`) |
| `features/stacks/StackSelectorPage.tsx` | adicionar `pink` ao `COLOR_MAP` |

### Content Format

**`metadata.json`** — mesmo schema de `LessonMetadata`:
```json
{
  "id": "day-01",
  "day": 1,
  "week": 1,
  "title": "Layout Intrínseco com Grid & Flexbox",
  "slug": "layout-intrinseco",
  "topics": ["intrinsic sizing", "minmax()", "auto-fit vs auto-fill", "fr", "gap"],
  "difficulty": "intermediate",
  "estimatedMinutes": 50,
  "prerequisites": [],
  "hasVisualizer": false,
  "hasChallenge": false,
  "xpReward": 100
}
```
- `week`: 1 para dias 1–7, 2 para dias 8–14.
- `prerequisites`: dia N lista `[day-(N-1)]`; dia 1 = `[]`.

**`theory.mdx`** — ~150–220 linhas, markdown + blocos de código com highlight `css`/`html`/`text`, resumo em bold (`> **Resumo:**`) no final.

**`quiz.json`** — 7 questões, `passingScore: 70`, campos: `id`, `type: "multiple-choice"`, `question`, `options` (4 itens), `correctAnswer` (0-indexed), `explanation`.

### Execution Order

1. Spec de design (este arquivo) — commit.
2. Criar 14 pastas + `metadata.json`.
3. Criar `css-lessons.ts` + registrar no `index.ts`.
4. Fiar `TheoryReader.tsx` e `QuizRunner.tsx`.
5. Ativar stack no `stacks.ts` + `pink` no `COLOR_MAP`.
6. Escrever `theory.mdx` + `quiz.json` dos 14 dias — semana por semana.

### Verification

- `pnpm -C apps/web typecheck` — sem erros.
- `pnpm -C apps/web test:run` — todos os testes passando.
- `pnpm -C apps/web build` — `tsc -b && vite build` compila (pega paths de `import()` errados).
- Navegar para `/css` → card disponível (rosa); `/css/day/day-01/theory` → teoria; quiz → score e explicações; fluxo `theory → quiz → complete`.
