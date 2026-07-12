# Motor de Conteúdo Stage — Roadmap

> Roadmap é intenção, não contrato. Prioridades podem mudar.
> O que não muda: o princípio Prompt = motor, DNA = configuração.

---

## ✅ v1.0 — Fundação (concluída)

O motor funcionando de ponta a ponta. Um usuário, sem autenticação, com clientes reais da Stage.

**Entregues:**
- Clientes, DNA, Planejamento, Posts, Derivações, Calendário
- P1 (pautas), P2 (post), P3 (derivação) integrados
- URL como fonte de verdade para navegação entre features
- Botões de copiar em todos os outputs
- Toast, feedback de erro, empty states com CTAs
- Aviso de alterações não salvas no DNA
- Confirmação antes de descartar conteúdo gerado
- Indicadores de campos preenchidos por seção do DNA
- Diferenciação visual de status no calendário

---

## v1.1 — Polimento e uso diário

*Foco: reduzir atrito no uso real. Sem novas features grandes.*

**Ajustes de UX:**
- [ ] P4 exposto na UI — botão "Ajustar com IA" em posts salvos e derivações
- [ ] Editor inline de post salvo (título, legenda, CTA editáveis diretamente)
- [ ] Code splitting por rota — bundle atual > 500KB, deve ser dividido
- [ ] Spinner visual nos estados de loading (geração pode levar 5–15s)
- [ ] Tema claro/escuro básico

**Melhorias técnicas:**
- [ ] Separar `dbToForm`/`formToDb` do DNA repository para um converter dedicado
- [ ] Testes unitários para `buildCalendarMonth`, `countSectionFields`, `sumPilarWeights`

---

## v1.2 — Autenticação e analytics

*Foco: o produto pode ser usado por mais de uma pessoa da Stage com segurança.*

**Autenticação:**
- [ ] Supabase Auth (email + senha)
- [ ] `user_id` nas tabelas (clientes, pautas, posts, derivacoes)
- [ ] RLS (Row Level Security) no Supabase
- [ ] Edge Function com JWT verificado (remover `--no-verify-jwt`)
- [ ] Rate limiting na Edge Function
- [ ] Página de login

**Analytics editorial:**
- [ ] Dashboard por cliente: posts gerados × aprovados × publicados por mês
- [ ] Taxa de aprovação de pautas por pilar
- [ ] Posts por formato (carrossel vs reels vs story)
- [ ] Tempo médio do ciclo pauta → publicação

---

## v1.3 — Integração mLabs

*Foco: fechar o loop entre geração e publicação.*

- [ ] OAuth mLabs — conexão da conta
- [ ] Enviar post gerado diretamente para o mLabs como rascunho
- [ ] Sincronizar status de publicação do mLabs de volta ao calendário
- [ ] Preview de como o post ficará no Instagram antes de enviar
- [ ] Agendamento direto pelo calendário (via mLabs API)

---

## v2 — SaaS multi-tenant

*Foco: o Motor de Conteúdo pode atender agências e produtoras além da Stage.*

**Multi-tenant:**
- [ ] Organizations (workspaces) — múltiplas agências em uma instância
- [ ] Roles: Admin, Editor, Visualizador
- [ ] Convite por email para novos membros
- [ ] Billing por organização (Stripe)
- [ ] Planos: Free (1 cliente), Pro (até 10), Agency (ilimitado)

**Onboarding:**
- [ ] Wizard de criação de cliente com DNA guiado por perguntas
- [ ] Templates de DNA por segmento (advogado, restaurante, e-commerce...)
- [ ] Import de histórico de posts do Instagram para popular DNA

**Infraestrutura:**
- [ ] Migração de GitHub Pages → Vercel Pro com custom domain
- [ ] Backups automáticos do banco
- [ ] Logs de uso por cliente e por feature
- [ ] SLA de uptime

---

## v3 — IA editorial

*Foco: o Motor aprende com o tempo e começa a sugerir proativamente.*

Esta versão emergiu de uma observação sobre o DNA: os campos `temas_cobertos`, `aprendizados` e `historico_feedbacks` já existem no schema, mas são alimentados manualmente. A v3 fecha esse loop com aprendizado contínuo.

**Motor de aprendizado:**
- [ ] Análise automática de posts publicados via Instagram Graph API
  - quais formatos geram mais engajamento por cliente
  - quais pilares têm melhor performance
  - horários com maior alcance
- [ ] Atualização automática de `temas_cobertos` quando um post é marcado como publicado
- [ ] Sugestão automática de `aprendizados` com base nos dados de performance
- [ ] Score de aderência ao DNA com base no histórico real (não só checklist estático)

**Geração proativa:**
- [ ] Motor sugere pautas automaticamente com base em sazonalidade e performance histórica
  - "Este cliente tem bom desempenho com conteúdo educativo às terças"
  - "Está há 2 semanas sem conteúdo no pilar Captação"
- [ ] Alerta de consistência: avisa se o DNA está desatualizado (último update > 60 dias)
- [ ] Detecção de temas repetidos mesmo sem registro manual em `temas_cobertos`

**DNA vivo:**
- [ ] DNA se atualiza com base no que foi aprovado vs reprovado
- [ ] Perfis de referência atualizam automaticamente via análise de conteúdo publicado
- [ ] Histórico de feedbacks alimenta o contexto do P2 e P3 de forma automática

**Infraestrutura necessária:**
- [ ] Fila de processamento assíncrono (Supabase realtime ou worker externo)
- [ ] Vector database para busca semântica de temas já cobertos
- [ ] Pipeline de análise de performance (webhook Instagram → processamento → banco)

---

## Não está no roadmap (e por quê)

| Item | Motivo |
|---|---|
| Editor visual de artes | Fora do escopo — Stage tem motion designer para isso |
| Geração de imagens com IA | Dependência de ferramenta externa; não resolve o core |
| Chat com a IA | O produto não é um chat — é um motor de produção |
| Aprovação por cliente | Complexidade de permissões; resolver na v2 com roles |
| App mobile nativo | Web funciona bem em mobile; não justifica custo |

---

*Última atualização: Julho 2026 — v1.0.0*
