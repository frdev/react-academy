# Gerenciador de Pacotes — Design Spec

**Date:** 2026-05-30
**Status:** Approved

---

## Context

A [Trilha de Fundamentos](2026-05-30-trilha-fundamentos-design.md) hoje tem 6 cursos: HTML → CSS Essencial → JS Essencial → **TS Essencial** → Git → Boas Práticas. Falta uma porta de entrada para o **tooling de dependências** — o que é `package.json`, `node_modules`, `lockfile`, e por que existem três gerenciadores concorrentes (npm, yarn, pnpm). Todo projeto JS pressupõe esse conhecimento, mas nenhum stack o ensina.

Este spec cria um **novo stack `Gerenciador de Pacotes`**, posicionado na sessão de fundamentos **logo após o TS Essencial** (e antes do Git, formando um cluster de "tooling"). Diferente dos demais cursos de fundamentos (7 dias), este é **enxuto: 3 dias**, refletindo o recorte focado do tema (introdução + comparação npm/yarn/pnpm).

**Decisões fechadas com o usuário:**
- **3 dias**, não 7 — o tema é focado; esticar para 7 seria encher linguiça.
- **Entrega completa + ativar:** escrever os 3 dias e deixar o stack `available` (clicável e funcional) já nesta entrega, não `coming-soon`.
- **Postura opinativa recomendando pnpm:** explica os três de forma justa, mas conclui com pnpm como padrão moderno, usando o próprio React Academy (pnpm + workspaces) como exemplo real. npm como universal/seguro; yarn pelo contexto histórico.
- Sem challenge e sem visualizer (`hasChallenge: false`, `hasVisualizer: false`), consistente com CSS/HTML.
- Conteúdo em **pt-BR**, mesma arquitetura/formato do stack de CSS.
- Cada dia termina com o blockquote padrão `> **Resumo:** …`.

**Escopo deste spec:** o stack inteiro — metadados, currículo dos 3 dias (theory + quiz), registro no currículo e nos loaders, e ativação. Vira um único plano de implementação.

---

## Metadados do Stack

Inserido no array `STACKS` em `features/stacks/data/stacks.ts`, **entre `typescript-essentials` e `git`**:

```ts
{
  id: 'package-managers',
  name: 'Gerenciador de Pacotes',
  tagline: '3 dias do node_modules ao pnpm',
  description: 'package.json, semver, lockfiles, node_modules e a diferença entre npm, yarn e pnpm — a base de tooling de todo projeto JS.',
  totalDays: 3,
  status: 'available',
  level: 'fundamentos',
  color: 'orange',
  weekThemes: ['Tooling & Dependências'],
}
```

- **id de conteúdo:** `package-managers` → URLs `/package-managers/day/day-0X/theory` e `.../quiz`.
- **color `orange`:** livre (não usada pelos outros stacks); ecoa a identidade do npm/pnpm.
- **Dificuldade:** dias 1–2 `foundational`, dia 3 `intermediate`.

---

## Currículo — 3 Dias

> *weekTheme:* `Tooling & Dependências` (todos `week: 1`)

| Dia | Título | `slug` | Dificuldade | Tópicos |
|-----|--------|--------|-------------|---------|
| 01 | O que é um Gerenciador de Pacotes? | `o-que-e` | foundational | `package.json`, dependencies × devDependencies, `node_modules`, registry (npm), semver e ranges (`^`/`~`), por que existem lockfiles, `scripts` |
| 02 | npm na Prática | `npm-na-pratica` | foundational | `npm install`/`ci`/`uninstall`, `package-lock.json`, rodar e encadear scripts, `npx`, `npm audit`, intro a workspaces |
| 03 | npm vs yarn vs pnpm | `npm-yarn-pnpm` | intermediate | história (por que yarn surgiu, o que pnpm resolve), `node_modules` flat × phantom dependencies, content-addressable store + symlinks do pnpm, monorepos/workspaces, recomendação opinativa (pnpm) com o próprio projeto como exemplo |

### Detalhamento

**Dia 1 — O que é um Gerenciador de Pacotes?**
O "porquê" antes do "como". Aluno entende que dependências são código de terceiros versionado; que `package.json` é o manifesto (com a distinção crucial dependencies × devDependencies); que `node_modules` é a materialização instalada; que o **registry** é de onde vêm os pacotes; que **semver** (`MAJOR.MINOR.PATCH`) e os ranges `^`/`~` definem o que pode atualizar; e que o **lockfile** existe para tornar a instalação **determinística**. Fecha com `scripts` como atalhos de automação.

**Dia 2 — npm na Prática**
O gerenciador padrão que já vem com o Node. Comandos essenciais (`install`, `ci`, `uninstall`, `update`), a diferença `install` × `ci` (e quando usar cada um em dev/CI), o papel do `package-lock.json`, como definir/rodar/encadear **scripts**, **`npx`** para executar binários sem instalar global, `npm audit` para segurança, e uma introdução a **workspaces** (monorepo básico).

**Dia 3 — npm vs yarn vs pnpm**
A comparação. Contexto histórico (yarn nasceu para resolver lentidão/determinismo do npm clássico; pnpm para resolver disco e correção). O problema do **`node_modules` flat** do npm/yarn e as **phantom dependencies** que ele permite. Como o **pnpm** resolve com um **content-addressable store** global + symlinks (rápido, econômico em disco, estrito). Workspaces/monorepos nos três. Tabela de prós/contras. **Recomendação opinativa: pnpm como padrão moderno**, com npm como universal/seguro e yarn pelo legado — usando o React Academy (pnpm + workspaces) como exemplo concreto.

### Por dia (estrutura de arquivos)
Cada dia gera uma pasta `content/package-managers/day-0X-<slug>/` com:
- `metadata.json` — conforme `LessonMetadata` (`hasVisualizer: false`, `hasChallenge: false`, `xpReward: 100`, `estimatedMinutes` ~40–50, `week: 1`, `prerequisites` encadeando o dia anterior a partir do dia 2).
- `theory.mdx` — teoria em pt-BR, terminando em `> **Resumo:** …`.
- `quiz.json` — conforme `Quiz` (≈5 questões, `passingScore: 70`), tipos `multiple-choice`/`true-false`/`code-output`.

---

## Arquivos a Tocar

Seguindo exatamente o padrão do stack de CSS (commit `3b3fefb` — "registra currículo, fia loaders e ativa o stack"):

1. **`features/stacks/data/stacks.ts`** — inserir o objeto do stack entre `typescript-essentials` e `git`.
2. **`content/package-managers/day-0{1,2,3}-<slug>/`** — 3 pastas × (`metadata.json` + `theory.mdx` + `quiz.json`).
3. **`features/curriculum/data/package-managers-lessons.ts`** — novo arquivo espelhando `css-lessons.ts`: importa os 3 `metadata.json`, exporta `PACKAGE_MANAGERS_LESSONS: LessonMetadata[]` + helpers `getPackageManagersLessonById` / `...ByWeek`.
4. **`features/curriculum/data/index.ts`** — `import { PACKAGE_MANAGERS_LESSONS }` + `if (stackId === 'package-managers') return PACKAGE_MANAGERS_LESSONS` em `getLessonsForStack`.
5. **`features/lessons/components/TheoryReader.tsx`** — adicionar a chave `'package-managers'` no `MDX_IMPORTS` (mapa `dayId → () => import(...theory.mdx)`).
6. **`features/lessons/components/QuizRunner.tsx`** — adicionar a chave `'package-managers'` no mapa equivalente de quizzes.

Slugs finais: `day-01-o-que-e`, `day-02-npm-na-pratica`, `day-03-npm-yarn-pnpm`.

---

## Critérios de Aceite

- O card "Gerenciador de Pacotes" aparece na seção **Fundamentos**, na posição entre TS Essencial e Git, como `available`.
- Clicar abre o dashboard do stack com 3 dias.
- Cada dia carrega `theory.mdx` (com `> **Resumo:**` no fim) e um quiz funcional que pontua e permite concluir.
- Progresso/XP funcionam como nos demais stacks (sem código novo de progresso — só registro de dados).
- `pnpm typecheck` e `pnpm lint` passam; nenhum stack existente quebra.
