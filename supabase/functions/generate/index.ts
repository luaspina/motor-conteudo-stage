// Motor de Conteúdo Stage — Edge Function: Claude API Proxy
// Deploy: supabase functions deploy generate --no-verify-jwt
// Secret: supabase secrets set CLAUDE_API_KEY=sk-ant-...
//
// Aceita POST com { prompt_type, payload }
// prompt_type: "pautas" | "post" | "derivacao" | "ajustar"
// payload: dados específicos de cada tipo (DNA, pauta, etc.)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY");
const CLAUDE_MODEL = "claude-sonnet-4-6";
const CLAUDE_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

// ── Build DNA context block ──────────────────────────────────
function buildDnaBlock(dna: any, client: any): string {
  const pilares = (dna.pilares || [])
    .map((p: any) => `• ${p.nome} (${p.peso_pct}%): ${(p.subpilares || []).join(", ")}`)
    .join("\n");

  const aprovados = (dna.exemplos_aprovados || [])
    .map((e: any) => `— "${e.titulo}"\n  Abertura: ${e.abertura}\n  Fechamento: ${e.fechamento}`)
    .join("\n");

  const reprovados = (dna.exemplos_reprovados || [])
    .map((e: any) => `— "${e.titulo}" → Problema: ${e.problema}`)
    .join("\n");

  const cobertos = (dna.temas_cobertos || [])
    .map((t: any) => `— ${t.tema} (${t.data}, ${t.subpilar})`)
    .join("\n");

  const aprendizados = (dna.aprendizados || [])
    .map((a: string) => `— ${a}`)
    .join("\n");

  const referencia = (dna.perfis_referencia || [])
    .map((r: any) => `— ${r.handle}: ${r.notas}`)
    .join("\n");

  return `CONTEXTO DO CLIENTE — ${client.name} (${client.segment})
Instagram: ${client.instagram || "—"}
Site: ${client.site || "—"}
WhatsApp: ${client.whatsapp || "—"}

COMO FALA (tom): ${dna.tom_de_voz || "—"}

PÚBLICO: ${dna.publico || "—"}

OBJETIVOS: ${dna.objetivos || "—"}

PILARES COM PESO (distribua proporcionalmente):
${pilares || "—"}

ESTILO DE LEGENDA:
${dna.estilo_legenda || "—"}

CTA PADRÃO:
${dna.cta_padrao || "—"}

HASHTAGS BASE:
${dna.hashtags_base || "—"}

PALAVRAS PREFERIDAS: ${dna.palavras_preferidas || "—"}

PALAVRAS A EVITAR: ${dna.palavras_evitar || "—"}

O QUE NUNCA FAZER:
${dna.o_que_nao_fazer || "—"}

TEMAS PROIBIDOS:
${dna.temas_proibidos || "—"}

REGRAS ESPECÍFICAS:
${dna.regras || "—"}

EXEMPLOS APROVADOS (imite este padrão):
${aprovados || "Nenhum ainda."}

EXEMPLOS REPROVADOS (evite isto):
${reprovados || "Nenhum ainda."}

TEMAS JÁ COBERTOS (não repita a menos que tenha ângulo novo):
${cobertos || "Nenhum ainda."}

APRENDIZADOS DO CLIENTE (aplique sempre):
${aprendizados || "Nenhum ainda."}

PERFIS DE REFERÊNCIA (posicionamento, não cópia):
${referencia || "Nenhum."}

OBSERVAÇÕES DA MARCA:
${dna.observacoes || "—"}`;
}

// ── Prompt builders ──────────────────────────────────────────

function buildPautasPrompt(dnaBlock: string, params: any): string {
  return `Você é estrategista de conteúdo da Stage. Gera pautas de conteúdo Always On 100% fiéis ao DNA do cliente abaixo. NUNCA proponha temas da lista de proibidos. Varie ângulos; distribua entre os pilares respeitando os pesos; priorize o que serve ao público agora. Evite títulos genéricos como "Conheça seus direitos" ou "Fique atento" — cada pauta deve partir de uma dor real e específica do público.

${dnaBlock}

Tarefa: gere ${params.quantidade || 8} ideias de pauta.
Tema/objetivo: ${params.tema || "livre"}
Período: ${params.periodo || "próximo mês"}
Formatos desejados: ${params.formatos || "feed e carrossel"}
Objetivo: ${params.objetivo || "educativo + captação"}

Para cada pauta retorne: titulo, pilar, subpilar, formato_recomendado, objetivo, resumo (1-2 frases), justificativa (por que faz sentido pra este público agora), prioridade (alta/media/baixa).

Responda SOMENTE com um array JSON válido. Sem markdown, sem texto fora do JSON.`;
}

function buildPostPrompt(dnaBlock: string, pauta: any): string {
  return `Você é redator de conteúdo da Stage, escrevendo na VOZ EXATA do cliente abaixo. Respeite rigorosamente o estilo de legenda, as palavras a evitar, o "o que nunca fazer" e as regras do DNA. Use os exemplos aprovados como padrão de imitação.

${dnaBlock}

Pauta aprovada:
Título: ${pauta.titulo}
Pilar: ${pauta.pilar || "—"}
Subpilar: ${pauta.subpilar || "—"}
Formato: ${pauta.formato || "carrossel"}
Objetivo: ${pauta.objetivo || "educativo"}
Resumo: ${pauta.resumo || "—"}

Tarefa: produza o pacote do post.
IMPORTANTE:
- Legenda, CTA e hashtags devem ser campos SEPARADOS.
- Hashtags divididas em: hashtags_fixas, hashtags_var (do tema específico), hashtags_locais.
- Inclua obs_design com descrição slide a slide.
- Inclua um campo "checklist" como objeto com chaves booleanas: seguiu_formula, respeitou_tom, sem_palavras_proibidas, tema_novo, pilar_correto, cta_correto, objetivo_atendido, dentro_limite_caracteres.

Retorne JSON: { titulo_arte, texto_arte, legenda, cta, hashtags_fixas, hashtags_var, hashtags_locais, obs_design, formato_sugerido, objetivo, subpilar, checklist }
Responda SOMENTE com JSON válido. Sem markdown.`;
}

function buildDerivacaoPrompt(dnaBlock: string, legenda: string, tipo: string): string {
  return `${dnaBlock}

Post original:
${legenda}

Tarefa: adapte para ${tipo}, respeitando as convenções do formato:
- reels: roteiro em cenas com fala/legenda de tela, duração estimada
- story: sequência de telas curtas com CTA no fim
- linkedin: tom mais profissional, 1ª pessoa, poucas hashtags
- facebook: tom levemente mais informal que o Instagram, sem hashtags excessivas

Retorne o conteúdo pronto como texto. Sem JSON.`;
}

function buildAjustarPrompt(dnaBlock: string, conteudo: string, instrucao: string): string {
  return `${dnaBlock}

Conteúdo atual:
${conteudo}

Instrução do usuário: ${instrucao}

Reescreva aplicando a instrução e mantendo a voz do cliente. Retorne SOMENTE o conteúdo revisado, sem explicações.`;
}

// ── Main handler ─────────────────────────────────────────────

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!CLAUDE_API_KEY) {
    return new Response(JSON.stringify({ error: "CLAUDE_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { prompt_type, client, dna, payload } = body;

    if (!prompt_type || !dna) {
      return new Response(JSON.stringify({ error: "Missing prompt_type or dna" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dnaBlock = buildDnaBlock(dna, client || { name: "Cliente", segment: "" });

    let userMessage: string;

    switch (prompt_type) {
      case "pautas":
        userMessage = buildPautasPrompt(dnaBlock, payload || {});
        break;
      case "post":
        userMessage = buildPostPrompt(dnaBlock, payload || {});
        break;
      case "derivacao":
        userMessage = buildDerivacaoPrompt(
          dnaBlock,
          payload?.legenda || "",
          payload?.tipo || "reels"
        );
        break;
      case "ajustar":
        userMessage = buildAjustarPrompt(
          dnaBlock,
          payload?.conteudo || "",
          payload?.instrucao || ""
        );
        break;
      default:
        return new Response(JSON.stringify({ error: `Unknown prompt_type: ${prompt_type}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Call Claude API
    const claudeResponse = await fetch(CLAUDE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      return new Response(
        JSON.stringify({ error: "Claude API error", status: claudeResponse.status, detail: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const claudeData = await claudeResponse.json();

    // Extract text content
    const textContent = claudeData.content
      ?.filter((block: any) => block.type === "text")
      ?.map((block: any) => block.text)
      ?.join("\n") || "";

    // Try to parse as JSON (for pautas and post), return raw for derivacao/ajustar
    let parsed: any = null;
    try {
      const cleaned = textContent.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Not JSON — that's fine for derivacao/ajustar
    }

    return new Response(
      JSON.stringify({
        success: true,
        prompt_type,
        data: parsed,
        raw: parsed ? undefined : textContent,
        usage: claudeData.usage,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Internal error", message: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
