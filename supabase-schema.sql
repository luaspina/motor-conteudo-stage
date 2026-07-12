-- ============================================================
-- Motor de Conteúdo Stage — Schema v1.0.0
-- Gerado a partir do código-fonte em 03/07/2026.
-- Fonte: types/, repositories/, pages/ e components/.
-- Rodar no SQL Editor do Supabase: Dashboard > SQL Editor > New Query
--
-- ⚠️  ATENÇÃO: este script é destinado a banco VAZIO.
-- Não é idempotente — executar uma segunda vez causará erro em
-- CREATE TABLE, CREATE INDEX, CREATE TRIGGER e CREATE POLICY.
-- Se precisar reexecutar: apague todas as tabelas primeiro ou
-- crie um novo projeto Supabase.
-- ============================================================

-- ============================================================
-- 0. EXTENSÃO
-- Necessária para uuid_generate_v4().
-- Geralmente já ativa no Supabase — o IF NOT EXISTS é seguro.
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. CLIENTS
-- Fonte: src/features/clients/types/client.ts (interface Client)
--        src/features/clients/api/clients-repository.ts
-- ============================================================
create table public.clients (
  -- PK
  id           uuid primary key default uuid_generate_v4(),

  -- Obrigatório (name: string no tipo, NOT NULL no insert)
  name         text not null,

  -- Opcionais (string | null no tipo)
  segment      text,
  instagram    text,
  site         text,
  whatsapp     text,
  logo_url     text,

  -- Booleano com default (is_active: boolean no tipo)
  is_active    boolean not null default true,

  -- Timestamps (created_at e updated_at: string no tipo, obrigatórios)
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- 2. CLIENT_DNA
-- Fonte: src/features/dna/types/dna.ts (interface ClientDna)
--        src/features/dna/api/dna-repository.ts (formToDb, upsert)
--
-- Campos escritos pelo formToDb():
--   tom_de_voz, publico, objetivos, pilares, estilo_legenda,
--   cta_padrao, hashtags_base, palavras_preferidas, palavras_evitar,
--   o_que_nao_fazer, temas_proibidos, regras, exemplos_aprovados,
--   exemplos_reprovados, perfis_referencia, temas_cobertos,
--   aprendizados, observacoes
--
-- Campos presentes no tipo ClientDna mas não escritos pelo form
-- (gerenciados internamente ou reservados para v1.2+):
--   calendario_config, historico_feedbacks, onboarding_sources
-- ============================================================
create table public.client_dna (
  -- PK
  id                   uuid primary key default uuid_generate_v4(),

  -- FK obrigatória 1:1 com clients
  client_id            uuid not null unique references public.clients(id) on delete cascade,

  -- IDENTIDADE (text | null no tipo, null no formToDb quando vazio)
  tom_de_voz           text,
  publico              text,
  objetivos            text,

  -- PILARES — Pilar[] no tipo, escrito como jsonb[]
  -- formato: [{"nome":"...","peso_pct":40,"subpilares":["..."]}]
  pilares              jsonb not null default '[]'::jsonb,

  -- ESTILO (text | null)
  estilo_legenda       text,
  cta_padrao           text,
  hashtags_base        text,

  -- LINGUAGEM (text | null)
  palavras_preferidas  text,
  palavras_evitar      text,
  o_que_nao_fazer      text,
  temas_proibidos      text,

  -- REGRAS (text | null)
  regras               text,

  -- EXEMPLOS — arrays de objetos (jsonb, nunca null, default [])
  -- ExemploAprovado: {titulo, abertura, fechamento, notas?}
  exemplos_aprovados   jsonb not null default '[]'::jsonb,
  -- ExemploReprovado: {titulo, problema}
  exemplos_reprovados  jsonb not null default '[]'::jsonb,

  -- REFERÊNCIAS — PerfilReferencia[]: {handle, notas}
  perfis_referencia    jsonb not null default '[]'::jsonb,

  -- CALENDÁRIO — Record<string,unknown>, lido pelo tipo mas não editado pelo form
  calendario_config    jsonb not null default '{}'::jsonb,

  -- APRENDIZAGEM
  -- aprendizados: string[] no tipo; formToDb mapeia {value} → string
  aprendizados         jsonb not null default '[]'::jsonb,
  -- historico_feedbacks: Record<string,unknown>[], reservado para v1.2
  historico_feedbacks  jsonb not null default '[]'::jsonb,

  -- ONBOARDING — Record<string,unknown>, reservado para v1.2
  onboarding_sources   jsonb not null default '{}'::jsonb,

  -- INTELIGÊNCIA EDITORIAL
  -- TemaCoberto: {tema, data, subpilar, formato?}
  temas_cobertos       jsonb not null default '[]'::jsonb,

  -- OBSERVAÇÕES (text | null)
  observacoes          text,

  -- Timestamp (updated_at: string no tipo)
  updated_at           timestamptz not null default now()
);

-- ============================================================
-- 3. PAUTAS
-- Fonte: src/features/planejamento/types/pauta.ts (interface Pauta, PautaInsert)
--        src/features/planejamento/api/pautas-repository.ts
--        src/features/planejamento/pages/planejamento-page.tsx
--           → usa: batch_id, source_params
--
-- PautaPrioridade = "alta" | "media" | "baixa"
-- PautaStatus     = "idea" | "approved" | "rejected"
-- ============================================================
create table public.pautas (
  -- PK
  id             uuid primary key default uuid_generate_v4(),

  -- FKs obrigatórias
  client_id      uuid not null references public.clients(id) on delete cascade,

  -- Agrupa uma rodada de planejamento (batch_id: string no tipo)
  batch_id       uuid not null,

  -- Conteúdo da pauta
  titulo         text not null,                -- titulo: string (não null)
  pilar          text,                         -- pilar: string | null
  subpilar       text,                         -- subpilar: string | null
  formato        text,                         -- formato: string | null
  objetivo       text,                         -- objetivo: string | null
  resumo         text,                         -- resumo: string | null
  justificativa  text,                         -- justificativa: string | null

  -- PautaPrioridade com CHECK
  prioridade     text not null default 'media'
                   check (prioridade in ('alta', 'media', 'baixa')),

  -- PautaStatus com CHECK
  status         text not null default 'idea'
                   check (status in ('idea', 'approved', 'rejected')),

  -- Parâmetros originais da geração (source_params: Record<string,unknown>)
  source_params  jsonb not null default '{}'::jsonb,

  -- Timestamp (created_at: string no tipo)
  created_at     timestamptz not null default now()
);

-- Índices usados pelos queries (listByClient filtra por client_id,
-- planejamento-page agrupa por batch_id, useUpdatePauta filtra por status)
create index idx_pautas_client on public.pautas(client_id);
create index idx_pautas_batch  on public.pautas(batch_id);
create index idx_pautas_status on public.pautas(status);

-- ============================================================
-- 4. POSTS
-- Fonte: src/features/posts/types/post.ts (interface Post, PostInsert, PostUpdate)
--        src/features/posts/api/posts-repository.ts
--        src/features/posts/pages/posts-page.tsx
--        src/features/calendario/pages/calendario-page.tsx → data_sugerida, status
--        src/features/calendario/types/calendar.ts         → data_sugerida
--        src/features/planejamento/components/pauta-to-post-dialog.tsx → pauta_id
--
-- Post["status"] = "idea"|"approved"|"em_producao"|"finalizado"|"publicado"
-- ============================================================
create table public.posts (
  -- PK
  id              uuid primary key default uuid_generate_v4(),

  -- FKs
  client_id       uuid not null references public.clients(id) on delete cascade,
  -- pauta_id: string | null no tipo, opcional no PostInsert
  -- on delete set null: post sobrevive se pauta for apagada
  pauta_id        uuid references public.pautas(id) on delete set null,

  -- Conteúdo gerado (todos text | null no tipo)
  titulo_arte     text,
  texto_arte      text,
  legenda         text,
  cta             text,
  hashtags_fixas  text,
  hashtags_var    text,
  hashtags_locais text,
  obs_design      text,
  formato         text,
  objetivo        text,
  subpilar        text,

  -- Calendário editorial
  -- data_sugerida: string | null no tipo, usado em calendar.ts e date-edit-dialog
  data_sugerida   date,

  -- Status com CHECK — Post["status"] union type
  status          text not null default 'idea'
                    check (status in ('idea', 'approved', 'em_producao', 'finalizado', 'publicado')),

  -- Métricas (rating: number | null, was_edited: boolean, edit_chars: number)
  rating          smallint check (rating between 1 and 5),
  was_edited      boolean not null default false,
  edit_chars      integer not null default 0,

  -- Checklist de aderência ao DNA (Record<string,boolean> no tipo)
  checklist       jsonb not null default '{}'::jsonb,

  -- Timestamps especializados (string | null no tipo)
  generated_at    timestamptz,
  approved_at     timestamptz,

  -- Timestamps padrão (string, obrigatórios no tipo)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Índices usados pelos queries (listByClient filtra por client_id e ordena por created_at)
create index idx_posts_client   on public.posts(client_id);
create index idx_posts_status   on public.posts(status);
create index idx_posts_pauta    on public.posts(pauta_id);

-- ============================================================
-- 5. POST_DERIVACOES
-- Fonte: src/features/derivacoes/types/derivacao.ts (interface Derivacao, DerivacaoInsert)
--        src/features/derivacoes/api/derivacoes-repository.ts
--
-- DerivacaoTipo = "reels" | "story" | "linkedin" | "facebook"
-- ============================================================
create table public.post_derivacoes (
  -- PK
  id          uuid primary key default uuid_generate_v4(),

  -- FK obrigatória (post_id: string no tipo, not null no insert)
  -- on delete cascade: derivações são removidas junto com o post
  post_id     uuid not null references public.posts(id) on delete cascade,

  -- Tipo com CHECK — DerivacaoTipo union type (DERIVACAO_TIPOS const array)
  tipo        text not null
                check (tipo in ('reels', 'story', 'linkedin', 'facebook')),

  -- Conteúdo gerado (conteudo: string | null no tipo)
  conteudo    text,

  -- Timestamp (created_at: string no tipo)
  created_at  timestamptz not null default now()
);

-- Índice usado pelo listByPost (filtra por post_id, ordena por created_at)
create index idx_derivacoes_post on public.post_derivacoes(post_id);

-- ============================================================
-- 6. TRIGGERS — updated_at automático
-- Tabelas com updated_at: clients, client_dna, posts
-- (pautas e post_derivacoes não têm updated_at no tipo)
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_clients_updated
  before update on public.clients
  for each row execute function public.set_updated_at();

create trigger trg_client_dna_updated
  before update on public.client_dna
  for each row execute function public.set_updated_at();

create trigger trg_posts_updated
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ============================================================
-- 7. ROW LEVEL SECURITY
-- Fase 0: single-user, sem autenticação.
-- RLS habilitado com policy permissiva (allow_all).
-- Em v1.2 as policies serão trocadas por: using (auth.uid() = user_id)
-- ============================================================
alter table public.clients          enable row level security;
alter table public.client_dna       enable row level security;
alter table public.pautas           enable row level security;
alter table public.posts            enable row level security;
alter table public.post_derivacoes  enable row level security;

create policy "allow_all" on public.clients         for all using (true) with check (true);
create policy "allow_all" on public.client_dna      for all using (true) with check (true);
create policy "allow_all" on public.pautas          for all using (true) with check (true);
create policy "allow_all" on public.posts           for all using (true) with check (true);
create policy "allow_all" on public.post_derivacoes for all using (true) with check (true);

-- ============================================================
-- FIM DO SCHEMA
-- Resultado esperado após execução: "Success. No rows returned."
-- Verificar com:
--   SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public' ORDER BY table_name;
-- Esperado: client_dna, clients, pautas, post_derivacoes, posts
-- ============================================================
