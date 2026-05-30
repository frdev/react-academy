# Regex Essentials — Design Spec

**Date:** 2026-05-30
**Status:** Approved

---

## Context

A [Trilha de Fundamentos](2026-05-30-trilha-fundamentos-design.md) já cobre HTML → CSS → JS → TS → Git → Boas Práticas, e ganhou um cluster de **tooling** com o [Gerenciador de Pacotes](2026-05-30-gerenciador-de-pacotes-design.md). Falta uma habilidade transversal que aparece em validação de formulário, busca/substituição no editor, parsing de logs, roteamento e mil outros lugares: **expressões regulares**. Quase todo dev tropeça em regex sem nunca tê-la aprendido de propósito — copia de Stack Overflow, reza, e segue.

Este spec cria um **novo stack `regex`** (Regex Essentials), posicionado na sessão de **Fundamentos**, no fim do bloco (depois de Boas Práticas & Arquitetura), como um utilitário transversal — não pressupõe nenhuma stack específica além de noções de JavaScript para os exemplos. Como o Gerenciador de Pacotes, é **enxuto: 3 dias**, refletindo o recorte focado (o que é/por quê → prática → boas práticas + cheatsheet).

**Decisões fechadas com o usuário:**
- **3 dias**, não 7 — tema focado; esticar seria encher linguiça. (~40–50 min/dia, ~2–2,5h no total.)
- **Entrega completa + ativar:** escrever os 3 dias e deixar o stack `available` (clicável e funcional) já nesta entrega, não `coming-soon`.
- Os 3 tópicos pedidos — **(1) porquê e para o quê serve, (2) boas práticas + cuidados, (3) cheatsheet com exemplos** — viram o fio condutor: tópico 1 ancora o Dia 1, tópicos 2 e 3 fecham o Dia 3; o Dia 2 é a ponte mecânica (grupos, lookarounds, flags, uso real em JS) que dá lastro ao cheatsheet.
- **Sabor JavaScript:** a sintaxe regex é quase universal, mas os exemplos de execução usam a API de JS (`test`, `match`, `matchAll`, `replace`, named groups) por ser a linguagem da plataforma. Notas pontuais onde outros sabores (PCRE) divergem.
- Sem challenge e sem visualizer (`hasChallenge: false`, `hasVisualizer: false`), consistente com HTML/CSS/Pacotes.
- Conteúdo em **pt-BR**, mesma arquitetura/formato dos demais stacks.
- Cada dia termina com o blockquote padrão `> **Resumo:** …`.

**Escopo deste spec:** o stack inteiro — metadados, currículo dos 3 dias (theory + quiz), registro no currículo e nos loaders, cor nova no `COLOR_MAP`, ícone, e ativação. Vira um único plano de implementação.

---

## Metadados do Stack

Inserido no array `STACKS` em `features/stacks/data/stacks.ts`, **no fim do bloco de Fundamentos** (depois de `frontend-architecture`, antes do primeiro stack `avancado`):

```ts
{
  id: 'regex',
  name: 'Regex Essentials',
  tagline: '3 dias de expressões regulares sem decoreba',
  description: 'Por que regex existe, a sintaxe que importa (classes, quantificadores, âncoras, grupos, lookarounds), uso real em JavaScript e as armadilhas (ReDoS, ganância) — com cheatsheet de referência.',
  totalDays: 3,
  status: 'available',
  level: 'fundamentos',
  color: 'violet',
  weekThemes: ['Padrões & Texto'],
}
```

- **id de conteúdo:** `regex` → URLs `/regex/day/day-0X/theory` e `.../quiz`.
- **color `violet`:** cor nova; precisa ser adicionada ao `COLOR_MAP` em `StackSelectorPage.tsx` (as cores existentes já estão tomadas pelos outros stacks de fundamentos).
- **Dificuldade:** dia 1 `foundational`, dias 2–3 `intermediate`.

---

## Currículo — 3 Dias

> *weekTheme:* `Padrões & Texto` (todos `week: 1`)

| Dia | Título | `slug` | Dificuldade | Tópicos |
|-----|--------|--------|-------------|---------|
| 01 | O que é e por que usar Regex | `o-que-e-por-que` | foundational | o que é uma expressão regular, casos de uso reais (validar/buscar/extrair/substituir), literais × metacaracteres, classes de caracteres `[...]` e `\d \w \s`, quantificadores `* + ? {n,m}`, âncoras `^ $ \b`, ganância × preguiça (`*?`) |
| 02 | Regex na Prática | `regex-na-pratica` | intermediate | grupos de captura `()`, grupos sem captura `(?:)`, named groups `(?<nome>)`, alternância `\|`, backreferences, lookahead/lookbehind `(?=)`/`(?<=)`, flags `g i m s u`, e a API de JS (`test`, `match`, `matchAll`, `replace` com `$1`/função) |
| 03 | Boas Práticas, Armadilhas & Cheatsheet | `boas-praticas-cheatsheet` | intermediate | legibilidade (nomear, comentar, quebrar), quando **não** usar regex (HTML/JSON), escapar input dinâmico, **ReDoS / catastrophic backtracking**, testar (regex101), performance, e o **cheatsheet de referência** completo |

### Detalhamento

**Dia 1 — O que é e por que usar Regex**
O "porquê" antes do "como". Aluno entende que uma regex é um **padrão** que descreve um conjunto de strings, e que serve para quatro tarefas recorrentes: **validar** (isto é um e-mail?), **buscar** (existe a substring?), **extrair** (pega os números) e **substituir** (troca tudo que casa). Daí a sintaxe mínima: a diferença entre **literais** (casam consigo mesmos) e **metacaracteres** (`. * + ? [ ] ( ) ^ $ | \`), **classes de caracteres** (`[aeiou]`, ranges `[a-z]`, negação `[^...]`, atalhos `\d \w \s` e seus negados), **quantificadores** (`*`, `+`, `?`, `{n}`, `{n,m}`), e **âncoras** (`^`, `$`, `\b`). Fecha com a noção crucial de **ganância**: quantificadores são gulosos por padrão e o `?` os torna preguiçosos (`.*?`) — o erro nº 1 de quem começa.

**Dia 2 — Regex na Prática**
Onde regex vira ferramenta de verdade. **Grupos**: `()` captura para reuso/extração, `(?:)` agrupa sem capturar, `(?<ano>\d{4})` nomeia a captura. **Alternância** `|` e como parênteses delimitam seu alcance. **Backreferences** (`\1`, `\k<nome>`) para casar repetição. **Lookarounds** — lookahead `(?=)`/`(?!)` e lookbehind `(?<=)`/`(?<!)` — para condicionar sem consumir. As **flags** (`g`, `i`, `m`, `s`, `u`) e o que cada uma muda. E a **API de JavaScript**: `regex.test(str)` (boolean), `str.match` × `str.matchAll` (com `g`), grupos nomeados em `.groups`, e `str.replace` com `$1`/`$<nome>` ou função de substituição. Exemplos concretos: extrair data, reformatar, mascarar.

**Dia 3 — Boas Práticas, Armadilhas & Cheatsheet**
A maturidade. **Legibilidade**: regex é write-only se você deixar — nomeie a constante, comente o intuito, quebre padrões grandes (flag `x`/verbose onde existe), e prefira código simples quando ele for mais claro. **Quando NÃO usar regex**: parsing de HTML/JSON/linguagens com aninhamento (use um parser), e o clássico aviso. **Segurança**: sempre **escapar input dinâmico** antes de interpolar numa regex, e o perigo do **ReDoS / catastrophic backtracking** (quantificadores aninhados como `(a+)+` em backtracking exponencial) — como reconhecer e evitar. **Testar** com regex101/depurador e cobrir casos de borda. Fecha o stack — e a sessão — com um **cheatsheet de referência** denso: tabelas de metacaracteres, classes, quantificadores, âncoras, grupos, lookarounds e flags, cada um com exemplo.

### Por dia (estrutura de arquivos)
Cada dia gera uma pasta `content/regex/day-0X-<slug>/` com:
- `metadata.json` — conforme `LessonMetadata` (`hasVisualizer: false`, `hasChallenge: false`, `xpReward: 100`, `estimatedMinutes` ~40–50, `week: 1`, `prerequisites` encadeando o dia anterior a partir do dia 2).
- `theory.mdx` — teoria em pt-BR, terminando em `> **Resumo:** …`.
- `quiz.json` — conforme `Quiz` (≈6 questões, `passingScore: 70`), tipos `multiple-choice`/`true-false`.

---

## Arquivos a Tocar

Seguindo exatamente o padrão dos stacks de HTML e Pacotes ("registra currículo, fia loaders e ativa o stack"):

1. **`features/stacks/data/stacks.ts`** — inserir o objeto do stack no fim do bloco de fundamentos (depois de `frontend-architecture`).
2. **`features/stacks/StackSelectorPage.tsx`** — adicionar a cor `violet` ao `COLOR_MAP` e um ícone `regex` (`.*`) ao `STACK_ICONS`.
3. **`content/regex/day-0{1,2,3}-<slug>/`** — 3 pastas × (`metadata.json` + `theory.mdx` + `quiz.json`).
4. **`features/curriculum/data/regex-lessons.ts`** — novo arquivo espelhando `html-lessons.ts`: importa os 3 `metadata.json`, exporta `REGEX_LESSONS: LessonMetadata[]` + helpers `getRegexLessonById` / `...ByWeek`.
5. **`features/curriculum/data/index.ts`** — `import { REGEX_LESSONS }` + `if (stackId === 'regex') return REGEX_LESSONS` em `getLessonsForStack`.
6. **`features/lessons/components/TheoryReader.tsx`** — adicionar a chave `'regex'` no `MDX_IMPORTS` (mapa `dayId → () => import(...theory.mdx)`).
7. **`features/lessons/components/QuizRunner.tsx`** — adicionar a chave `'regex'` no mapa equivalente de quizzes.

Slugs finais: `day-01-o-que-e-por-que`, `day-02-regex-na-pratica`, `day-03-boas-praticas-cheatsheet`.

---

## Critérios de Aceite

- O card "Regex Essentials" aparece na seção **Fundamentos**, no fim do bloco, como `available`, com a cor violet.
- Clicar abre o dashboard do stack com 3 dias.
- Cada dia carrega `theory.mdx` (com `> **Resumo:**` no fim) e um quiz funcional que pontua e permite concluir.
- Progresso/XP funcionam como nos demais stacks (sem código novo de progresso — só registro de dados).
- `pnpm typecheck` e `pnpm lint` passam; nenhum stack existente quebra.
