# Git & Fluxo de Trabalho Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redimensionar o stack `git` de 7 para 3 dias e ativá-lo com conteúdo completo (teoria + quiz) sobre o fluxo de trabalho do dia a dia.

**Architecture:** Mesmo padrão do stack "Gerenciador de Pacotes": 3 pastas de conteúdo em `content/git/` (cada uma com `metadata.json` + `theory.mdx` + `quiz.json`), um arquivo `git-lessons.ts` no currículo, registro nos loaders estáticos (`TheoryReader`/`QuizRunner`), dispatch no `index.ts` do currículo, e modificação do objeto `git` já existente em `stacks.ts`. Diagramas de ramificação em ASCII dentro de blocos ` ```text `.

**Tech Stack:** React 19, Vite 8, TypeScript, MDX (`@mdx-js/rollup`), Tailwind 4, pnpm monorepo.

---

## ⚠️ GIT GUARDRAILS (para todos os subagents)

- **NÃO** rode `git rebase`, `git reset`, `git commit --amend`, `git stash`, `git push`, nem nada que reescreva histórico.
- Use **apenas** `git add <arquivos>` e `git commit` para os arquivos do seu task.
- Antes de começar, confirme que a working tree está limpa exceto pelo seu trabalho. Se houver mudanças inesperadas de outra origem, **PARE e reporte BLOCKED** — não tente resolver.
- Trabalhe na branch atual `feat/trilha-fundamentos`. **Não** crie nem troque de branch.
- O arquivo `.claude/launch.json` pode aparecer como untracked — **ignore-o**, não o adicione a commits.

---

## Ordem de Execução

Tarefas 1–3 criam conteúdo novo (não afetam o build existente). Tarefas 4–6 fazem a fiação e só funcionam depois que o conteúdo existe. Execute em ordem; o build/typecheck fica verde em cada commit.

| Task | Entrega | Verificação |
|------|---------|-------------|
| 1 | Conteúdo Dia 1 | JSON válido |
| 2 | Conteúdo Dia 2 | JSON válido |
| 3 | Conteúdo Dia 3 | JSON válido |
| 4 | Currículo (`git-lessons.ts` + `index.ts`) | `pnpm typecheck` |
| 5 | Loaders (`TheoryReader` + `QuizRunner`) | `pnpm typecheck` |
| 6 | Ativar stack (`stacks.ts`) | `pnpm build` + preview |

> **Nota sobre testes:** conteúdo estático (MDX/JSON) não tem teste unitário. A verificação é: JSON parseia, `pnpm typecheck` passa após a fiação, e `pnpm build` compila todos os MDX/loaders. A verificação final (Task 6) inclui preview no navegador.

---

### Task 1: Conteúdo do Dia 1 — Commits, Conventional Commits e Como Desfazer

**Files:**
- Create: `apps/web/src/content/git/day-01-historico-local/metadata.json`
- Create: `apps/web/src/content/git/day-01-historico-local/theory.mdx`
- Create: `apps/web/src/content/git/day-01-historico-local/quiz.json`

- [ ] **Step 1: Criar `metadata.json`**

```json
{
  "id": "day-01",
  "day": 1,
  "week": 1,
  "title": "Commits, Conventional Commits e Como Desfazer",
  "slug": "historico-local",
  "topics": [
    "staging area: working tree, index e commit",
    "anatomia de um bom commit (atômico, mensagem)",
    "Conventional Commits",
    "git restore: descartar mudanças",
    "git reset: --soft, --mixed, --hard",
    "git revert: desfazer com segurança"
  ],
  "difficulty": "foundational",
  "estimatedMinutes": 45,
  "prerequisites": [],
  "hasVisualizer": false,
  "hasChallenge": false,
  "xpReward": 100
}
```

- [ ] **Step 2: Criar `theory.mdx`**

````mdx
# Commits, Conventional Commits e Como Desfazer

Você já usou `git add` e `git commit` — então já sabe gravar um ponto no histórico. Mas saber *gravar* é diferente de manter um histórico que ajuda você (e seu time) seis meses depois. Este dia é sobre isso: fazer commits que contam uma história clara, padronizar as mensagens, e — o mais importante para quem está começando — **desfazer com segurança** quando algo dá errado.

## O staging area, em 30 segundos

Antes de fazer melhor, vale alinhar o vocabulário. Toda mudança passa por três áreas:

```text
working tree   →   staging area (index)   →   repositório (commits)
  você edita         git add                    git commit
```

- **Working tree** — seus arquivos como estão no disco agora.
- **Staging area** (ou *index*) — a "prévia" do próximo commit. `git add` move mudanças do working tree para cá.
- **Repositório** — o histórico de commits. `git commit` transforma o que está no staging em um commit permanente.

O staging area existe para você **escolher o que entra em cada commit** — não precisa commitar tudo de uma vez. Veja o estado de cada área com `git status`.

## O que é um bom commit

Um commit é a menor unidade de mudança versionada. Dois princípios fazem toda a diferença:

**Atômico** — um commit faz *uma* coisa. Corrigir um bug e renomear dez variáveis são dois commits, não um. Commits atômicos são fáceis de revisar, de reverter (você desfaz só o que precisa) e de entender no histórico.

**Mensagem que explica o porquê** — o código mostra *o que* mudou; a mensagem deve dizer *por que*. "ajustes" não ajuda ninguém. "corrige cálculo de desconto que ignorava centavos" ajuda.

## Conventional Commits

Times padronizam mensagens com a convenção **Conventional Commits**, no formato:

```text
tipo(escopo opcional): descrição curta no imperativo

corpo opcional explicando o porquê
```

Os tipos mais comuns:

- `feat` — uma nova funcionalidade
- `fix` — correção de bug
- `docs` — só documentação
- `refactor` — muda código sem mudar comportamento
- `test` — adiciona ou ajusta testes
- `chore` — tarefas de manutenção (dependências, config)

Exemplos:

```text
feat(auth): adiciona login com Google
fix: corrige desconto que ignorava centavos
docs(readme): explica como rodar os testes
```

Por que vale a pena: o histórico fica legível de bater o olho, dá para gerar changelog automaticamente, e ferramentas de versionamento (semver) conseguem decidir sozinhas se a próxima versão é `patch` (um `fix`) ou `minor` (um `feat`). É a mesma convenção que este projeto usa.

## Desfazer com segurança

Aqui mora a dúvida número um de quem está aprendendo Git: *"eu pisei na bola, como volto?"*. A resposta depende de **onde** a mudança está. Três comandos resolvem quase tudo.

### `git restore` — descartar o que ainda não foi commitado

Você editou um arquivo, se arrependeu e quer voltar ao último commit:

```bash
git restore src/app.ts            # descarta mudanças no working tree
git restore --staged src/app.ts   # tira do staging, mas mantém a edição
```

`restore` mexe só no working tree e no staging. Os commits não são tocados.

### `git reset` — mover o ponteiro da branch

`reset` move a branch para um commit anterior. O que acontece com as mudanças dos commits descartados depende do modo:

```text
                    as mudanças vão para onde?
git reset --soft    para o staging area (prontas para recommitar)
git reset --mixed   para o working tree (não staged)  ← padrão
git reset --hard    descartadas de vez (cuidado!)
```

```bash
git reset --soft HEAD~1    # desfaz o último commit, mantém tudo staged
git reset --mixed HEAD~1   # (padrão) desfaz o commit, deixa as mudanças no working tree
git reset --hard HEAD~1    # desfaz o commit E as mudanças — irreversível
```

Use `--soft` para refazer um commit mal feito; `--hard` só quando tem certeza de que quer jogar o trabalho fora.

### `git revert` — desfazer um commit já compartilhado

`reset` reescreve o histórico — péssimo se o commit já foi para o repositório remoto e outras pessoas já o têm. Para esses casos, `revert` cria um commit **novo** que desfaz as mudanças do antigo, sem apagar nada:

```text
antes:    A───B───C
depois:   A───B───C───C'    (C' desfaz exatamente o que C fez)
```

```bash
git revert HEAD    # cria um commit que desfaz o último
```

Regra prática: **commit ainda local → `reset`; commit já compartilhado → `revert`.**

> **Resumo:** Um bom commit é atômico e tem mensagem que explica o porquê; Conventional Commits (`feat`/`fix`/`docs`…) padronizam o histórico e habilitam changelogs e versionamento automático. Para desfazer: `restore` descarta mudanças não commitadas, `reset` move a branch (`--soft` guarda no staging, `--mixed` no working tree, `--hard` joga fora) e serve para commits ainda locais, enquanto `revert` cria um commit inverso e é o jeito seguro de desfazer algo já compartilhado.
````

- [ ] **Step 3: Criar `quiz.json`**

```json
{
  "lessonId": "day-01",
  "passingScore": 70,
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "O que é o staging area (index) no Git?",
      "options": [
        "A pasta onde o Git guarda o código de produção",
        "A prévia do próximo commit — onde você escolhe, com `git add`, o que será incluído",
        "Um backup automático do working tree",
        "O histórico completo de todos os commits"
      ],
      "correctAnswer": 1,
      "explanation": "O staging area (ou index) é a prévia do próximo commit. Você usa `git add` para mover mudanças do working tree para o staging, escolhendo exatamente o que entra em cada commit. Ele fica entre o working tree (arquivos no disco) e o repositório (commits gravados)."
    },
    {
      "id": "q2",
      "type": "multiple-choice",
      "question": "O que caracteriza um bom commit \"atômico\"?",
      "options": [
        "Um commit que altera o maior número possível de arquivos de uma vez",
        "Um commit que faz uma única coisa coerente, fácil de revisar e reverter",
        "Um commit feito sem mensagem para ser mais rápido",
        "Um commit que só pode ser desfeito com `--hard`"
      ],
      "correctAnswer": 1,
      "explanation": "Um commit atômico faz uma única coisa coerente. Isso o torna fácil de revisar, de entender no histórico e de reverter sem afetar mudanças não relacionadas. Misturar correção de bug com renomeações, por exemplo, deveria ser dois commits."
    },
    {
      "id": "q3",
      "type": "multiple-choice",
      "question": "Seguindo Conventional Commits, qual tipo você usa para uma correção de bug?",
      "options": [
        "feat",
        "fix",
        "docs",
        "chore"
      ],
      "correctAnswer": 1,
      "explanation": "`fix` é o tipo para correção de bug. `feat` é para nova funcionalidade, `docs` para mudanças só de documentação e `chore` para manutenção (dependências, config). Ferramentas de versionamento usam `fix` para indicar um incremento de `patch` e `feat` para `minor`."
    },
    {
      "id": "q4",
      "type": "true-false",
      "question": "`git reset --hard HEAD~1` é seguro porque sempre dá para recuperar facilmente as mudanças descartadas depois.",
      "options": ["Verdadeiro", "Falso"],
      "correctAnswer": 1,
      "explanation": "Falso. `git reset --hard` descarta o commit E as mudanças no working tree de forma irreversível na prática (não ficam no staging nem no working tree). Use `--hard` só quando tiver certeza de que quer jogar o trabalho fora; para apenas desfazer o commit mantendo as mudanças, use `--soft` ou `--mixed`."
    },
    {
      "id": "q5",
      "type": "multiple-choice",
      "question": "Qual modo de `git reset` desfaz o commit mas mantém as mudanças já no staging area, prontas para recommitar?",
      "options": [
        "git reset --hard",
        "git reset --mixed",
        "git reset --soft",
        "git restore"
      ],
      "correctAnswer": 2,
      "explanation": "`git reset --soft` move a branch para trás mas deixa as mudanças no staging area, prontas para um novo commit — ideal para refazer um commit mal feito. `--mixed` (padrão) deixa as mudanças no working tree (não staged); `--hard` descarta tudo."
    },
    {
      "id": "q6",
      "type": "multiple-choice",
      "question": "Você commitou e já deu `push`; o commit está no remoto e o time já o baixou. Como desfazê-lo com segurança?",
      "options": [
        "git reset --hard HEAD~1",
        "git revert HEAD",
        "git restore .",
        "git reset --soft HEAD~1"
      ],
      "correctAnswer": 1,
      "explanation": "`git revert HEAD` cria um commit novo que desfaz as mudanças do anterior, sem reescrever o histórico — seguro quando o commit já é compartilhado. `reset` reescreveria o histórico que outras pessoas já têm, causando divergência. Regra: commit local → `reset`; commit compartilhado → `revert`."
    }
  ]
}
```

- [ ] **Step 4: Validar os JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('apps/web/src/content/git/day-01-historico-local/metadata.json','utf8')); JSON.parse(require('fs').readFileSync('apps/web/src/content/git/day-01-historico-local/quiz.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/content/git/day-01-historico-local
git commit -m "feat(git): conteúdo do Dia 1 (commits, conventional, desfazer)"
```

---

### Task 2: Conteúdo do Dia 2 — Branches, Merge e Rebase

**Files:**
- Create: `apps/web/src/content/git/day-02-branches-merge-rebase/metadata.json`
- Create: `apps/web/src/content/git/day-02-branches-merge-rebase/theory.mdx`
- Create: `apps/web/src/content/git/day-02-branches-merge-rebase/quiz.json`

- [ ] **Step 1: Criar `metadata.json`**

```json
{
  "id": "day-02",
  "day": 2,
  "week": 1,
  "title": "Branches, Merge e Rebase",
  "slug": "branches-merge-rebase",
  "topics": [
    "branches como ponteiros baratos",
    "criar e trocar branches (switch/checkout)",
    "fast-forward vs merge commit",
    "rebase: reescrita linear",
    "merge vs rebase: quando usar cada um",
    "golden rule do rebase"
  ],
  "difficulty": "intermediate",
  "estimatedMinutes": 50,
  "prerequisites": ["day-01"],
  "hasVisualizer": false,
  "hasChallenge": false,
  "xpReward": 100
}
```

- [ ] **Step 2: Criar `theory.mdx`**

````mdx
# Branches, Merge e Rebase

Branches são o que torna o Git poderoso para trabalho em paralelo — e também onde mora a confusão entre `merge` e `rebase`. Hoje você vai entender o que uma branch realmente é (mais simples do que parece), como integrar o trabalho de duas branches de duas formas diferentes, e quando escolher cada uma.

## Uma branch é só um ponteiro

Não pense em branch como uma "cópia do projeto". Uma branch é apenas um **ponteiro leve para um commit**. Cada commit aponta para o seu pai, formando uma corrente; a branch é uma etiqueta que marca a ponta de uma dessas correntes.

```text
A───B───C   ← main
```

Aqui `main` aponta para `C`. Criar uma branch é criar outra etiqueta apontando para o mesmo commit — barato e instantâneo, não importa o tamanho do projeto:

```bash
git switch -c feature    # cria a branch 'feature' e muda para ela
git switch main          # volta para a main
git branch               # lista as branches
```

`git switch` é o comando moderno para criar e trocar de branch. Você talvez veja `git checkout -b feature` em tutoriais antigos — faz a mesma coisa, mas `checkout` é sobrecarregado (também restaura arquivos), então prefira `switch`.

## Integrando branches: fast-forward vs merge commit

Quando o trabalho na `feature` fica pronto, você o integra de volta na `main`. Há dois cenários.

**Fast-forward** — se a `main` não recebeu nenhum commit novo desde que você criou a `feature`, o Git só **avança a etiqueta** `main` para frente. Nenhum commit novo é criado:

```text
antes:   A───B───C        ← main
                  \
                   D───E   ← feature

depois:  A───B───C───D───E   ← main e feature  (main "andou" até E)
```

**Merge commit** — se a `main` recebeu commits próprios enquanto você trabalhava, as histórias **divergiram**. O Git cria um **commit de merge** (`M`), com dois pais, costurando as duas linhas:

```text
         A───B───C───F        ← main
              \           \
               D───E───────M   ← M tem dois pais: F e E
```

```bash
git switch main
git merge feature
```

O merge commit preserva exatamente o que aconteceu: duas linhas de trabalho que se encontraram. O histórico fica fiel, mas com bifurcações.

## Rebase: reescrevendo em linha reta

`rebase` resolve a mesma divergência de outro jeito: em vez de costurar com um merge commit, ele **reaplica os seus commits no topo da outra branch**, como se você tivesse começado a trabalhar a partir dali. O resultado é um histórico **linear**.

```text
antes:   A───B───C───F      ← main
              \
               D───E         ← feature

depois (rebase de feature sobre main):
         A───B───C───F───D'──E'   ← feature
```

Repare: `D` e `E` viraram `D'` e `E'`. São commits **novos** (mesmo conteúdo, pai diferente). O histórico original de `D`/`E` foi reescrito.

```bash
git switch feature
git rebase main          # reaplica D e E sobre o topo da main
```

## Merge vs rebase: quando usar cada um

Não existe "certo" universal — é uma escolha entre **fidelidade** e **limpeza**:

- **Merge** preserva o histórico real, incluindo as bifurcações. Bom para integrar branches de longa duração e quando rastrear "o que aconteceu de verdade" importa.
- **Rebase** produz um histórico linear, fácil de ler. Bom para limpar os seus commits locais antes de abrir um PR, ou para manter a sua branch atualizada com a `main` sem encher de merge commits.

### A golden rule do rebase

Como o rebase **reescreve commits** (cria novos no lugar dos antigos), há uma regra de ouro:

> **Nunca faça rebase de commits que já foram compartilhados** (já estão no remoto e outras pessoas podem tê-los).

Se você reescreve um histórico que outra pessoa já baixou, as duas cópias divergem e a sincronização vira um pesadelo. Faça rebase à vontade nos seus commits **locais**; use merge para integrar o que já é público.

> **Resumo:** Uma branch é só um ponteiro barato para um commit. Integrar duas branches tem dois caminhos: `merge` faz fast-forward (só avança a etiqueta) quando não há divergência, ou cria um merge commit de dois pais quando há — preservando o histórico real; `rebase` reaplica os seus commits no topo da outra branch, gerando histórico linear ao custo de reescrevê-los. Escolha merge por fidelidade e rebase por limpeza, sempre respeitando a golden rule: nunca faça rebase de commits já compartilhados.
````

- [ ] **Step 3: Criar `quiz.json`**

```json
{
  "lessonId": "day-02",
  "passingScore": 70,
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "O que é uma branch no Git?",
      "options": [
        "Uma cópia completa de todos os arquivos do projeto",
        "Um ponteiro leve para um commit",
        "Um backup compactado do repositório",
        "Uma pasta separada dentro de node_modules"
      ],
      "correctAnswer": 1,
      "explanation": "Uma branch é apenas um ponteiro leve para um commit — uma etiqueta que marca a ponta de uma corrente de commits. Por isso criar uma branch é barato e instantâneo, independentemente do tamanho do projeto: nada é copiado."
    },
    {
      "id": "q2",
      "type": "multiple-choice",
      "question": "Qual é o comando moderno para criar uma branch nova e já trocar para ela?",
      "options": [
        "git branch -c feature",
        "git switch -c feature",
        "git merge feature",
        "git checkout feature"
      ],
      "correctAnswer": 1,
      "explanation": "`git switch -c feature` cria a branch `feature` e muda para ela. `git switch` é o comando moderno; o antigo `git checkout -b feature` faz o mesmo, mas `checkout` é sobrecarregado (também restaura arquivos), então `switch` é preferível."
    },
    {
      "id": "q3",
      "type": "multiple-choice",
      "question": "Quando um merge é resolvido como fast-forward (sem criar merge commit)?",
      "options": [
        "Quando a branch de destino não recebeu commits novos desde que a feature foi criada",
        "Sempre que se usa `git merge`",
        "Apenas quando há conflitos",
        "Quando a feature tem mais commits que a main"
      ],
      "correctAnswer": 0,
      "explanation": "O fast-forward acontece quando a branch de destino (ex.: main) não avançou desde que a feature foi criada. Como não houve divergência, o Git só move a etiqueta da main para frente, sem criar um merge commit. Se a main recebeu commits próprios, as histórias divergem e um merge commit é criado."
    },
    {
      "id": "q4",
      "type": "true-false",
      "question": "Um merge commit tem dois pais.",
      "options": ["Verdadeiro", "Falso"],
      "correctAnswer": 0,
      "explanation": "Verdadeiro. Um merge commit costura duas linhas de histórico que divergiram, então ele aponta para dois pais — o último commit de cada branch envolvida. É isso que o torna distinto de um commit normal (que tem um único pai)."
    },
    {
      "id": "q5",
      "type": "multiple-choice",
      "question": "O que o `git rebase main` (estando na feature) faz com os commits da feature?",
      "options": [
        "Apaga os commits da feature permanentemente",
        "Reaplica os commits no topo da main, criando novos commits e um histórico linear",
        "Cria um merge commit com dois pais",
        "Move a main para o topo da feature"
      ],
      "correctAnswer": 1,
      "explanation": "O rebase reaplica os commits da feature no topo da main, como se você tivesse começado a partir dali. Isso gera commits novos (mesmo conteúdo, pai diferente) e um histórico linear, sem merge commit — ao custo de reescrever os commits originais."
    },
    {
      "id": "q6",
      "type": "multiple-choice",
      "question": "Qual é a \"golden rule\" do rebase?",
      "options": [
        "Sempre rebase antes de cada commit",
        "Nunca faça rebase de commits que já foram compartilhados (já estão no remoto)",
        "Só use rebase em repositórios sem branches",
        "Rebase sempre cria conflitos, então evite-o"
      ],
      "correctAnswer": 1,
      "explanation": "A golden rule: nunca faça rebase de commits já compartilhados. Como o rebase reescreve commits, se outra pessoa já baixou o histórico original, as cópias divergem e a sincronização vira um pesadelo. Rebase é seguro nos seus commits locais; para integrar o que já é público, use merge."
    }
  ]
}
```

- [ ] **Step 4: Validar os JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('apps/web/src/content/git/day-02-branches-merge-rebase/metadata.json','utf8')); JSON.parse(require('fs').readFileSync('apps/web/src/content/git/day-02-branches-merge-rebase/quiz.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/content/git/day-02-branches-merge-rebase
git commit -m "feat(git): conteúdo do Dia 2 (branches, merge e rebase)"
```

---

### Task 3: Conteúdo do Dia 3 — Remotes, Pull Requests e Conflitos

**Files:**
- Create: `apps/web/src/content/git/day-03-remotes-prs-conflitos/metadata.json`
- Create: `apps/web/src/content/git/day-03-remotes-prs-conflitos/theory.mdx`
- Create: `apps/web/src/content/git/day-03-remotes-prs-conflitos/quiz.json`

- [ ] **Step 1: Criar `metadata.json`**

```json
{
  "id": "day-03",
  "day": 3,
  "week": 1,
  "title": "Remotes, Pull Requests e Conflitos",
  "slug": "remotes-prs-conflitos",
  "topics": [
    "remotes: origin, clone, fetch, pull, push",
    "tracking branches",
    "Pull Requests e code review",
    "por que conflitos acontecem",
    "anatomia dos marcadores de conflito",
    "fluxo completo do dia a dia"
  ],
  "difficulty": "intermediate",
  "estimatedMinutes": 50,
  "prerequisites": ["day-02"],
  "hasVisualizer": false,
  "hasChallenge": false,
  "xpReward": 100
}
```

- [ ] **Step 2: Criar `theory.mdx`**

````mdx
# Remotes, Pull Requests e Conflitos

Até aqui tudo foi local. Mas o Git brilha mesmo quando várias pessoas trabalham no mesmo projeto. Hoje você conecta o seu repositório a um remoto (como o GitHub), aprende o fluxo de Pull Request que os times usam para revisar código, e encara o inevitável: conflitos.

## Remotes: o repositório lá fora

Um **remote** é uma cópia do repositório hospedada em outro lugar (GitHub, GitLab…). Por convenção, o remote principal se chama **`origin`**.

```text
seu computador  ⇄  origin (GitHub)
   git push  →   envia os seus commits
   git fetch ←   baixa commits dos outros
```

Os comandos do dia a dia:

```bash
git clone <url>     # baixa um repositório remoto pela primeira vez
git fetch           # baixa commits novos do remoto SEM mesclar
git pull            # fetch + merge: baixa E integra na sua branch atual
git push            # envia os seus commits locais para o remoto
```

A diferença entre `fetch` e `pull` confunde no início: `fetch` só **baixa** (você vê o que mudou antes de integrar); `pull` **baixa e já mescla** na sua branch. Ou seja, `pull` é `fetch` + `merge` em um passo só.

Quando você cria uma branch local e dá `git push -u origin feature`, ela passa a **rastrear** a branch remota (vira uma *tracking branch*) — depois disso, `git push` e `git pull` sozinhos já sabem com quem falar.

## Pull Requests

Você *poderia* dar push direto na `main`, mas times não fazem isso. Em vez disso, usam **Pull Requests** (PRs) — no GitHub, é o mecanismo de propor mudanças e revisá-las antes de integrar.

O fluxo:

```text
1. cria branch     →  git switch -c feat/login
2. trabalha        →  commits (conventional!)
3. envia           →  git push -u origin feat/login
4. abre o PR       →  no GitHub: "feat/login → main"
5. code review     →  o time comenta, sugere, aprova
6. merge           →  o PR é integrado na main
```

O PR existe para criar um ponto de **revisão**: outra pessoa lê o seu código, aponta problemas e aprova antes de virar parte da `main`. É onde a qualidade é discutida.

## Conflitos: por que acontecem

Um **conflito** acontece quando duas mudanças tocam **a mesma região do mesmo arquivo** de formas diferentes, e o Git não sabe qual manter. Ele não adivinha — ele para e pede para você decidir.

```text
         A───B───C        ← main: alterou a linha 10
              \
               D───E       ← feature: também alterou a linha 10
```

Ao mesclar a `feature` na `main`, o Git marca o trecho conflitante assim, **dentro do arquivo**:

```text
<<<<<<< HEAD
preco = total * 0.9        (versão da main)
=======
preco = total - desconto   (versão da feature)
>>>>>>> feature
```

Para resolver, você **edita o arquivo à mão**: escolhe uma das versões, combina as duas, ou escreve algo novo — e **apaga os marcadores** `<<<<<<<`, `=======` e `>>>>>>>`. Depois:

```bash
git add arquivo-resolvido.ts   # marca como resolvido
git commit                     # conclui o merge
```

Conflito não é erro nem sinal de que você fez algo errado — é só o Git sendo honesto sobre uma decisão que precisa de um humano.

## O fluxo completo do dia a dia

Juntando os três dias, eis o ciclo de trabalho de quase todo time:

```bash
git switch main && git pull         # 1. parta da main atualizada
git switch -c feat/checkout         # 2. crie a sua branch
# ... edite, git add ...
git commit -m "feat: novo checkout" # 3. commits atômicos e convencionais
git push -u origin feat/checkout    # 4. envie a branch
# 5. abra o PR no GitHub, resolva conflitos se aparecerem, peça review
# 6. depois de aprovado, faça o merge do PR
```

> **Resumo:** Um remote (`origin`) é a cópia hospedada do repositório: `clone` baixa pela primeira vez, `fetch` baixa sem mesclar, `pull` baixa e mescla, `push` envia os seus commits. Times integram via Pull Requests — branch → push → PR → review → merge — para revisar antes de juntar na `main`. Conflitos surgem quando duas mudanças tocam a mesma região; o Git marca os trechos com `<<<<<<<`/`=======`/`>>>>>>>` e você resolve editando o arquivo, removendo os marcadores e dando `git add` + `git commit`.
````

- [ ] **Step 3: Criar `quiz.json`**

```json
{
  "lessonId": "day-03",
  "passingScore": 70,
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "No Git, o que normalmente é o `origin`?",
      "options": [
        "A branch principal do projeto",
        "O nome convencional do remote principal (o repositório hospedado, ex.: no GitHub)",
        "O primeiro commit do repositório",
        "Um arquivo de configuração local"
      ],
      "correctAnswer": 1,
      "explanation": "`origin` é o nome convencional do remote principal — a cópia do repositório hospedada em um servidor como o GitHub. É para ele que você dá `push` e de onde você faz `fetch`/`pull`."
    },
    {
      "id": "q2",
      "type": "multiple-choice",
      "question": "Qual é a diferença entre `git fetch` e `git pull`?",
      "options": [
        "Não há diferença, são sinônimos",
        "`fetch` só baixa os commits do remoto; `pull` baixa e já mescla na sua branch atual",
        "`fetch` envia commits e `pull` baixa commits",
        "`fetch` funciona offline e `pull` precisa de internet"
      ],
      "correctAnswer": 1,
      "explanation": "`fetch` apenas baixa os commits novos do remoto, sem mexer na sua branch — você inspeciona antes de integrar. `pull` é `fetch` + `merge`: baixa e já mescla na sua branch atual em um passo só."
    },
    {
      "id": "q3",
      "type": "multiple-choice",
      "question": "Por que times usam Pull Requests em vez de dar push direto na main?",
      "options": [
        "Porque o push direto na main é tecnicamente impossível",
        "Para criar um ponto de revisão (code review) antes de integrar as mudanças na main",
        "Porque PRs deixam o repositório mais leve",
        "Para evitar a necessidade de commits"
      ],
      "correctAnswer": 1,
      "explanation": "O Pull Request cria um ponto de revisão: outra pessoa lê o código, comenta, sugere e aprova antes de a mudança virar parte da main. É onde a qualidade é discutida — não é uma limitação técnica, e sim uma prática de colaboração."
    },
    {
      "id": "q4",
      "type": "true-false",
      "question": "Um conflito de merge significa que você cometeu um erro e fez algo errado no Git.",
      "options": ["Verdadeiro", "Falso"],
      "correctAnswer": 1,
      "explanation": "Falso. Um conflito acontece quando duas mudanças tocam a mesma região do mesmo arquivo de formas diferentes, e o Git — corretamente — não adivinha qual manter. É um pedido de decisão humana, não um erro seu."
    },
    {
      "id": "q5",
      "type": "multiple-choice",
      "question": "Você abriu um arquivo e viu marcadores `<<<<<<<`, `=======` e `>>>>>>>`. O que fazer?",
      "options": [
        "Rodar `git reset --hard` imediatamente para apagar tudo",
        "Editar o arquivo escolhendo/combinando as versões, remover os marcadores e dar `git add` + `git commit`",
        "Deletar o arquivo inteiro e recriá-lo do zero",
        "Ignorar os marcadores, pois o Git os remove sozinho"
      ],
      "correctAnswer": 1,
      "explanation": "Esses marcadores delimitam as duas versões em conflito (HEAD vs a outra branch). Você resolve editando o arquivo à mão — escolhendo uma versão, combinando as duas ou escrevendo algo novo — e apagando os marcadores. Depois, `git add` marca como resolvido e `git commit` conclui o merge."
    },
    {
      "id": "q6",
      "type": "multiple-choice",
      "question": "O que `git push -u origin feature` faz além de enviar a branch?",
      "options": [
        "Apaga a branch local depois de enviar",
        "Configura a branch local para rastrear a branch remota (tracking), simplificando push/pull futuros",
        "Faz merge da feature na main automaticamente",
        "Cria um Pull Request no GitHub"
      ],
      "correctAnswer": 1,
      "explanation": "A flag `-u` (`--set-upstream`) configura a branch local para rastrear a remota. Depois disso, um simples `git push` ou `git pull` (sem argumentos) já sabe com qual branch remota falar. Abrir o PR ainda é um passo manual no GitHub."
    }
  ]
}
```

- [ ] **Step 4: Validar os JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('apps/web/src/content/git/day-03-remotes-prs-conflitos/metadata.json','utf8')); JSON.parse(require('fs').readFileSync('apps/web/src/content/git/day-03-remotes-prs-conflitos/quiz.json','utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/content/git/day-03-remotes-prs-conflitos
git commit -m "feat(git): conteúdo do Dia 3 (remotes, PRs e conflitos)"
```

---

### Task 4: Registrar o currículo do Git

**Files:**
- Create: `apps/web/src/features/curriculum/data/git-lessons.ts`
- Modify: `apps/web/src/features/curriculum/data/index.ts`

- [ ] **Step 1: Criar `git-lessons.ts`**

```ts
import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/git/day-01-historico-local/metadata.json'
import day02 from '@/content/git/day-02-branches-merge-rebase/metadata.json'
import day03 from '@/content/git/day-03-remotes-prs-conflitos/metadata.json'

export const GIT_LESSONS: LessonMetadata[] = [
  day01, day02, day03,
].map(l => l as LessonMetadata)

export function getGitLessonById(id: string): LessonMetadata | undefined {
  return GIT_LESSONS.find(l => l.id === id)
}

export function getGitLessonsByWeek(week: number): LessonMetadata[] {
  return GIT_LESSONS.filter(l => l.week === week)
}
```

- [ ] **Step 2: Adicionar o import em `index.ts`**

Logo após a linha `import { PACKAGE_MANAGERS_LESSONS } from './package-managers-lessons'`, adicionar:

```ts
import { GIT_LESSONS } from './git-lessons'
```

- [ ] **Step 3: Adicionar o dispatch em `index.ts`**

Dentro de `getLessonsForStack`, logo após a linha `if (stackId === 'package-managers') return PACKAGE_MANAGERS_LESSONS`, adicionar:

```ts
  if (stackId === 'git') return GIT_LESSONS
```

- [ ] **Step 4: Verificar typecheck**

Run: `pnpm --filter @academy/web typecheck`
Expected: sem novos erros relacionados a `git-lessons` ou `index.ts` (erros pré-existentes em outros arquivos não contam).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/curriculum/data/git-lessons.ts apps/web/src/features/curriculum/data/index.ts
git commit -m "feat(git): registra currículo do stack git"
```

---

### Task 5: Fiar os loaders de teoria e quiz

**Files:**
- Modify: `apps/web/src/features/lessons/components/TheoryReader.tsx`
- Modify: `apps/web/src/features/lessons/components/QuizRunner.tsx`

- [ ] **Step 1: Adicionar a chave `git` no `MDX_IMPORTS` de `TheoryReader.tsx`**

Dentro do objeto `MDX_IMPORTS`, logo após o bloco `'package-managers': { … },`, adicionar:

```ts
  'git': {
    'day-01': () => import('@/content/git/day-01-historico-local/theory.mdx'),
    'day-02': () => import('@/content/git/day-02-branches-merge-rebase/theory.mdx'),
    'day-03': () => import('@/content/git/day-03-remotes-prs-conflitos/theory.mdx'),
  },
```

- [ ] **Step 2: Adicionar a chave `git` no `QUIZ_IMPORTS` de `QuizRunner.tsx`**

Dentro do objeto `QUIZ_IMPORTS`, logo após o bloco `'package-managers': { … },`, adicionar:

```ts
  'git': {
    'day-01': () => import('@/content/git/day-01-historico-local/quiz.json'),
    'day-02': () => import('@/content/git/day-02-branches-merge-rebase/quiz.json'),
    'day-03': () => import('@/content/git/day-03-remotes-prs-conflitos/quiz.json'),
  },
```

- [ ] **Step 3: Verificar typecheck**

Run: `pnpm --filter @academy/web typecheck`
Expected: sem novos erros (os imports de `theory.mdx`/`quiz.json` resolvem porque os arquivos já existem das Tasks 1–3).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/features/lessons/components/TheoryReader.tsx apps/web/src/features/lessons/components/QuizRunner.tsx
git commit -m "feat(git): fia loaders de teoria e quiz do stack git"
```

---

### Task 6: Ativar o stack Git (redimensionar para 3 dias)

**Files:**
- Modify: `apps/web/src/features/stacks/data/stacks.ts:59-69`

- [ ] **Step 1: Modificar o objeto `git` em `stacks.ts`**

Substituir o objeto `git` existente (atualmente `7` dias e `coming-soon`) por:

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
  },
```

(Mudam apenas `tagline`, `description`, `totalDays` e `status`; `id`, `name`, `level`, `color` e `weekThemes` permanecem.)

- [ ] **Step 2: Verificar o build completo**

Run: `pnpm --filter @academy/web build`
Expected: build conclui com sucesso, compilando os 3 `theory.mdx` e os 3 `quiz.json` do git sem erros.

- [ ] **Step 3: Rodar os testes**

Run: `pnpm --filter @academy/web test:run`
Expected: todos os testes passam (mesma contagem de antes — nenhum teste novo, nenhum quebrado).

- [ ] **Step 4: Verificação manual no preview**

Subir o dev server (`pnpm --filter @academy/web dev`) e confirmar:
- O card "Git & Fluxo de Trabalho" aparece na seção **Fundamentos** como `available`, com tagline "3 dias do commit ao Pull Request".
- Clicar abre o dashboard com **3 dias**.
- Dia 1 renderiza a teoria (H1, seções, blocos de código, diagrama ASCII do staging, blockquote de Resumo no fim) e o quiz carrega com 6 questões e permite concluir.
- Dias 2 e 3 idem (com os diagramas de ramificação ASCII alinhados em monospace).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/stacks/data/stacks.ts
git commit -m "feat(git): ativa o stack Git & Fluxo de Trabalho (3 dias)"
```

---

## Self-Review (preenchido pelo autor do plano)

**1. Cobertura do spec:**
- Metadados redimensionados (3 dias, available, nova tagline/descrição) → Task 6 ✅
- Dia 1 (commits/conventional/desfazer) → Task 1 ✅
- Dia 2 (branches/merge/rebase) → Task 2 ✅
- Dia 3 (remotes/PRs/conflitos) → Task 3 ✅
- Diagramas ASCII em ` ```text ` → presentes nos 3 theory.mdx ✅
- `git-lessons.ts` + dispatch no `index.ts` → Task 4 ✅
- Loaders `TheoryReader`/`QuizRunner` → Task 5 ✅
- Critérios de aceite (card available, 3 dias, teoria+quiz, build/typecheck) → Tasks 4–6 ✅

**2. Placeholders:** nenhum. Todo conteúdo (theory, quiz, código de fiação) está completo e verbatim.

**3. Consistência de tipos/nomes:**
- Slugs idênticos em metadata, paths, loaders e git-lessons: `day-01-historico-local`, `day-02-branches-merge-rebase`, `day-03-remotes-prs-conflitos` ✅
- `id`s `day-01`/`day-02`/`day-03` batem com `lessonId` dos quizzes ✅
- `GIT_LESSONS` / `getGitLessonById` / `getGitLessonsByWeek` consistentes com o padrão `package-managers-lessons.ts` ✅
- `difficulty` usa valores válidos do union (`foundational`/`intermediate`) ✅
- `prerequisites` encadeiam corretamente: `[]` → `["day-01"]` → `["day-02"]` ✅
