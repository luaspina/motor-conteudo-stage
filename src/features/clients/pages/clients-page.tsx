import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { Dialog, EmptyState, Toast, MutationError } from "@/shared/components";
import { useToast } from "@/shared/hooks";
import { useClients, useCreateClient, useUpdateClient } from "../hooks";
import { ClientCard } from "../components/client-card";
import { ClientForm } from "../components/client-form";
import { cleanFormValues } from "../types";
import type { Client, ClientFormValues } from "../types";

type DialogMode = { kind: "closed" } | { kind: "create" } | { kind: "edit"; client: Client };

export function ClientsPage() {
  const navigate = useNavigate();
  const { data: clients, isLoading, error } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const [dialog, setDialog] = useState<DialogMode>({ kind: "closed" });
  const { toast, show: showToast } = useToast();

  const closeDialog = useCallback(() => setDialog({ kind: "closed" }), []);

  function handleSubmit(values: ClientFormValues) {
    const cleaned = cleanFormValues(values);
    if (dialog.kind === "create") {
      createClient.mutate(cleaned, {
        onSuccess: () => {
          closeDialog();
          showToast("Cliente criado com sucesso");
        },
      });
    } else if (dialog.kind === "edit") {
      updateClient.mutate({ id: dialog.client.id, data: cleaned }, {
        onSuccess: () => {
          closeDialog();
          showToast("Cliente atualizado");
        },
      });
    }
  }

  function handleOpenDna(clientId: string) {
    navigate(`/dna?clientId=${clientId}`);
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#d32f2f" }}>
        <p style={{ fontWeight: 500 }}>Erro ao carregar clientes</p>
        <p style={{ fontSize: 13, marginTop: 4 }}>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Clientes</h1>
        <button
          onClick={() => setDialog({ kind: "create" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            border: "none",
            borderRadius: 8,
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Plus size={16} />
          Novo cliente
        </button>
      </div>

      {isLoading ? (
        <p style={{ color: "#999", padding: 20 }}>Carregando...</p>
      ) : clients?.length === 0 ? (
        <EmptyState
          icon={<Users size={40} />}
          title="Nenhum cliente cadastrado"
          description="Crie seu primeiro cliente para começar a gerar conteúdo."
          action={
            <button
              onClick={() => setDialog({ kind: "create" })}
              style={{
                padding: "10px 24px",
                border: "none",
                borderRadius: 8,
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Criar primeiro cliente
            </button>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {clients?.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={(c) => setDialog({ kind: "edit", client: c })}
              onOpenDna={handleOpenDna}
            />
          ))}
        </div>
      )}

      <Dialog
        open={dialog.kind !== "closed"}
        onClose={closeDialog}
        title={dialog.kind === "edit" ? "Editar cliente" : "Novo cliente"}
      >
        <ClientForm
          key={dialog.kind === "edit" ? dialog.client.id : "new"}
          client={dialog.kind === "edit" ? dialog.client : undefined}
          onSubmit={handleSubmit}
          onCancel={closeDialog}
          isSubmitting={createClient.isPending || updateClient.isPending}
        />
        <MutationError error={createClient.error ?? updateClient.error} />
      </Dialog>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
