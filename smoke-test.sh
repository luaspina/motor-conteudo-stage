#!/usr/bin/env bash
SUPABASE_URL="https://pisgnjimtjebhxqtgpwp.supabase.co"
ANON_KEY="SUA_ANON_KEY_AQUI"

EDGE_URL="${SUPABASE_URL}/functions/v1/generate"

echo ""
echo "Motor de Conteudo Stage - Smoke Test"
echo "URL: ${EDGE_URL}"
echo ""

echo "Teste 1/3 - Edge Function acessivel..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${EDGE_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{}')

if [ "$RESPONSE" = "400" ]; then
  echo "OK - Edge Function respondeu (400 = body invalido, mas esta viva)"
elif [ "$RESPONSE" = "200" ]; then
  echo "OK - Edge Function respondeu 200"
elif [ "$RESPONSE" = "000" ]; then
  echo "FALHA - Falha de conexao - URL incorreta ou Edge Function nao deployada"
  exit 1
else
  echo "AVISO - Resposta inesperada: ${RESPONSE}"
fi

echo ""
echo "Teste 2/3 - Geracao de pautas via P1..."

PAYLOAD='{
  "prompt_type": "pautas",
  "client": {"name": "Stage Smoke Test", "segment": "teste"},
  "dna": {
    "tom_de_voz": "direto e claro",
    "publico": "advogados",
    "objetivos": "captar clientes",
    "pilares": [{"nome": "Educativo", "peso_pct": 100, "subpilares": ["Direito"]}],
    "estilo_legenda": "curto e direto",
    "cta_padrao": "me chama no whats",
    "hashtags_base": "#direito",
    "palavras_preferidas": null,
    "palavras_evitar": null,
    "o_que_nao_fazer": null,
    "temas_proibidos": null,
    "regras": null,
    "exemplos_aprovados": [],
    "exemplos_reprovados": [],
    "temas_cobertos": [],
    "aprendizados": [],
    "perfis_referencia": [],
    "observacoes": null
  },
  "payload": {"tema": "direitos trabalhistas", "quantidade": 2, "periodo": "julho 2026", "formatos": "carrossel", "objetivo": "educativo"}
}'

RESULT=$(curl -s -X POST "${EDGE_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d "${PAYLOAD}")

SUCCESS=$(echo "$RESULT" | grep -c '"success":true')
HAS_DATA=$(echo "$RESULT" | grep -c '"data":\[')
HAS_ERROR=$(echo "$RESULT" | grep -c '"error"')

if [ "$SUCCESS" -gt 0 ] && [ "$HAS_DATA" -gt 0 ]; then
  echo "OK - P1 retornou pautas com sucesso"
elif echo "$RESULT" | grep -q "CLAUDE_API_KEY not configured"; then
  echo "FALHA - CLAUDE_API_KEY nao configurada no Supabase"
  exit 1
elif [ "$HAS_ERROR" -gt 0 ]; then
  echo "FALHA - Erro da Edge Function:"
  echo "$RESULT" | head -c 300
  exit 1
else
  echo "AVISO - Resposta inesperada:"
  echo "$RESULT" | head -c 300
fi

echo ""
echo "Teste 3/3 - Verificando que CLAUDE_API_KEY nao vaza..."

if echo "$RESULT" | grep -q "sk-ant-"; then
  echo "FALHA - CLAUDE_API_KEY apareceu no response!"
  exit 1
else
  echo "OK - CLAUDE_API_KEY nao vaza no response"
fi

echo ""
echo "===================================="
echo "Smoke test concluido"
echo "===================================="
echo ""
