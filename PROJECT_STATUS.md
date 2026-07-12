# Motor de Conteúdo Stage — Project Status

> Documento vivo. Atualizar a cada release.

---

## Versão

**v1.0.0** — Julho 2026
Build limpo. TypeScript sem erros. 119 arquivos de código.

---

## Arquitetura

### Princípio central

```
Prompt = motor
DNA = configuração
```

O mesmo conjunto de prompts (P1–P4) atende qualquer cliente.
O comportamento muda exclusivamente pelo DNA do cliente.
Esse conceito foi validado e está congelado.

### Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Roteamento | React Router v6 |
| Estado servidor | TanStack Query v5 |
| Formulários | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| IA | Claude API (claude-sonnet-4-6) via Edge Function |
| Deploy | GitHub Pages (dev) → Vercel (produção) |

### Organização de pastas

```
src/
  app/              → providers, router, layout, query-client
  features/
    clients/        → CRUD de clientes
    dna/            → editor de DNA do cliente
    posts/          → geração e listagem de posts
    derivacoes/     → adaptações de formato (reels, story, linkedin, facebook)
    planejamento/   → geração de lotes de pautas
    calendario/     → visão editorial por data
  shared/
    components/     → Button, Dialog, EmptyState, Toast, MutationError,
                      CopyButton, ClientSelector, ClientContextHeader
    hooks/          → useToast, useUnsavedChanges, useClientParam
    lib/            → supabase client, env validation, edge-function helpers
```

Cada feature segue o mesmo padrão interno:

```
feature/
  api/        → repository (Supabase) + generate service (Edge Function)
  hooks/      → TanStack Query (useQuery + useMutation)
  components/ → componentes da feature
  types/      → interfaces, Zod schemas
  pages/      → página principal
```

### Fluxo de chamadas

```
page → hook → repository → supabase
page → hook → service → supabase.functions.invoke → Edge Function → Claude API
```

Nenhuma página acessa o Supabase diretamente.

### Banco de dados (5 tabelas)

| Tabela | Propósito |
|---|---|
| `clients` | Identidade do cliente (nome, segmento, redes) |
| `client_dna` | DNA do cliente — configuração completa da IA (1:1 com client) |
| `pautas` | Pautas geradas pelo P1, agrupadas por `batch_id` |
| `posts` | Posts gerados pelo P2, com status editorial |
| `post_derivacoes` | Derivações geradas pelo P3 (reels, story, linkedin, facebook) |

---

## Features

| Feature | Rota | Descrição |
|---|---|---|
| Clientes | `/clientes` | Cadastro e gestão de clientes |
| DNA | `/dna?clientId=` | Editor completo do DNA do cliente |
| Planejamento | `/planejamento?clientId=` | Geração de lotes de pautas via P1 |
| Posts | `/posts?clientId=` | Geração de posts via P2 |
| Derivações | `/derivacoes?clientId=` | Adaptação de posts via P3 |
| Calendário | `/calendario?clientId=` | Visão editorial por data e status |

### Componentes compartilhados disponíveis

- `<Button>` — 5 variantes: primary, success, danger, neutral, ghost
- `<Dialog>` — modal com Escape e click-fora
- `<EmptyState>` — estado vazio com ação opcional
- `<Toast>` + `useToast` — feedback temporário (3s)
- `<MutationError>` — erro de mutation consistente
- `<CopyButton>` — copiar para clipboard com feedback
- `<ClientSelector>` — dropdown de clientes
- `<ClientContextHeader>` — header com links rápidos entre features
- `useUnsavedChanges` — aviso de alterações não salvas (beforeunload + router blocker)
- `useClientParam` — sincroniza clientId com a URL

---

## Fluxo completo do produto

```
Clientes
  └─ criar / editar cliente
       └─ DNA
            └─ configurar tom, pilares, estilo, exemplos, regras
                 └─ Planejamento
                      └─ gerar lote de pautas (P1)
                           └─ revisar / aprovar / rejeitar pautas
                                └─ Posts
                                     └─ gerar post a partir de pauta (P2)
                                          └─ copiar legenda / hashtags / texto
                                               └─ Derivações
                                                    └─ adaptar para reels/story/linkedin/facebook (P3)
                                                         └─ Calendário
                                                              └─ agendar por data e status
```

---

## Prompts congelados

> ⚠️ Não alterar. Ajustes de comportamento = editar o DNA do cliente.

| Prompt | Função | Output |
|---|---|---|
| P1 | Gerar lote de pautas | Array JSON de pautas |
| P2 | Gerar post completo | JSON com legenda, CTA, hashtags, checklist |
| P3 | Derivar post para outro formato | Texto estruturado (roteiro, story, etc.) |
| P4 | Ajustar conteúdo com instrução | Texto revisado |

P4 está implementado na Edge Function mas ainda não exposto na UI.
A Edge Function é chamada via `supabase.functions.invoke("generate")`.

---

## Decisões congeladas

Estas decisões foram tomadas, validadas e não devem ser reabertas sem motivo forte:

- **Prompt = motor, DNA = configuração.** Um prompt serve qualquer cliente. Comportamento muda pelo DNA.
- **Supabase como backend.** PostgreSQL + Edge Functions + Auth (futuro).
- **Claude Sonnet 4.6 como modelo.** Melhor custo-benefício para geração de texto.
- **Feature-first folder structure.** `features/clients/`, não `pages/` + `components/` separados.
- **Repository pattern.** Nenhuma page acessa o Supabase diretamente.
- **TanStack Query para estado servidor.** Sem redux, sem zustand.
- **URL como fonte de verdade para clientId.** `?clientId=xxx` em todas as rotas de conteúdo.
- **buildClientPayload / buildDnaPayload em shared/lib.** Zero duplicação entre generate services.

---

## Dívidas técnicas

Registradas conscientemente. Não são bugs, são decisões da Fase 0.

| # | Dívida | Impacto | Quando resolver |
|---|---|---|---|
| T1 | Sem autenticação — qualquer pessoa com a URL acessa | Alto | Release 1.2 ou antes do SaaS |
| T2 | Edge Function com `--no-verify-jwt` | Alto | Junto com auth |
| T3 | Sem `user_id` nas tabelas — single-user | Alto | Antes do multi-tenant |
| T4 | Sem rate limiting na Edge Function | Médio | Antes de abrir para outros usuários |
| T5 | Bundle único sem code splitting (>500KB) | Baixo | v1.1 |
| T6 | P4 (ajuste com IA) implementado na Edge Function, não exposto na UI | Baixo | v1.1 |
| T7 | Sem testes automatizados | Médio | v1.2 |
| T8 | `dbToForm`/`formToDb` no DNA repository acopla formato de UI ao repository | Baixo | v1.2 |
| T9 | `crypto.randomUUID()` sem polyfill (quebra em browsers muito antigos) | Baixo | Ignorar |

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Chave da [Anthropic Console](https://console.anthropic.com)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Editar `.env`:

```
VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 3. Banco de dados

No Dashboard do Supabase → SQL Editor → New Query:
- Cole o conteúdo de `supabase-schema.sql`
- Clique em Run

### 4. Edge Function

```bash
npm install -g supabase
supabase login
supabase link --project-ref SEU_PROJECT_REF
supabase secrets set CLAUDE_API_KEY=sk-ant-SUA_CHAVE
supabase functions deploy generate --no-verify-jwt
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## Como fazer deploy (Release 1.0)

> Deploy é uma consequência. A Release engloba QA, documentação, versionamento, ambiente e validação.

Ver checklist completo na seção [Checklist Deploy](#checklist-deploy).

### Vercel (produção)

1. Conectar repositório GitHub ao Vercel
2. Framework preset: **Vite**
3. Adicionar variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático a cada push na branch `main`

### GitHub Pages (desenvolvimento)

```bash
npm run build
# copiar dist/ para branch gh-pages ou configurar no vite.config.ts
```

---

## Como adicionar uma feature

Seguir o padrão estabelecido. Sem exceções.

### 1. Types

```
src/features/minha-feature/types/
  minha-entidade.ts       ← interface espelhando a tabela do banco
  minha-entidade-schema.ts ← Zod schema para formulários
  index.ts                ← barrel export
```

### 2. API

```
src/features/minha-feature/api/
  minha-entidade-repository.ts  ← CRUD via supabase (NUNCA chamar supabase fora daqui)
  generate-X-service.ts         ← se houver chamada à Edge Function
  index.ts
```

Se houver geração via IA, usar os helpers existentes:

```ts
import { buildClientPayload, buildDnaPayload } from "@/shared/lib";
```

### 3. Hooks

```
src/features/minha-feature/hooks/
  minha-entidade-keys.ts   ← query keys factory
  use-minha-entidade.ts    ← useQuery
  use-create-X.ts          ← useMutation
  index.ts
```

### 4. Components + Page

- Componentes específicos da feature ficam em `features/minha-feature/components/`
- Componentes reutilizáveis em múltiplas features → promover para `shared/components/`
- A page orquestra hooks e componentes, sem lógica de negócio própria

### 5. Router

Adicionar a rota em `src/app/router.tsx`.

### 6. Sidebar

Adicionar o link em `src/app/layout.tsx`.

### Regras

- A page não chama o Supabase diretamente
- A page não chama a Edge Function diretamente
- Toda leitura/escrita passa por hook → repository
- Toda geração de IA passa por hook → service
- Cada etapa deve compilar e funcionar antes da próxima

---

## Checklist QA

Executar antes de qualquer release.

### Clientes

- [ ] Criar cliente com nome apenas
- [ ] Criar cliente com todos os campos
- [ ] Validação: nome vazio bloqueia submit
- [ ] Editar cliente existente
- [ ] Clicar em DNA → redireciona com `?clientId=`

### DNA

- [ ] Acessar `/dna` sem clientId → empty state com link para Clientes
- [ ] Cliente sem DNA → botão "Criar DNA para este cliente"
- [ ] Cliente com DNA → editor carrega valores do banco
- [ ] Editar campos simples (tom de voz, público, objetivos)
- [ ] Adicionar / remover pilar
- [ ] Peso dos pilares ≠ 100% → aviso amarelo visível
- [ ] Badges de seção atualizam ao preencher campos
- [ ] Salvar → toast "DNA salvo com sucesso"
- [ ] F5 → dados persistidos
- [ ] Sair com form dirty → blocker pergunta antes de navegar

### Posts

- [ ] Cliente sem DNA → mensagem bloqueando geração
- [ ] Preencher pauta e gerar → preview aparece
- [ ] Erro da Edge Function → `MutationError` visível (não silencioso)
- [ ] Copiar campo individual → ícone muda para ✓ por 2s
- [ ] Copiar tudo formatado → clipboard contém bloco limpo
- [ ] Salvar post → toast + post aparece na lista
- [ ] Trocar cliente com preview aberto → confirmação
- [ ] Clicar "Derivar" em post salvo → dialog abre

### Derivações

- [ ] Escolher formato → geração ocorre
- [ ] Preview do conteúdo aparece como texto
- [ ] Copiar derivação → funciona
- [ ] Salvar derivação → aparece em `/derivacoes`
- [ ] Gerar outro → volta para seleção de formato

### Planejamento

- [ ] Gerar lote de pautas
- [ ] Aprovar / rejeitar / editar pauta draft
- [ ] Descartar lote → confirmação antes de apagar
- [ ] Salvar lote → scroll automático para "Planejamentos salvos"
- [ ] Salvar lote → toast de confirmação
- [ ] Aprovar pauta salva → botão "Gerar Post" aparece destacado
- [ ] "Gerar Post" → dialog abre → gera → salva → vai para `/posts`
- [ ] Trocar cliente com draft ativo → confirmação

### Calendário

- [ ] Grid do mês atual aparece corretamente
- [ ] Dia de hoje destacado em verde
- [ ] Post com data aparece na célula correta com título + formato
- [ ] Status distinguível visualmente (accent colorido à esquerda)
- [ ] Clicar em post → dialog de edição
- [ ] Editar data + status → salvar → post move para nova data
- [ ] Painel "Sem data definida" lista posts sem data
- [ ] Pautas aprovadas aparecem no backlog
- [ ] Navegar meses (← →) funciona

### Navegação

- [ ] `ClientContextHeader` aparece após selecionar cliente
- [ ] Links rápidos preservam `?clientId=`
- [ ] Trocar cliente no seletor atualiza URL sem criar histórico desnecessário
- [ ] Recarregar página preserva cliente selecionado

### Estados de erro

- [ ] Supabase sem conexão → mensagem de erro visível
- [ ] Edge Function falhando → `MutationError` com mensagem clara
- [ ] Claude retornando JSON inválido → "resposta em formato inesperado" (não silencioso)
- [ ] Formulário vazio → validação Zod visível

---

## Checklist Deploy (Release 1.0)

### Pré-deploy

- [ ] `npm run build` sem erros
- [ ] `npx tsc --noEmit` sem erros
- [ ] QA manual completo executado
- [ ] Variáveis de ambiente de produção configuradas no Vercel
- [ ] Edge Function deployada no Supabase de produção
- [ ] `CLAUDE_API_KEY` configurada como secret no Supabase
- [ ] Schema rodado no banco de produção
- [ ] Seed do cliente Márcio aplicado (se necessário)
- [ ] `.env` de produção não está commitado no repositório
- [ ] `.gitignore` inclui `.env`

### Deploy

- [ ] Commit e push para `main`
- [ ] Build do Vercel passa sem erros
- [ ] URL de produção acessível

### Pós-deploy

- [ ] Criar cliente de teste na produção
- [ ] Criar DNA do cliente de teste
- [ ] Gerar pauta → aprovar → gerar post → salvar
- [ ] Gerar derivação → salvar
- [ ] Verificar calendário com post agendado
- [ ] Confirmar que Edge Function está respondendo (não timeout)
- [ ] Confirmar que `CLAUDE_API_KEY` está ativa e com créditos

### Backup

- [ ] Export do banco de dados antes do primeiro uso real em produção
- [ ] Guardar `CLAUDE_API_KEY` e `SUPABASE_ANON_KEY` em local seguro fora do código

---

*Última atualização: Julho 2026 — v1.0.0*
