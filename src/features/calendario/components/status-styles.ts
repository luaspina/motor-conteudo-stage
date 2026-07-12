import type { Post } from "@/features/posts/types";

type PostStatus = Post["status"];

interface StatusStyle {
  color: string;
  bg: string;
  border: string;
  label: string;
  dot: string;
}

export function getPostStatusStyle(status: PostStatus): StatusStyle {
  switch (status) {
    case "approved":
      return { color: "#007a3d", bg: "#e6f7ed", border: "#b8e6cc", label: "Aprovado", dot: "#009B4D" };
    case "em_producao":
      return { color: "#924d00", bg: "#fff3d6", border: "#f5d48a", label: "Em produção", dot: "#e08000" };
    case "finalizado":
      return { color: "#1252a3", bg: "#e3f0fa", border: "#a8cdef", label: "Finalizado", dot: "#1a6fb5" };
    case "publicado":
      return { color: "#5b1a9e", bg: "#f3e8ff", border: "#d4b0f5", label: "Publicado", dot: "#7c3aed" };
    default:
      return { color: "#555", bg: "#f0f0f0", border: "#ddd", label: "Rascunho", dot: "#999" };
  }
}
