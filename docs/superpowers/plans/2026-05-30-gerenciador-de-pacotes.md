# Gerenciador de Pacotes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um stack `package-managers` ("Gerenciador de Pacotes") de 3 dias na sessão de fundamentos, com conteúdo completo (teoria + quiz) e ativá-lo (`available`).

**Architecture:** Stack de conteúdo seguindo o padrão existente do React Academy: um objeto em `STACKS`, três pastas de conteúdo (`metadata.json` + `theory.mdx` + `quiz.json`), um arquivo de currículo que importa os metadados, registro em `getLessonsForStack`, e entradas nos mapas de loaders `MDX_IMPORTS` (TheoryReader) e `QUIZ_IMPORTS` (QuizRunner). Nenhuma lógica nova — só dados e wiring.

**Tech Stack:** React 19, Vite 8, MDX (`@mdx-js/rollup`), TypeScript, pnpm workspaces. Verificação via `pnpm typecheck`, `pnpm lint` e o dev server.

**Spec:** [docs/superpowers/specs/2026-05-30-gerenciador-de-pacotes-design.md](../specs/2026-05-30-gerenciador-de-pacotes-design.md)

**Convenções herdadas (não inventar):**
- Conteúdo em **pt-BR**, voz didática igual aos stacks de HTML/CSS (frases diretas, "você", negrito em termos-chave).
- `theory.mdx` começa com `# Título` e **termina** com `> **Resumo:** …` (blockquote, uma linha, com linha em branco antes).
- `quiz.json` segue o tipo `Quiz`: `lessonId`, `passingScore: 70`, `questions[]` com `id`, `type`, `question`, `options`, `correctAnswer` (índice 0-based para multiple-choice), `explanation`.
- `metadata.json` segue `LessonMetadata`.

**Trabalho de verificação manual deste plano:** Não há testes automatizados de conteúdo. A verificação é `pnpm typecheck` + `pnpm lint` + abrir o stack no dev server e percorrer os 3 dias (teoria + quiz).

---

### Task 1: Registrar o stack em `STACKS`

**Files:**
- Modify: `apps/web/src/features/stacks/data/stacks.ts`

- [ ] **Step 1: Inserir o objeto do stack entre `typescript-essentials` e `git`**

Localize o objeto com `id: 'typescript-essentials'` e o objeto seguinte `id: 'git'`. Insira este novo objeto **entre os dois**:

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
  },
```

- [ ] **Step 2: Verificar typecheck**

Run: `pnpm --filter @academy/web typecheck`
Expected: PASS (sem erros). O objeto satisfaz a interface `Stack`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/features/stacks/data/stacks.ts
git commit -m "feat(package-managers): registra o stack na sessão de fundamentos"
```

---

### Task 2: Conteúdo do Dia 1 — O que é um Gerenciador de Pacotes?

**Files:**
- Create: `apps/web/src/content/package-managers/day-01-o-que-e/metadata.json`
- Create: `apps/web/src/content/package-managers/day-01-o-que-e/theory.mdx`
- Create: `apps/web/src/content/package-managers/day-01-o-que-e/quiz.json`

- [ ] **Step 1: Criar `metadata.json`**

```json
{
  "id": "day-01",
  "day": 1,
  "week": 1,
  "title": "O que é um Gerenciador de Pacotes?",
  "slug": "o-que-e",
  "topics": [
    "package.json e o manifesto do projeto",
    "dependencies vs devDependencies",
    "node_modules e o registry",
    "semver e ranges (^ ~)",
    "lockfiles e instalação determinística",
    "scripts"
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
# O que é um Gerenciador de Pacotes?

Nenhum projeto moderno de JavaScript é escrito do zero. Você usa um framework, uma biblioteca de datas, um validador, um bundler — dezenas de pacotes de **código de terceiros**. Um **gerenciador de pacotes** é a ferramenta que baixa esses pacotes, instala as versões certas, resolve o que cada um deles também precisa, e registra tudo de forma reproduzível. Sem ele, você baixaria arquivos `.js` na mão e rezaria para não esquecer nenhuma dependência. Hoje vamos entender as peças desse sistema — antes de comparar as ferramentas (npm, yarn, pnpm), você precisa entender *o que* elas gerenciam.

## O manifesto: `package.json`

Todo projeto JavaScript tem, na raiz, um arquivo `package.json`. Ele é o **manifesto** do projeto: descreve o nome, a versão e — o mais importante — a lista de dependências.

```json
{
  "name": "meu-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^8.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

Você raramente edita esse arquivo na mão para adicionar dependências — o gerenciador o atualiza para você quando você roda um comando de instalação. Mas é ele que torna o projeto **reproduzível**: dê o `package.json` a outra pessoa, ela roda um comando de instalação, e tem o mesmo conjunto de pacotes que você.

## `dependencies` vs `devDependencies`

Repare nos dois blocos. A distinção é importante:

- **`dependencies`** são os pacotes que seu código precisa **para rodar em produção** — o React, uma lib de requisições, um validador. Eles vão junto quando o app é publicado.
- **`devDependencies`** são ferramentas que você usa **só durante o desenvolvimento** — o bundler, o linter, o framework de testes, os tipos do TypeScript. O usuário final nunca executa essas ferramentas; elas existem para *construir* o app, não para *rodá-lo*.

Classificar errado não quebra seu projeto localmente (tudo é instalado em dev), mas infla o que vai para produção e confunde quem lê o manifesto. Regra prática: "isso precisa existir quando o app está no ar?" → `dependencies`. "Isso só serve na minha máquina enquanto desenvolvo?" → `devDependencies`.

## Onde os pacotes moram: `node_modules`

Quando você instala, o gerenciador baixa os pacotes do **registry** (veremos a seguir) e os coloca numa pasta chamada `node_modules`, na raiz do projeto. Essa pasta é a **materialização** das suas dependências — o código real que o `import` vai encontrar.

Duas verdades sobre `node_modules`:

1. **Ela é enorme.** Cada dependência tem suas próprias dependências (as *dependências transitivas*), então uma lista de 10 pacotes vira facilmente centenas de pastas. O meme "node_modules é o objeto mais pesado do universo" existe por um motivo.
2. **Ela nunca vai para o Git.** `node_modules` é sempre listada no `.gitignore`. Ela é descartável: pode ser recriada a qualquer momento a partir do `package.json` e do lockfile. Versionar essa pasta seria versionar gigabytes de código que não é seu.

## De onde vêm os pacotes: o registry

O gerenciador não inventa os pacotes — ele os baixa de um **registry**, um servidor central que hospeda pacotes publicados. O registry padrão é o **npm registry** (`registry.npmjs.org`), um repositório público com milhões de pacotes. Quando você instala `react`, o gerenciador pergunta ao registry "me dê a versão X do react", e o registry responde com o arquivo.

O importante: **npm, yarn e pnpm usam o mesmo registry**. Eles são ferramentas diferentes para baixar dos *mesmos* pacotes. Isso é o que torna possível trocar de gerenciador sem trocar de ecossistema.

## Versões: o semver

Repare no `"^19.0.0"` lá em cima. Pacotes seguem o **semver** (Semantic Versioning), um padrão de numeração com três partes: `MAJOR.MINOR.PATCH`.

- **MAJOR** (`19`.0.0): muda quando há uma quebra de compatibilidade — código que funcionava pode parar.
- **MINOR** (19.`2`.0): muda quando recursos novos são adicionados, sem quebrar nada.
- **PATCH** (19.0.`3`): muda em correções de bug, sem recursos novos.

Esse contrato deixa você dizer "aceito atualizações seguras, mas não as que quebram". É aí que entram os **ranges**:

- `^19.0.0` (caret): aceita qualquer MINOR/PATCH dentro da major `19` — `19.0.1`, `19.4.0`, mas **não** `20.0.0`. É o padrão.
- `~19.0.0` (til): mais conservador, aceita só PATCH dentro de `19.0` — `19.0.1`, mas não `19.1.0`.
- `19.0.0` (exato): trava nessa versão exata, nada atualiza.

Por isso o `package.json` descreve uma *faixa* de versões aceitáveis, não uma versão única.

## O problema das faixas: lockfiles

Mas espere — se `^19.0.0` aceita `19.0.1` *ou* `19.4.0`, qual delas você realmente instalou? Se um colega instalar amanhã, ele pode pegar uma versão mais nova e ter um comportamento diferente do seu. Isso é o pesadelo do "na minha máquina funciona".

A solução é o **lockfile**. Além do `package.json` (que diz as *faixas*), o gerenciador gera um arquivo de trava — `package-lock.json` (npm), `yarn.lock` (yarn) ou `pnpm-lock.yaml` (pnpm) — que registra a **versão exata** de cada pacote (e de cada dependência transitiva) que foi de fato instalada.

```text
package.json   →  "aceito react ^19.0.0"        (a intenção, a faixa)
lockfile       →  "instalei react 19.4.0 exato"  (o fato, a versão travada)
```

O lockfile **vai para o Git**. Com ele, toda a equipe e o servidor de CI instalam *exatamente* as mesmas versões, tornando o build **determinístico**. Nunca delete um lockfile achando que é lixo — ele é a garantia de reprodutibilidade.

## Atalhos de automação: `scripts`

Por fim, o bloco `scripts` do `package.json` define comandos nomeados:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "test": "vitest"
}
```

Em vez de digitar o comando longo, você roda `npm run dev` (ou `pnpm dev`). Scripts são o ponto de entrada padronizado de um projeto: qualquer pessoa que clone o repositório descobre como rodá-lo só de ler essa seção. Amanhã vamos explorar a fundo como usá-los com o npm.

> **Resumo:** Um gerenciador de pacotes baixa, instala e versiona o código de terceiros do qual seu projeto depende. O `package.json` é o **manifesto**: lista `dependencies` (precisam existir em produção) e `devDependencies` (só ferramentas de desenvolvimento), além dos `scripts`. As dependências são baixadas de um **registry** (o npm registry, comum a npm/yarn/pnpm) e materializadas na pasta **`node_modules`**, que é enorme e nunca vai para o Git. Versões seguem o **semver** (`MAJOR.MINOR.PATCH`), e ranges como `^` (atualiza MINOR/PATCH) e `~` (só PATCH) definem o que pode atualizar. Como uma faixa aceita várias versões, o **lockfile** trava a versão exata instalada e **vai para o Git**, garantindo que toda a equipe e o CI tenham instalações **determinísticas** — o fim do "na minha máquina funciona".
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
      "question": "Qual a função do arquivo `package.json` em um projeto JavaScript?",
      "options": [
        "Armazena o código compilado pronto para produção",
        "É o manifesto do projeto: declara metadados, a lista de dependências e os scripts",
        "Guarda as versões exatas instaladas de cada pacote",
        "Contém o código baixado das dependências de terceiros"
      ],
      "correctAnswer": 1,
      "explanation": "O `package.json` é o manifesto do projeto. Ele descreve nome, versão, as faixas de dependências (`dependencies` e `devDependencies`) e os `scripts`. Quem guarda as versões exatas instaladas é o lockfile; quem guarda o código baixado é a pasta `node_modules`."
    },
    {
      "id": "q2",
      "type": "multiple-choice",
      "question": "Qual a diferença entre `dependencies` e `devDependencies`?",
      "options": [
        "`dependencies` são pacotes oficiais e `devDependencies` são de terceiros",
        "`dependencies` precisam existir para o app rodar em produção; `devDependencies` são ferramentas usadas só no desenvolvimento",
        "`dependencies` vão para o Git e `devDependencies` não",
        "Não há diferença prática, é só organização visual"
      ],
      "correctAnswer": 1,
      "explanation": "`dependencies` são os pacotes que o app precisa para funcionar em produção (ex.: React). `devDependencies` são ferramentas usadas apenas durante o desenvolvimento (bundler, linter, testes, tipos). Classificar errado não quebra nada localmente, mas infla o que é publicado e confunde quem lê o manifesto."
    },
    {
      "id": "q3",
      "type": "true-false",
      "question": "A pasta `node_modules` deve ser versionada no Git para garantir que todos tenham os mesmos pacotes.",
      "options": ["Verdadeiro", "Falso"],
      "correctAnswer": 1,
      "explanation": "Falso. `node_modules` sempre fica no `.gitignore`. Ela é descartável e pode ser recriada a qualquer momento a partir do `package.json` e do lockfile. Quem garante versões idênticas para todos é o lockfile (que vai para o Git), não a pasta `node_modules` (que tem gigabytes de código de terceiros)."
    },
    {
      "id": "q4",
      "type": "multiple-choice",
      "question": "Na versão `19.4.2` (semver), o que representa o número `4`?",
      "options": [
        "MAJOR — pode haver quebra de compatibilidade",
        "MINOR — recursos novos foram adicionados sem quebrar nada",
        "PATCH — apenas correções de bug",
        "O número de dependências do pacote"
      ],
      "correctAnswer": 1,
      "explanation": "Em semver `MAJOR.MINOR.PATCH`, o `19` é MAJOR (quebras de compatibilidade), o `4` é MINOR (recursos novos compatíveis) e o `2` é PATCH (correções de bug). Esse contrato permite que ranges aceitem atualizações seguras e barrem as que podem quebrar."
    },
    {
      "id": "q5",
      "type": "multiple-choice",
      "question": "O que o range `^19.0.0` permite instalar?",
      "options": [
        "Apenas a versão exata 19.0.0",
        "Qualquer versão a partir de 19.0.0, incluindo 20.0.0",
        "Qualquer MINOR/PATCH dentro da major 19 (ex.: 19.4.0), mas não 20.0.0",
        "Apenas correções de PATCH, como 19.0.1"
      ],
      "correctAnswer": 2,
      "explanation": "O caret `^` aceita atualizações de MINOR e PATCH dentro da mesma MAJOR. `^19.0.0` permite `19.0.1`, `19.4.0`, etc., mas não `20.0.0` (que seria uma major nova, com possíveis quebras). O til `~` é mais restrito (só PATCH), e uma versão sem prefixo trava exatamente naquele número."
    },
    {
      "id": "q6",
      "type": "multiple-choice",
      "question": "Por que existe um lockfile (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) além do `package.json`?",
      "options": [
        "Para acelerar a abertura do projeto no editor",
        "Porque o `package.json` define faixas de versão; o lockfile trava a versão exata instalada, tornando o build determinístico",
        "Para guardar as senhas de acesso ao registry",
        "Para substituir o `package.json` em produção"
      ],
      "correctAnswer": 1,
      "explanation": "O `package.json` declara faixas (ex.: `^19.0.0`), que aceitam várias versões. O lockfile registra a versão exata de cada pacote (e de cada dependência transitiva) que foi de fato instalada. Como ele vai para o Git, toda a equipe e o CI instalam exatamente o mesmo, eliminando o 'na minha máquina funciona'."
    },
    {
      "id": "q7",
      "type": "true-false",
      "question": "npm, yarn e pnpm baixam pacotes do mesmo registry (o npm registry).",
      "options": ["Verdadeiro", "Falso"],
      "correctAnswer": 0,
      "explanation": "Verdadeiro. Os três gerenciadores usam, por padrão, o mesmo npm registry (`registry.npmjs.org`). Eles são ferramentas diferentes para instalar os mesmos pacotes — por isso é possível trocar de gerenciador sem trocar de ecossistema."
    }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/content/package-managers/day-01-o-que-e
git commit -m "feat(package-managers): conteúdo do dia 1 (introdução)"
```

---

### Task 3: Conteúdo do Dia 2 — npm na Prática

**Files:**
- Create: `apps/web/src/content/package-managers/day-02-npm-na-pratica/metadata.json`
- Create: `apps/web/src/content/package-managers/day-02-npm-na-pratica/theory.mdx`
- Create: `apps/web/src/content/package-managers/day-02-npm-na-pratica/quiz.json`

- [ ] **Step 1: Criar `metadata.json`**

```json
{
  "id": "day-02",
  "day": 2,
  "week": 1,
  "title": "npm na Prática",
  "slug": "npm-na-pratica",
  "topics": [
    "npm install, ci e uninstall",
    "install vs ci",
    "package-lock.json",
    "scripts e npx",
    "npm audit",
    "intro a workspaces"
  ],
  "difficulty": "foundational",
  "estimatedMinutes": 45,
  "prerequisites": ["day-01"],
  "hasVisualizer": false,
  "hasChallenge": false,
  "xpReward": 100
}
```

- [ ] **Step 2: Criar `theory.mdx`**

````mdx
# npm na Prática

O **npm** (Node Package Manager) é o gerenciador que já vem instalado junto com o Node.js. É o ponto de partida de todo mundo: por estar embutido, é o denominador comum do ecossistema. Ontem entendemos *o que* um gerenciador gerencia; hoje vamos colocar a mão na massa com os comandos que você vai usar todos os dias. Tudo aqui tem equivalente direto no yarn e no pnpm — domine no npm e você domina os três.

## Instalando dependências

O comando central é o `install` (ou seu apelido `i`):

```bash
npm install              # instala tudo que está no package.json
npm install react        # adiciona react às dependencies
npm install -D vite      # adiciona vite às devDependencies (-D = --save-dev)
npm install react@18     # instala uma versão/faixa específica
```

Quando você instala um pacote novo, o npm faz três coisas de uma vez: baixa o pacote (e suas dependências) para `node_modules`, adiciona a linha correspondente no `package.json`, e atualiza o `package-lock.json` com as versões exatas. Por isso você quase nunca edita o `package.json` na mão.

Para remover:

```bash
npm uninstall react      # remove o pacote e atualiza package.json + lockfile
```

## `install` vs `ci`: o comando que você vai esquecer (e não devia)

Existe um segundo comando de instalação, o `npm ci` (de *clean install*), feito para **ambientes automatizados** (CI/CD, Docker). A diferença é crucial:

| | `npm install` | `npm ci` |
|---|---|---|
| Fonte da verdade | `package.json` (pode atualizar o lockfile) | o **lockfile** (obedece exatamente) |
| Se lockfile e package.json divergem | ajusta o lockfile | **falha** com erro |
| `node_modules` existente | reaproveita | apaga e reinstala do zero |
| Velocidade | mais lento | mais rápido e reprodutível |

Regra mental: **na sua máquina, durante o desenvolvimento, use `npm install`** (você quer adicionar/atualizar pacotes). **No CI e em builds de produção, use `npm ci`** (você quer uma instalação idêntica ao lockfile, sem surpresas). Um `npm ci` que falha geralmente significa que alguém esqueceu de commitar o lockfile atualizado — e isso é um recurso, não um bug.

## Rodando scripts

Os scripts do `package.json` são executados com `npm run`:

```bash
npm run dev        # roda o script "dev"
npm run build      # roda o script "build"
```

Alguns nomes são especiais e dispensam o `run`: `npm test`, `npm start`. Para todo o resto, o `run` é obrigatório. Você também pode encadear scripts chamando um dentro do outro:

```json
"scripts": {
  "build": "vite build",
  "deploy": "npm run build && wrangler deploy"
}
```

Scripts são a interface padronizada do projeto: em vez de documentar "rode `vite build --mode production`", você expõe um `npm run build` e esconde a complexidade.

## `npx`: executar sem instalar

E quando você quer rodar uma ferramenta **uma única vez**, sem adicioná-la ao projeto? Para isso existe o **`npx`** (vem junto com o npm):

```bash
npx create-vite meu-app    # baixa, executa e descarta o create-vite
```

O `npx` baixa o pacote temporariamente, executa o binário e não deixa rastro no `package.json`. É perfeito para *scaffolding* (criar projetos), rodar uma migração pontual, ou testar uma CLI sem poluir suas dependências. Se o pacote já estiver instalado no projeto, o `npx` usa a versão local.

## Segurança: `npm audit`

Como você depende de código de terceiros, vulnerabilidades nesses pacotes viram suas vulnerabilidades. O npm checa isso automaticamente e você pode auditar a qualquer momento:

```bash
npm audit          # lista vulnerabilidades conhecidas nas suas dependências
npm audit fix      # tenta atualizar para versões corrigidas automaticamente
```

O `audit` compara sua árvore de dependências com um banco de vulnerabilidades conhecidas. Nem todo aviso é urgente (uma falha numa devDependency de testes raramente expõe seu app), mas é um hábito saudável rodar antes de publicar.

## Um gosto de workspaces

Por fim, um conceito que vamos aprofundar amanhã: **workspaces**. Imagine um repositório que contém vários pacotes relacionados — um app web, uma biblioteca de UI compartilhada, um servidor. Em vez de três repositórios separados, você os mantém num só (um **monorepo**), e os workspaces permitem que eles compartilhem dependências e se referenciem entre si.

```json
{
  "name": "meu-monorepo",
  "workspaces": ["apps/*", "packages/*"]
}
```

Com isso, um `npm install` na raiz instala as dependências de todos os pacotes de uma vez, e um pacote pode importar o outro como se fosse uma dependência publicada. É exatamente assim que este React Academy é organizado (`apps/web` consome `@academy/ui`). Amanhã veremos por que, em monorepos, a escolha do gerenciador faz uma diferença enorme.

> **Resumo:** O **npm** já vem com o Node e é o gerenciador-base do ecossistema. `npm install` baixa pacotes, atualiza o `package.json` e o lockfile de uma vez (`-D` para devDependencies); `npm uninstall` remove. A distinção-chave é **`install` vs `ci`**: no desenvolvimento use `install` (pode atualizar o lockfile); no **CI/produção** use `ci`, que obedece exatamente ao lockfile, reinstala do zero e **falha** se houver divergência — garantindo reprodutibilidade. Scripts rodam com `npm run <nome>` (com atalhos `test`/`start`) e podem ser encadeados com `&&`. O **`npx`** executa uma ferramenta sem instalá-la (ideal para scaffolding). `npm audit` verifica vulnerabilidades nas dependências. E **workspaces** permitem gerenciar um monorepo (vários pacotes num repositório) com uma instalação única — a base da comparação de amanhã.
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
      "question": "O que `npm install -D vite` faz?",
      "options": [
        "Instala o vite globalmente na máquina",
        "Adiciona o vite às `devDependencies` do projeto",
        "Remove o vite das dependências",
        "Instala o vite apenas para produção"
      ],
      "correctAnswer": 1,
      "explanation": "A flag `-D` (apelido de `--save-dev`) adiciona o pacote às `devDependencies` — ferramentas usadas só no desenvolvimento, como o bundler. Sem a flag, ele iria para `dependencies`. O comando também baixa o pacote para `node_modules` e atualiza o lockfile."
    },
    {
      "id": "q2",
      "type": "multiple-choice",
      "question": "Em qual situação você deve preferir `npm ci` em vez de `npm install`?",
      "options": [
        "Ao adicionar um pacote novo ao projeto na sua máquina",
        "Em ambientes de CI/CD e builds de produção, para uma instalação idêntica ao lockfile",
        "Sempre que quiser atualizar as dependências para versões mais novas",
        "Apenas quando o `node_modules` ainda não existe"
      ],
      "correctAnswer": 1,
      "explanation": "`npm ci` (clean install) é feito para automação: ele obedece exatamente ao lockfile, apaga e reinstala o `node_modules` do zero, e falha se o lockfile divergir do `package.json`. Isso o torna mais rápido e reprodutível para CI/produção. No desenvolvimento, quando você quer adicionar ou atualizar pacotes, use `npm install`."
    },
    {
      "id": "q3",
      "type": "true-false",
      "question": "Se o `package.json` e o lockfile estiverem divergentes, `npm ci` tenta corrigir o lockfile automaticamente.",
      "options": ["Verdadeiro", "Falso"],
      "correctAnswer": 1,
      "explanation": "Falso. Diferente do `npm install` (que ajusta o lockfile), o `npm ci` **falha** com erro quando há divergência. Isso é proposital: uma falha de `ci` normalmente indica que alguém esqueceu de commitar o lockfile atualizado, e travar o build é mais seguro do que instalar versões inesperadas."
    },
    {
      "id": "q4",
      "type": "multiple-choice",
      "question": "Como você roda um script chamado `build` definido no `package.json`?",
      "options": [
        "`npm build`",
        "`npm run build`",
        "`npm exec build`",
        "`node build`"
      ],
      "correctAnswer": 1,
      "explanation": "Scripts customizados são executados com `npm run <nome>`, portanto `npm run build`. Apenas alguns nomes especiais (como `test` e `start`) podem ser chamados sem o `run`. Para todo o resto, o `run` é obrigatório."
    },
    {
      "id": "q5",
      "type": "multiple-choice",
      "question": "Qual a principal vantagem do `npx`?",
      "options": [
        "Instala pacotes mais rápido que o `npm install`",
        "Executa uma ferramenta sem adicioná-la permanentemente às dependências do projeto",
        "Atualiza todas as dependências de uma vez",
        "Roda os testes do projeto"
      ],
      "correctAnswer": 1,
      "explanation": "O `npx` baixa um pacote temporariamente, executa seu binário e não deixa rastro no `package.json`. É ideal para scaffolding (`npx create-vite`), tarefas pontuais ou testar uma CLI sem poluir as dependências. Se o pacote já estiver instalado localmente, o `npx` usa a versão do projeto."
    },
    {
      "id": "q6",
      "type": "multiple-choice",
      "question": "O que são workspaces no contexto de um gerenciador de pacotes?",
      "options": [
        "Uma área de trabalho do editor de código",
        "Um recurso que permite gerenciar vários pacotes de um monorepo com uma instalação única, referenciando-se entre si",
        "Um servidor remoto onde os pacotes são publicados",
        "Uma forma de isolar variáveis de ambiente"
      ],
      "correctAnswer": 1,
      "explanation": "Workspaces permitem manter vários pacotes relacionados (ex.: um app e uma lib de UI) em um único repositório — um monorepo. Um install na raiz instala as dependências de todos, e um pacote pode importar o outro como se fosse publicado. É assim que este projeto organiza `apps/web` e `@academy/ui`."
    }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/content/package-managers/day-02-npm-na-pratica
git commit -m "feat(package-managers): conteúdo do dia 2 (npm na prática)"
```

---

### Task 4: Conteúdo do Dia 3 — npm vs yarn vs pnpm

**Files:**
- Create: `apps/web/src/content/package-managers/day-03-npm-yarn-pnpm/metadata.json`
- Create: `apps/web/src/content/package-managers/day-03-npm-yarn-pnpm/theory.mdx`
- Create: `apps/web/src/content/package-managers/day-03-npm-yarn-pnpm/quiz.json`

- [ ] **Step 1: Criar `metadata.json`**

```json
{
  "id": "day-03",
  "day": 3,
  "week": 1,
  "title": "npm vs yarn vs pnpm",
  "slug": "npm-yarn-pnpm",
  "topics": [
    "história: por que yarn e pnpm surgiram",
    "node_modules flat e phantom dependencies",
    "o content-addressable store do pnpm",
    "symlinks e estritude",
    "workspaces e monorepos",
    "qual escolher"
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
# npm vs yarn vs pnpm

Os três gerenciadores baixam dos mesmos pacotes, do mesmo registry, e usam o mesmo `package.json`. Então por que existem três? Porque cada um nasceu para resolver um problema do anterior. Entender essa história não é trivia — ela explica *por que* o pnpm, o mais novo, é mais rápido e mais correto, e ajuda você a escolher com critério em vez de copiar o que viu num tutorial.

## Uma breve história

**npm** é o original, embutido no Node desde sempre. Nos seus primeiros anos, porém, tinha duas dores: instalações **lentas** e **não-determinísticas** (antes dos lockfiles, dois `npm install` podiam gerar `node_modules` diferentes).

**yarn** surgiu em 2016 (criado no Facebook) justamente para resolver isso: trouxe lockfile por padrão, instalação paralela (mais rápida) e cache offline. Foi tão influente que o próprio npm copiou as boas ideias — hoje, npm e yarn (clássico) são bastante parecidos em comportamento.

**pnpm** ("performant npm") atacou um problema mais profundo, que npm e yarn **compartilham** até hoje: o jeito como o `node_modules` é montado. Para entender o pnpm, precisamos ver esse problema.

## O `node_modules` "flat" e as phantom dependencies

npm e yarn montam um `node_modules` **achatado** (*flat*). Se seu app depende de `A`, e `A` depende de `B`, ambos `A` e `B` acabam no **mesmo nível** na raiz do `node_modules`:

```text
node_modules/
├── A/
└── B/        ← subiu para o topo, mesmo você nunca tendo pedido B
```

Esse achatamento foi uma solução para evitar duplicação e caminhos profundos. Mas ele cria um efeito colateral perigoso: como `B` está fisicamente acessível na raiz, seu código consegue fazer `import 'B'` **mesmo sem `B` estar no seu `package.json`**. Funciona na sua máquina... até o dia em que `A` atualiza, para de depender de `B`, e o `import 'B'` quebra do nada.

Isso se chama **phantom dependency** (dependência fantasma): você usa um pacote que nunca declarou, só porque ele "vazou" para a raiz como dependência de outra coisa. npm e yarn não te protegem disso.

## A solução do pnpm: store global + symlinks

O **pnpm** resolve os dois problemas (espaço em disco e phantom dependencies) com uma arquitetura diferente.

**1. Um content-addressable store global.** Em vez de copiar os pacotes para dentro de cada projeto, o pnpm guarda **uma única cópia** de cada versão de cada pacote num armazém global na sua máquina (normalmente `~/.pnpm-store`). O `node_modules` de cada projeto não contém os arquivos de verdade — contém **hard links** que apontam para esse armazém.

A consequência é enorme: se você tem 10 projetos usando `react@19`, npm/yarn baixam e armazenam o React 10 vezes; o pnpm o guarda **uma vez** e linka. Isso economiza gigabytes de disco e torna as instalações muito mais rápidas (nada para baixar se a versão já está no store).

**2. Um `node_modules` não-flat, com symlinks.** O pnpm monta o `node_modules` de forma que **só as dependências que você declarou** ficam acessíveis no topo. As dependências transitivas (como o `B` do exemplo) ficam num diretório interno (`.pnpm`) e são ligadas por symlinks apenas para quem realmente precisa delas.

```text
node_modules/
├── A → (symlink) .pnpm/A@1.0.0/node_modules/A
└── .pnpm/
    ├── A@1.0.0/  (A enxerga B aqui dentro)
    └── B@2.0.0/
            ↑ B NÃO está acessível na raiz; seu app não consegue importá-lo
```

Resultado: se você tentar `import 'B'` sem declarar `B`, **dá erro na hora** — o pnpm é **estrito**. Isso transforma a phantom dependency de um bug silencioso de produção num erro imediato de desenvolvimento. É mais chato no começo e muito mais seguro no fim.

## Workspaces e monorepos

Os três suportam workspaces, mas é em **monorepos** que a diferença de arquitetura mais pesa. Num repositório com 20 pacotes que compartilham dependências, o store global + links do pnpm evita multiplicar gigabytes por pacote, e a estritude evita que um pacote use por acaso uma dependência de outro. Por isso o pnpm virou o padrão de fato em monorepos grandes — e é exatamente o que este **React Academy** usa:

```json
{
  "scripts": {
    "dev": "pnpm --filter @academy/web dev"
  }
}
```

O `--filter` roda um script num pacote específico do workspace — uma ergonomia que o pnpm oferece de forma limpa.

## Então, qual usar?

A comparação, de forma honesta:

| | npm | yarn (clássico) | pnpm |
|---|---|---|---|
| Vem com o Node | ✅ | ❌ | ❌ |
| Velocidade | ok | boa | **excelente** |
| Uso de disco | alto | alto | **baixo** (store global) |
| Phantom deps | permite | permite | **bloqueia** (estrito) |
| Monorepos | ok | bom | **excelente** |

**A recomendação:** para projetos novos, especialmente monorepos, **prefira o pnpm** — ele é mais rápido, economiza disco e te protege de phantom dependencies, sem custo real. Use **npm** quando quiser zero fricção e o denominador comum universal (ele já está lá, todo tutorial assume ele). Encontre **yarn** principalmente em projetos legados ou times que já o adotaram — não há razão forte para migrar *para* o yarn clássico hoje, mas também não há urgência em sair dele.

O mais importante: **escolha um por projeto e comite o lockfile correspondente**. Misturar gerenciadores no mesmo repositório (um `package-lock.json` e um `pnpm-lock.yaml` convivendo) é fonte garantida de confusão. A consistência vale mais do que a ferramenta "perfeita".

> **Resumo:** Os três gerenciadores usam o mesmo registry e `package.json`, mas resolvem problemas de gerações diferentes. O **npm** é o original (embutido no Node); o **yarn** (2016) trouxe lockfile, paralelismo e cache — ideias que o npm depois copiou. O **pnpm** ataca um problema que npm e yarn ainda têm: o `node_modules` **flat**, que deixa dependências transitivas acessíveis na raiz e permite **phantom dependencies** (importar pacotes nunca declarados, que quebram quando a dependência intermediária some). O pnpm resolve com um **content-addressable store global** (uma cópia de cada pacote, ligada por hard links — economiza disco e acelera) e um `node_modules` **não-flat com symlinks**, que é **estrito**: importar algo não declarado dá erro imediato. Por isso o pnpm brilha em **monorepos** e é o que este projeto usa. Recomendação: **pnpm** para projetos novos, **npm** pelo alcance universal, **yarn** sobretudo em legado — e, acima de tudo, **um gerenciador por projeto** com seu lockfile commitado.
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
      "question": "Por que o yarn foi criado em 2016?",
      "options": [
        "Para usar um registry diferente do npm",
        "Para resolver dores do npm da época: instalações lentas e não-determinísticas, trazendo lockfile, paralelismo e cache",
        "Para substituir o Node.js",
        "Porque o npm parou de ser mantido"
      ],
      "correctAnswer": 1,
      "explanation": "O yarn surgiu para resolver problemas do npm da época: instalações lentas e não-determinísticas (antes dos lockfiles). Trouxe lockfile por padrão, instalação paralela e cache offline — ideias tão boas que o próprio npm acabou as adotando. Ele usa o mesmo registry do npm."
    },
    {
      "id": "q2",
      "type": "multiple-choice",
      "question": "O que é uma 'phantom dependency'?",
      "options": [
        "Um pacote que foi removido mas continua no lockfile",
        "Importar e usar um pacote que você nunca declarou no `package.json`, acessível só porque vazou para a raiz do node_modules flat",
        "Uma dependência que só existe em produção",
        "Um pacote com vulnerabilidade de segurança"
      ],
      "correctAnswer": 1,
      "explanation": "No `node_modules` flat do npm/yarn, dependências transitivas sobem para a raiz e ficam fisicamente acessíveis. Isso permite importar um pacote que você nunca declarou — uma phantom dependency. Funciona até a dependência intermediária parar de depender dele, e o import quebra sem aviso."
    },
    {
      "id": "q3",
      "type": "multiple-choice",
      "question": "Como o pnpm economiza espaço em disco em relação ao npm/yarn?",
      "options": [
        "Compactando o node_modules em um arquivo zip",
        "Removendo as devDependencies após o build",
        "Guardando uma única cópia de cada versão de pacote num store global e ligando por hard links em cada projeto",
        "Baixando apenas metade dos arquivos de cada pacote"
      ],
      "correctAnswer": 2,
      "explanation": "O pnpm usa um content-addressable store global (ex.: `~/.pnpm-store`): cada versão de cada pacote é guardada uma única vez na máquina, e o `node_modules` de cada projeto contém hard links para o store. Se 10 projetos usam `react@19`, o npm/yarn armazenam 10 cópias; o pnpm guarda uma só."
    },
    {
      "id": "q4",
      "type": "true-false",
      "question": "No pnpm, tentar importar um pacote que não está declarado no `package.json` resulta em erro imediato.",
      "options": ["Verdadeiro", "Falso"],
      "correctAnswer": 0,
      "explanation": "Verdadeiro. O pnpm monta um `node_modules` não-flat: apenas as dependências declaradas ficam acessíveis na raiz, e as transitivas ficam isoladas em `.pnpm`. Por isso ele é estrito — importar algo não declarado falha na hora, transformando uma phantom dependency (bug silencioso) num erro imediato de desenvolvimento."
    },
    {
      "id": "q5",
      "type": "multiple-choice",
      "question": "Para um projeto novo organizado como monorepo, qual gerenciador o conteúdo recomenda e por quê?",
      "options": [
        "npm, porque é o mais antigo",
        "yarn, porque tem o melhor cache",
        "pnpm, por ser rápido, econômico em disco e estrito (evita phantom deps) — vantagens que pesam ainda mais em monorepos",
        "Tanto faz, todos são idênticos em monorepos"
      ],
      "correctAnswer": 2,
      "explanation": "A recomendação é pnpm para projetos novos, especialmente monorepos: o store global evita multiplicar gigabytes por pacote, e a estritude evita que um pacote use por acaso a dependência de outro. É por isso que o pnpm virou padrão de fato em monorepos — e é o que este React Academy usa."
    },
    {
      "id": "q6",
      "type": "true-false",
      "question": "É uma boa prática manter dois lockfiles diferentes (ex.: `package-lock.json` e `pnpm-lock.yaml`) no mesmo repositório para dar flexibilidade.",
      "options": ["Verdadeiro", "Falso"],
      "correctAnswer": 1,
      "explanation": "Falso. Misturar gerenciadores no mesmo projeto é fonte garantida de confusão e instalações inconsistentes. A prática correta é escolher um gerenciador por projeto e commitar apenas o lockfile correspondente. A consistência vale mais do que tentar combinar ferramentas."
    }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/content/package-managers/day-03-npm-yarn-pnpm
git commit -m "feat(package-managers): conteúdo do dia 3 (comparação npm/yarn/pnpm)"
```

---

### Task 5: Registrar o currículo

**Files:**
- Create: `apps/web/src/features/curriculum/data/package-managers-lessons.ts`
- Modify: `apps/web/src/features/curriculum/data/index.ts`

- [ ] **Step 1: Criar `package-managers-lessons.ts`**

Espelha exatamente o padrão de `css-lessons.ts`:

```ts
import type { LessonMetadata } from '@/features/curriculum/types'
import day01 from '@/content/package-managers/day-01-o-que-e/metadata.json'
import day02 from '@/content/package-managers/day-02-npm-na-pratica/metadata.json'
import day03 from '@/content/package-managers/day-03-npm-yarn-pnpm/metadata.json'

export const PACKAGE_MANAGERS_LESSONS: LessonMetadata[] = [
  day01, day02, day03,
].map(l => l as LessonMetadata)

export function getPackageManagersLessonById(id: string): LessonMetadata | undefined {
  return PACKAGE_MANAGERS_LESSONS.find(l => l.id === id)
}

export function getPackageManagersLessonsByWeek(week: number): LessonMetadata[] {
  return PACKAGE_MANAGERS_LESSONS.filter(l => l.week === week)
}
```

- [ ] **Step 2: Registrar em `index.ts`**

Adicione o import junto aos outros (após a linha de `HTML_LESSONS`):

```ts
import { PACKAGE_MANAGERS_LESSONS } from './package-managers-lessons'
```

E adicione a condição dentro de `getLessonsForStack`, antes do `return LESSONS` final:

```ts
  if (stackId === 'package-managers') return PACKAGE_MANAGERS_LESSONS
```

- [ ] **Step 3: Verificar typecheck**

Run: `pnpm --filter @academy/web typecheck`
Expected: PASS. Os imports de JSON resolvem e o tipo `LessonMetadata` casa com os metadados (`difficulty` é `'foundational' | 'intermediate' | 'advanced'`; usamos `foundational`/`intermediate`).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/features/curriculum/data/package-managers-lessons.ts apps/web/src/features/curriculum/data/index.ts
git commit -m "feat(package-managers): registra o currículo dos 3 dias"
```

---

### Task 6: Fiar os loaders de teoria e quiz

**Files:**
- Modify: `apps/web/src/features/lessons/components/TheoryReader.tsx`
- Modify: `apps/web/src/features/lessons/components/QuizRunner.tsx`

- [ ] **Step 1: Adicionar a chave `'package-managers'` ao `MDX_IMPORTS`**

Em `TheoryReader.tsx`, dentro do objeto `MDX_IMPORTS` (um `Record<string, Record<string, ...>>`), adicione uma nova chave de stack ao lado das existentes (ex.: após o bloco `html: { ... }`):

```ts
  'package-managers': {
    'day-01': () => import('@/content/package-managers/day-01-o-que-e/theory.mdx'),
    'day-02': () => import('@/content/package-managers/day-02-npm-na-pratica/theory.mdx'),
    'day-03': () => import('@/content/package-managers/day-03-npm-yarn-pnpm/theory.mdx'),
  },
```

- [ ] **Step 2: Adicionar a chave `'package-managers'` ao `QUIZ_IMPORTS`**

Em `QuizRunner.tsx`, dentro do objeto `QUIZ_IMPORTS`, adicione a mesma estrutura apontando para os `quiz.json`:

```ts
  'package-managers': {
    'day-01': () => import('@/content/package-managers/day-01-o-que-e/quiz.json'),
    'day-02': () => import('@/content/package-managers/day-02-npm-na-pratica/quiz.json'),
    'day-03': () => import('@/content/package-managers/day-03-npm-yarn-pnpm/quiz.json'),
  },
```

- [ ] **Step 3: Verificar typecheck e lint**

Run: `pnpm --filter @academy/web typecheck && pnpm --filter @academy/web lint`
Expected: PASS. Os caminhos de `import()` são estáticos (exigência do Vite) e os arquivos existem (criados nas Tasks 2–4).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/features/lessons/components/TheoryReader.tsx apps/web/src/features/lessons/components/QuizRunner.tsx
git commit -m "feat(package-managers): fia os loaders de teoria e quiz"
```

---

### Task 7: Verificação end-to-end

**Files:** nenhum (verificação manual).

- [ ] **Step 1: Build de tipos e lint do projeto inteiro**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS, sem erros novos.

- [ ] **Step 2: Subir o dev server**

Run: `pnpm dev`
Expected: Vite sobe sem erros de compilação de MDX/JSON.

- [ ] **Step 3: Percorrer o fluxo no navegador**

Verifique, na home:
- O card **"Gerenciador de Pacotes"** aparece na seção **Fundamentos**, entre "TypeScript Essencial" e "Git & Fluxo de Trabalho", com a cor `orange` e badge `available` (clicável).

Clicando no card:
- O dashboard do stack mostra **3 dias**.
- **Dia 1, 2 e 3**: a aba **Teoria** renderiza o MDX completo (título no topo, seções, blocos de código, e o blockquote **`> Resumo:`** ao final, estilizado como citação).
- A aba **Quiz** carrega as questões, permite responder, pontua, e marca o dia como concluído ao passar (`passingScore: 70`).

- [ ] **Step 4: Atualizar a memória do projeto (se aplicável)**

Se o arquivo de memória do projeto rastrear stacks concluídos, anote que o stack `package-managers` (3 dias, fundamentos) foi adicionado e ativado. Caso contrário, pule.

- [ ] **Step 5: Commit final (se houver ajustes da verificação)**

Caso a verificação revele algum ajuste (typo no MDX, opção de quiz trocada), corrija e:

```bash
git add -A
git commit -m "fix(package-managers): ajustes da verificação end-to-end"
```

---

## Notas de execução

- **Ordem importa:** Tasks 2–4 (conteúdo) **antes** da Task 6 (loaders), porque os `import()` estáticos referenciam arquivos que precisam existir para o typecheck/build passar.
- **Sem lógica nova:** todo o comportamento (progresso, XP, navegação de steps, render de MDX, motor de quiz) já existe e é dirigido por dados. Este plano só adiciona dados e três entradas de wiring.
- **Voz do conteúdo:** mantenha o tom dos stacks de HTML/CSS — direto, "você", negrito em termos-chave, exemplos curtos. Não traduza termos técnicos consagrados (lockfile, registry, workspace, monorepo, phantom dependency).
