import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState } from "react";
import { ClientContextHeader, ClientSelector, EmptyState, Toast } from "@/shared/components";
import { useClientParam, useToast } from "@/shared/hooks";
import { useUpdatePost } from "@/features/posts/hooks";
import type { Post } from "@/features/posts/types";
import { useCalendarData } from "../hooks";
import { MONTH_NAMES } from "../types";
import { CalendarGrid, DateEditDialog, UnscheduledPanel } from "../components";

export function CalendarioPage() {
  const today = new Date();
  const navigate = useNavigate();
  const { clientId, client } = useClientParam();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const calendar = useCalendarData(clientId || undefined, year, month);
  const updatePost = useUpdatePost();
  const { toast, show: showToast } = useToast();

  function handleClientChange(id: string) {
    navigate(id ? `?clientId=${id}` : "", { replace: true });
  }

  function navigateMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  function handleSavePost(
    postId: string,
    data: { data_sugerida?: string | null; status?: Post["status"] },
  ) {
    updatePost.mutate(
      { id: postId, clientId, data },
      {
        onSuccess: () => {
          setEditingPost(null);
          showToast("Post atualizado");
        },
      },
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Calendário Editorial</h1>

      {client && <ClientContextHeader client={client} clientId={clientId} />}

      {/* Client selector */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 10,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <ClientSelector value={clientId} onChange={(id) => handleClientChange(id)} />
      </div>

      {!clientId && (
        <EmptyState
          icon={<Calendar size={40} />}
          title="Selecione um cliente"
          description="Escolha um cliente para ver o calendário editorial."
        />
      )}

      {clientId && calendar.error && (
        <div style={{ padding: 40, textAlign: "center", color: "#d32f2f" }}>
          <p style={{ fontWeight: 500 }}>Erro ao carregar dados</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>{calendar.error.message}</p>
        </div>
      )}

      {clientId && calendar.isLoading && (
        <p style={{ color: "#999", padding: 20 }}>Carregando calendário...</p>
      )}

      {clientId && !calendar.isLoading && !calendar.error && (
        <>
          {/* Month navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <button
              onClick={() => navigateMonth(-1)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                border: "1px solid #ddd",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
              {MONTH_NAMES[month]} {year}
            </h2>

            <button
              onClick={() => navigateMonth(1)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                border: "1px solid #ddd",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div style={{ marginBottom: 24 }}>
            <CalendarGrid calendar={calendar.calendarMonth} onPostClick={setEditingPost} />
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 24, fontSize: 13, color: "#666" }}>
            <span>{calendar.scheduledPosts.length} posts agendados</span>
            <span>{calendar.unscheduledPosts.length} sem data</span>
            <span>{calendar.backlogPautas.length} pautas no backlog</span>
          </div>

          <UnscheduledPanel
            posts={calendar.unscheduledPosts}
            pautas={calendar.backlogPautas}
            onPostClick={setEditingPost}
          />
        </>
      )}

      {editingPost && (
        <DateEditDialog
          open
          onClose={() => setEditingPost(null)}
          post={editingPost}
          onSave={handleSavePost}
          isSaving={updatePost.isPending}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
