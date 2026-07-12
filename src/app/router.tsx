import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layout";
import { ClientsPage } from "@/features/clients/pages/clients-page";
import { DnaPage } from "@/features/dna/pages/dna-page";
import { PostsPage } from "@/features/posts/pages/posts-page";
import { DerivacoesPage } from "@/features/derivacoes/pages/derivacoes-page";
import { PlanejamentoPage } from "@/features/planejamento/pages/planejamento-page";
import { CalendarioPage } from "@/features/calendario/pages/calendario-page";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/clientes" replace /> },
      { path: "clientes", element: <ClientsPage /> },
      { path: "dna", element: <DnaPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "derivacoes", element: <DerivacoesPage /> },
      { path: "planejamento", element: <PlanejamentoPage /> },
      { path: "calendario", element: <CalendarioPage /> },
    ],
  },
]);
