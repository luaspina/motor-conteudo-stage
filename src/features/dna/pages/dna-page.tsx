import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Dna, Plus } from "lucide-react";
import { ClientContextHeader, EmptyState, Toast, MutationError } from "@/shared/components";
import { useClientParam, useToast } from "@/shared/hooks";
import { useDna, useSaveDna } from "../hooks";
import { dnaRepository } from "../api";
import { DnaEditor } from "../components";
import { emptyDnaFormValues } from "../types";
import type { DnaFormValues } from "../types";

export function DnaPage() {
  const { clientId, client } = useClientParam();

  const { data: dna, isLoading, error } = useDna(clientId || undefined);
  const saveDna = useSaveDna();
  const [creatingNew, setCreatingNew] = useState(false);
  const { toast, show: showToast } = useToast();

  function handleSave(values: DnaFormValues, reset: () => void) {
    if (!clientId) return;
    saveDna.mutate(
      { clientId, values },
      {
        onSuccess: () => {
          reset();
          setCreatingNew(false);
          showToast("DNA salvo com sucesso");
        },
      },
    );
  }

  if (!clientId) {
    return (
      <EmptyState
        icon={<Dna size={40} />}
        title="Nenhum cliente selecionado"
        description="Selecione um cliente na tela de Clientes para editar o DNA."
        action={
          <Link
            to="/clientes"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              background: "#111",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            Ir para Clientes
          </Link>
        }
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#d32f2f" }}>
        <p style={{ fontWeight: 500 }}>Erro ao carregar DNA</p>
        <p style={{ fontSize: 13, marginTop: 4 }}>{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return <p style={{ color: "#999", padding: 20 }}>Carregando DNA...</p>;
  }

  if (!dna && !creatingNew) {
    return (
      <div>
        {client && <ClientContextHeader client={client} clientId={clientId} />}
        <EmptyState
          icon={<Dna size={40} />}
          title="DNA não cadastrado"
          description="Este cliente ainda não possui DNA. Crie o DNA para começar a gerar conteúdo com IA."
          action={
            <button
              onClick={() => setCreatingNew(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <Plus size={16} />
              Criar DNA para este cliente
            </button>
          }
        />
      </div>
    );
  }

  const formValues = dna ? dnaRepository.toFormValues(dna) : emptyDnaFormValues();

  return (
    <div>
      {client && <ClientContextHeader client={client} clientId={clientId} />}
      <MutationError error={saveDna.error} />

      <DnaEditor
        key={dna?.id ?? "new"}
        defaultValues={formValues}
        onSubmit={handleSave}
        isSaving={saveDna.isPending}
        client={client}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
