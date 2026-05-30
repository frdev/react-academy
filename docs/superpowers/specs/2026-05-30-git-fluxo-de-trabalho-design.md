# Git & Fluxo de Trabalho — Design Spec

**Date:** 2026-05-30
**Status:** Approved

---

## Context

A [Trilha de Fundamentos](2026-05-30-trilha-fundamentos-design.md) tem o stack **`git`** já registrado em `features/stacks/data/stacks.ts`, mas como `coming-soon` e dimensionado para **7 dias**. Nenhum conteúdo foi escrito. A descrição atual ("Commits, branches, merge/rebase, conflitos, PRs e conventional commits — o fluxo do dia a dia") cobre o tema certo, mas 7 dias é exagero para o recorte de "fluxo do dia a dia": encheria de comando decorado.

Este spec **redimensiona o stack `git` para 3 dias** e o ativa com conteúdo completo. Diferente de criar um stack novo (como foi o "Gerenciador de Pacotes"), aqui o objeto já existe — então o trabalho em `stacks.ts` é **modificar** o objeto `git`, não inserir um novo.

**Decisões fechadas com o usuário:**
- **3 dias**, não 7 — reequilibrando o split que o usuário propôs (`commits+branches+conventional` / `merge vs rebase` / `PRs+conflitos`) para encaixar duas peças que faltavam: **desfazer** (`restore`/`reset`/`revert`) e **remotes** (`push`/`pull`/`fetch`).
- **Dia 1 assume o básico de Git:** o aluno já usou `git add`/`commit` alguma vez. Nada de instalação ou "o que é versionamento" do zero absoluto — recap rápido do staging e foco em fazer bem feito.
- **Diagramas de ramificação em ASCII dentro de fences ` ```text `** (não Mermaid, não componente React). Zero infra nova, consistente com algorithms/regex, e espelha a saída real de `git log --graph`.
- **Entrega completa + ativar:** escrever os 3 dias e deixar o stack `available` já nesta entrega.
- Sem challenge e sem visualizer (`hasChallenge: false`, `hasVisualizer: false`), consistente com os demais stacks de fundamentos.
- Conteúdo em **pt-BR**, mesma arquitetura/formato do stack de "Gerenciador de Pacotes".
- Cada dia termina com o blockquote padrão `> **Resumo:** …`.
- Trabalho **na branch atual `feat/trilha-fundamentos`** (sem branch nova).

**Escopo deste spec:** o stack inteiro — redimensionar metadados, currículo dos 3 dias (theory + quiz), registro no currículo e nos loaders, e ativação. Vira um único plano de implementação.

---

## Metadados do Stack

O objeto já existe em `STACKS` (`features/stacks/data/stacks.ts`). **Modificar** os campos `tagline`, `description`, `totalDays` e `status` — `id`, `name`, `level`, `color` e `weekThemes` permanecem:

```ts
{
  id: 'git',
  name: 'Git & Fluxo de Trabalho',
  tagline: '3 dias do commit ao Pull Request',
  description: 'Conventional commits, desfazer com segurança, branches, merge vs rebase, remotes, Pull Requests e conflitos — o fluxo de colaboração do dia a dia.',
  totalDays: 3,
  status: 'available',
  level: 'fundamentos',
  color: 'teal',
  weekThemes: ['Versionamento & Colaboração'],
}
```

- **id de conteúdo:** `git` → URLs `/git/day/day-0X/theory` e `.../quiz`.
- **color `teal`:** já era do `git`, exclusiva (nenhum outro stack usa). Mantida.
- **Posição:** já está na seção Fundamentos, depois de "Gerenciador de Pacotes" e antes de "Boas Práticas & Arquitetura Frontend". Não muda.
- **Dificuldade:** dia 1 `foundational`; dias 2–3 `intermediate` (rebase e resolução de conflitos são os conceitos mais espinhosos).

---

## Currículo — 3 Dias

> *weekTheme:* `Versionamento & Colaboração` (todos `week: 1`)

| Dia | Título | `slug` | Dificuldade | Tópicos |
|-----|--------|--------|-------------|---------|
| 01 | Commits, Conventional Commits e Como Desfazer | `historico-local` | foundational | recap do staging area, anatomia de um bom commit (atômico, mensagem), Conventional Commits (`feat`/`fix`/`docs`/…), desfazer: `restore` (working tree), `reset` (`--soft`/`--mixed`/`--hard`), `revert` (commit que desfaz), quando usar cada um |
| 02 | Branches, Merge e Rebase | `branches-merge-rebase` | intermediate | criar/trocar branches (`switch`/`checkout`), por que branches são baratas (ponteiros), fast-forward vs merge commit, `rebase` (reescrita linear), merge vs rebase (quando usar cada um), golden rule do rebase (não reescrever histórico compartilhado) |
| 03 | Remotes, Pull Requests e Conflitos | `remotes-prs-conflitos` | intermediate | `clone`/`remote`/`fetch`/`pull`/`push`, tracking branches, Pull Requests (o que é, fluxo no GitHub, code review), conflitos (por que acontecem, anatomia dos marcadores `<<<<<<<`, como resolver), o fluxo completo do dia a dia |

### Detalhamento

**Dia 1 — Commits, Conventional Commits e Como Desfazer** *(foundational)*
Assume que o aluno já deu `git add`/`commit`. Recap rápido do **staging area** (working tree → index → commit) para alinhar o vocabulário, depois foca em **fazer bem feito**: o que é um commit atômico, como escrever boas mensagens, e a convenção **Conventional Commits** (`tipo(escopo): descrição`) que padroniza o histórico e alimenta changelogs/versionamento automático. Fecha com o tema que mais trava iniciante: **desfazer com segurança**. Diferencia `git restore` (descartar mudanças não commitadas), `git reset` nos três modos (`--soft`/`--mixed`/`--hard` — o que cada um mexe), e `git revert` (criar um commit que desfaz outro, seguro para histórico público). Visual: linha do tempo linear de commits mostrando o que cada comando move.

**Dia 2 — Branches, Merge e Rebase** *(intermediate)*
O coração visual do stack. Branch como **ponteiro barato** para um commit. Criar/trocar (`git switch`, mencionando `checkout`). Integração: **fast-forward** (quando não há divergência) vs **merge commit** (quando há, criando o commit de duas pernas). Depois **rebase**: reaplica seus commits no topo da outra branch, produzindo histórico **linear**. A comparação central **merge vs rebase** — preserva histórico real vs história limpa — com a **golden rule**: nunca fazer rebase de commits já compartilhados/públicos. Concentra os diagramas de ramificação em ASCII: fork, merge commit, e o "antes/depois" do rebase.

**Dia 3 — Remotes, Pull Requests e Conflitos** *(intermediate)*
Colaboração de verdade. **Remotes**: `origin`, `clone`, `fetch` (baixa sem mesclar) vs `pull` (`fetch` + merge), `push`, e tracking branches. **Pull Requests**: o que é, o fluxo no GitHub (branch → push → abrir PR → review → merge), por que PR existe (revisão antes de integrar). **Conflitos**: por que acontecem (duas mudanças na mesma região), a anatomia dos marcadores (`<<<<<<<`/`=======`/`>>>>>>>`), e o passo a passo para resolver. Fecha amarrando tudo no **fluxo completo do dia a dia**: atualizar `main`, criar branch, commitar (conventional), push, PR, resolver conflito, merge. Visual: diagrama de divergência que gera o conflito.

### Tratamento dos visuais (ASCII)

Todos os diagramas de ramificação são blocos ` ```text ` em monospace, no estilo de `git log --graph`. Exemplos de referência (o conteúdo final detalha cada um):

```text
# Merge commit (Dia 2)
        A───B───C        (main)
             \       \
              D───E───M   (M = merge de feature em main)
```

```text
# Antes/depois do rebase (Dia 2)
antes:   A───B───C    (main)
              \
               D───E  (feature)

depois:  A───B───C        (main)
                  \
                   D'──E'  (feature rebaseada — D/E reescritos)
```

### Por dia (estrutura de arquivos)
Cada dia gera uma pasta `content/git/day-0X-<slug>/` com:
- `metadata.json` — conforme `LessonMetadata` (`hasVisualizer: false`, `hasChallenge: false`, `xpReward: 100`, `estimatedMinutes` ~40–50, `week: 1`, `prerequisites` encadeando o dia anterior a partir do dia 2).
- `theory.mdx` — teoria em pt-BR, começando com `# Título` e terminando em `> **Resumo:** …`.
- `quiz.json` — conforme `Quiz` (≈6 questões, `passingScore: 70`), tipos `multiple-choice`/`true-false`/`code-output`.

---

## Arquivos a Tocar

Seguindo exatamente o padrão do stack "Gerenciador de Pacotes" (commit `6215167` + fiação de loaders/currículo):

1. **`features/stacks/data/stacks.ts`** — **modificar** o objeto `git` existente (`tagline`, `description`, `totalDays: 3`, `status: 'available'`).
2. **`content/git/day-0{1,2,3}-<slug>/`** — 3 pastas × (`metadata.json` + `theory.mdx` + `quiz.json`).
3. **`features/curriculum/data/git-lessons.ts`** — novo arquivo espelhando `package-managers-lessons.ts`: importa os 3 `metadata.json`, exporta `GIT_LESSONS: LessonMetadata[]` + helpers `getGitLessonById` / `getGitLessonsByWeek`.
4. **`features/curriculum/data/index.ts`** — `import { GIT_LESSONS }` + `if (stackId === 'git') return GIT_LESSONS` em `getLessonsForStack`.
5. **`features/lessons/components/TheoryReader.tsx`** — adicionar a chave `'git'` no `MDX_IMPORTS` (mapa `dayId → () => import(...theory.mdx)`).
6. **`features/lessons/components/QuizRunner.tsx`** — adicionar a chave `'git'` no mapa equivalente de quizzes.

Slugs finais: `day-01-historico-local`, `day-02-branches-merge-rebase`, `day-03-remotes-prs-conflitos`.

---

## Critérios de Aceite

- O card "Git & Fluxo de Trabalho" aparece na seção **Fundamentos** (posição inalterada) agora como `available` e com **3 dias**.
- Clicar abre o dashboard do stack com 3 dias.
- Cada dia carrega `theory.mdx` (começando com `# Título`, terminando com `> **Resumo:**`) e um quiz funcional que pontua e permite concluir.
- Os diagramas de ramificação aparecem em monospace (blocos ` ```text `) e alinhados corretamente.
- Progresso/XP funcionam como nos demais stacks (sem código novo de progresso — só registro de dados).
- `pnpm typecheck` passa; `pnpm build` compila todos os MDX/loaders; nenhum stack existente quebra.

---

## Fora de Escopo

- Não há lições sobre `stash`, `cherry-pick`, `reflog`, `bisect`, submodules ou hooks — ficam fora do recorte "dia a dia" de 3 dias (podem virar um stack avançado de Git no futuro).
- Não muda a infraestrutura de visualizadores nem adiciona dependências (sem Mermaid).
- Não altera o posicionamento do card nem a cor do stack.
