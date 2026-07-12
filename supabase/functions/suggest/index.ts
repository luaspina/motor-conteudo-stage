// Motor de Conteúdo Stage — Edge Function: DNA Suggest
// Deploy: supabase functions deploy suggest --no-verify-jwt
// Secret: CLAUDE_API_KEY (same as generate)
//
// Aceita POST com { section, client, identidade? }
// section: "identidade" | "estilo"
// Retorna JSON com campos da seção solicitada.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY");
const CLAUDE_MODEL = "claude-sonnet-4-6";
const CLAUDE_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-client-info",
};

// ── Prompt: Identidade ────────────────────────────────────────
function buildIdentidadePrompt(client: {
  name: string;
  segment?: string;
  instagram?: string;
  site?: string;
}): string {
  const parts = [`Nome: ${client.name}`];
  if (client.segment) parts.push(`Segmento: ${client.segment}`);
  if (client.instagram) parts.push(`Instagram: ${client.instagram}`);
  if (client.site) parts.push(`Site: ${client.site}`);

  return `Você é estrategista de conteúdo da Stage, uma produtora de conteúdo digital.
Preciso que você sugira o posicionamento inicial de um cliente com base nas informações abaixo.

${parts.join("\n")}

Retorne SOMENTE um JSON válido com exatamente estas 3 chaves:
{
  "tom_de_voz": "descreva o tom ideal para este cliente (ex: educativo e acessível, direto e profissional, etc.)",
  "publico": "descreva o público-alvo principal deste cliente",
  "objetivos": "descreva os objetivos de conteúdo para este cliente"
}

Seja específico para o segmento e o perfil do cliente. Não use respostas genéricas.
Responda SOMENTE com o JSON. Sem markdown, sem explicações.`;
}

// ── Prompt: Estilo ────────────────────────────────────────────
function buildEstiloPrompt(
  client: { name: string; segment?: string },
  identidade: { tom_de_voz?: string; publico?: string; objetivos?: string },
): string {
  const clientParts = [`Nome: ${client.name}`];
  if (client.segment) clientParts.push(`Segmento: ${client.segment}`);

  const identidadeParts: string[] = [];
  if (identidade.tom_de_voz) identidadeParts.push(`Tom de voz: ${identidade.tom_de_voz}`);
  if (identidade.publico) identidadeParts.push(`Público: ${identidade.publico}`);
  if (identidade.objetivos) identidadeParts.push(`Objetivos: ${identidade.objetivos}`);

  const identidadeBlock = identidadeParts.length > 0
    ? `\nIdentidade já definida:\n${identidadeParts.join("\n")}`
    : "";

  return `Você é especialista em copywriting e produção de conteúdo digital para redes sociais.
Preciso que você defina o estilo de comunicação para um cliente.

${clientParts.join("\n")}${identidadeBlock}

Retorne SOMENTE um JSON válido com exatamente estas 3 chaves:
{
  "estilo_legenda": "descreva como as legendas devem ser estruturadas: abertura, desenvolvimento, fechamento, tamanho ideal, uso de emojis, quebras de linha (seja específico e detalhado, pois isso será usado como guia de redação)",
  "cta_padrao": "escreva 2 ou 3 opções de CTA (chamada para ação) prontas para usar, separadas por barra. Ex: Me chama no WhatsApp / Comenta aqui embaixo / Salva esse post",
  "hashtags_base": "liste de 8 a 12 hashtags relevantes para este cliente e segmento, separadas por espaço, começando com #"
}

Seja específico para o segmento e o perfil. Não use respostas genéricas.
Responda SOMENTE com o JSON. Sem markdown, sem explicações.`;
}

// ── Chamada Claude ────────────────────────────────────────────
async function callClaude(prompt: string): Promise<string> {
  const response = await fetch(CLAUDE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.content
    ?.filter((block: any) => block.type === "text")
    ?.map((block: any) => block.text)
    ?.join("\n") || "";
}

function parseJson(text: string): Record<string, string> | null {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ── Handler ───────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (!CLAUDE_API_KEY) {
    return new Response(
      JSON.stringify({ error: "CLAUDE_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const body = await req.json();
    const { section, client, identidade } = body;

    if (!client?.name) {
      return new Response(
        JSON.stringify({ error: "Missing client.name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!section) {
      return new Response(
        JSON.stringify({ error: "Missing section" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Route por section ────────────────────────────────────
    let prompt: string;
    let requiredKeys: string[];

    switch (section) {
      case "identidade":
        prompt = buildIdentidadePrompt(client);
        requiredKeys = ["tom_de_voz", "publico", "objetivos"];
        break;

      case "estilo":
        prompt = buildEstiloPrompt(client, identidade || {});
        requiredKeys = ["estilo_legenda", "cta_padrao", "hashtags_base"];
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unknown section: ${section}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
    }

    const textContent = await callClaude(prompt);
    const parsed = parseJson(textContent);

    const hasAllKeys = parsed && requiredKeys.every((k) => parsed[k]);
    if (!hasAllKeys) {
      return new Response(
        JSON.stringify({
          error: "A IA retornou uma resposta em formato inesperado.",
          raw: textContent,
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data: Record<string, string> = {};
    for (const key of requiredKeys) {
      data[key] = parsed![key];
    }

    return new Response(
      JSON.stringify({ success: true, section, data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Internal error", message: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
