# TypeScript Curriculum — Design Spec

**Date:** 2026-05-29  
**Status:** Approved  

---

## Context

Add a TypeScript stack to the tech-academy platform with 30 days of content. The stack already exists as `coming-soon` in `stacks.ts`. The infrastructure (routing, lesson steps, quiz runner, theory reader) is fully in place from the JavaScript stack — this spec covers curriculum design and the integration work needed.

**Audience:** Developers with solid JavaScript knowledge (equivalent to the platform's JS course). No JS fundamentals review needed.

**Focus:** Balanced — production foundations in weeks 1–2, deep type-level programming in weeks 3–4. TypeScript-pure with brief mentions of how concepts appear in React/Node where relevant.

**Challenge step:** Disabled (`hasChallenge: false`) on all 30 days, consistent with the JavaScript stack decision.

---

## Curriculum: 30 Days

### Mental Model Arc

Each week maps to a mental model of how TypeScript works:

| Week | Mental Model | Core Question |
|------|-------------|---------------|
| 1 | TypeScript as documentation | How do I describe existing JS with types? |
| 2 | TypeScript as constraint | How do I make invalid states unrepresentable? |
| 3 | TypeScript as computation | How do I write functions that operate on types? |
| 4 | TypeScript as tool | How do I configure, extend and maintain TS at scale? |

---

### Semana 1: TypeScript como Documentação (Days 1–7)

| Dia | Título | Tópicos |
|-----|--------|---------|
| 01 | Sistema de Tipos | structural typing vs nominal, annotation vs inference, widening, `any`/`unknown`/`never`/`void` |
| 02 | Interfaces & Type Aliases | sintaxe, diferenças reais, declaration merging, `extends`, quando usar cada um |
| 03 | Functions em TypeScript | parâmetros opcionais/rest, overloads, call signatures, construct signatures, `this` typing |
| 04 | Generics Fundamentais | type parameters, constraints com `extends`, defaults, generic functions vs generic types |
| 05 | Literal Types & `as const` | string/number/boolean literals, const assertion, const enums vs union de literais |
| 06 | Classes em TypeScript | `public/private/protected`, `readonly`, `abstract`, `implements`, parameter properties |
| 07 | Modules & Declaration Files | `import type`, `.d.ts` intro, `declare`, `namespace`, triple-slash directives |

---

### Semana 2: TypeScript como Restrição (Days 8–14)

| Dia | Título | Tópicos |
|-----|--------|---------|
| 08 | Type Narrowing | `typeof`, `instanceof`, `in`, truthiness, equality narrowing, type guards com `is` |
| 09 | Discriminated Unions | tagged unions, campo `kind`/`type`, exhaustive check com `never`, switch exaustivo |
| 10 | Utility Types I | `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `NonNullable`, `ReturnType`, `Parameters` |
| 11 | Mapped Types | `{ [K in keyof T]: ... }`, modificadores `+/-readonly`, `+/-?`, key remapping com `as` |
| 12 | Template Literal Types | backtick types, `Uppercase/Lowercase/Capitalize`, combinação com unions |
| 13 | Index Types | `keyof`, `T[K]` (indexed access), `PropertyKey`, index signatures, `Record<K,V>` |
| 14 | Intersection Types | `A & B`, composição vs herança, conflitos, mixin pattern tipado |

---

### Semana 3: TypeScript como Computação (Days 15–21)

| Dia | Título | Tópicos |
|-----|--------|---------|
| 15 | Conditional Types | `T extends U ? X : Y`, distributividade sobre unions, `NonNullable` custom |
| 16 | `infer` | extrair tipos com `infer`, `ReturnType`/`Awaited` implementados do zero |
| 17 | Recursive Types | auto-referência, `JSONValue`, `DeepReadonly`, `DeepPartial`, depth limits |
| 18 | Template Literal Types Avançados | `Split<S, D>`, `Join<T, D>`, parsing de strings no nível de tipos |
| 19 | Variância | covariance/contravariance/invariance, `in`/`out` modifiers (TS 4.7+), bivariance em funções |
| 20 | Higher-Kinded Types (simulação) | limitações do TS, padrões para simular HKT, type classes |
| 21 | Type System Internals | structural subtyping, freshness checking, excess property checks, control flow analysis, literal widening |

---

### Semana 4: TypeScript como Ferramenta (Days 22–30)

| Dia | Título | Tópicos |
|-----|--------|---------|
| 22 | tsconfig em Profundidade | strict flags individuais, `module`/`moduleResolution` (Node16/Bundler), `paths`, project references |
| 23 | Declaration Files | `.d.ts` avançado, `declare module`, `declare global`, augmentação de libs de terceiros |
| 24 | Branded & Opaque Types | nominal typing em TS estrutural, `Brand<T, B>`, Phantom types |
| 25 | `satisfies` & `NoInfer` | operador `satisfies` (TS 4.9), `const T extends` (TS 5.0), `NoInfer<T>` (TS 5.4) |
| 26 | Assertion Functions & Guards Avançados | `asserts x is T`, narrowing em todos os branches, composição de guards |
| 27 | Decorators (Stage 3) | class/method/field decorators tipados, `context.addInitializer`, metadata |
| 28 | Compiler API | `ts.createProgram`, AST walker em TS, custom diagnostics, codemods tipados |
| 29 | Performance do Type Checker | tipos lentos, `--extendedDiagnostics`, `interface` vs `type` em grandes bases, simplificação |
| 30 | Projeto Final: Type-safe Query Builder | `select`, `where`, `join` com tipos totalmente inferidos — sintetiza conditional types, infer, template literals, generics |

---

## Implementação Técnica

### Arquivos Novos

```
apps/web/src/content/typescript/
  day-01-type-system/            metadata.json + theory.mdx + quiz.json
  day-02-interfaces-type-aliases/
  day-03-functions/
  day-04-generics/
  day-05-literal-types/
  day-06-classes/
  day-07-modules-declarations/
  day-08-narrowing/
  day-09-discriminated-unions/
  day-10-utility-types-1/
  day-11-mapped-types/
  day-12-template-literal-types/
  day-13-index-types/
  day-14-intersection-types/
  day-15-conditional-types/
  day-16-infer/
  day-17-recursive-types/
  day-18-template-literal-advanced/
  day-19-variance/
  day-20-higher-kinded-types/
  day-21-type-system-internals/
  day-22-tsconfig/
  day-23-declaration-files/
  day-24-branded-types/
  day-25-satisfies-noinfer/
  day-26-assertion-functions/
  day-27-decorators/
  day-28-compiler-api/
  day-29-type-checker-performance/
  day-30-projeto-final-query-builder/

apps/web/src/features/curriculum/data/
  typescript-lessons.ts          (new — exports TS_LESSONS, getTypescriptLessonById, getTypescriptLessonsByWeek)
```

### Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `features/stacks/data/stacks.ts` | `typescript` status `coming-soon` → `available`, tagline real |
| `features/curriculum/data/index.ts` | `if (stackId === 'typescript') return TS_LESSONS` |
| `features/lessons/components/TheoryReader.tsx` | adicionar `typescript` ao `MDX_IMPORTS` |
| `features/lessons/components/QuizRunner.tsx` | adicionar `typescript` ao `QUIZ_IMPORTS` |

### Content Format

**`metadata.json`** — mesmo schema do JavaScript:
```json
{
  "id": "day-01",
  "day": 1,
  "week": 1,
  "title": "Sistema de Tipos",
  "slug": "type-system",
  "topics": [...],
  "difficulty": "foundational",
  "estimatedMinutes": 50,
  "prerequisites": [],
  "hasVisualizer": false,
  "hasChallenge": false,
  "xpReward": 100
}
```

**`theory.mdx`** — ~200 linhas, markdown + code blocks com `typescript` syntax highlighting, resumo em bold no final.

**`quiz.json`** — 7 questões, `passingScore: 70`, campos: `id`, `type: "multiple-choice"`, `question`, `options` (4 items), `correctAnswer` (0-indexed), `explanation`.

### Execution Order

1. Criar 30 pastas + `metadata.json` para todos os dias
2. Criar `typescript-lessons.ts` + registrar no `index.ts`
3. Ativar stack no `stacks.ts`
4. Atualizar `TheoryReader.tsx` e `QuizRunner.tsx`
5. Criar `theory.mdx` + `quiz.json` completos — semana por semana

### Verification

- `pnpm typecheck` — sem erros
- `pnpm test:run` — todos os testes passando
- Navegar para `/typescript/day/day-01/theory` — exibe conteúdo correto
- Days 2–30 antes do conteúdo mostram placeholder "Conteúdo em breve"
