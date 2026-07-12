import { useMemo } from "react";
import { usePosts } from "@/features/posts/hooks";
import { usePautas } from "@/features/planejamento/hooks";
import { buildCalendarMonth } from "../types";
import type { Post } from "@/features/posts/types";
import type { Pauta } from "@/features/planejamento/types";

interface CalendarData {
  isLoading: boolean;
  error: Error | null;
  scheduledPosts: Post[];
  unscheduledPosts: Post[];
  backlogPautas: Pauta[];
  calendarMonth: ReturnType<typeof buildCalendarMonth>;
}

export function useCalendarData(
  clientId: string | undefined,
  year: number,
  month: number,
): CalendarData {
  const posts = usePosts(clientId);
  const pautas = usePautas(clientId);

  return useMemo(() => {
    const allPosts = posts.data ?? [];
    const allPautas = pautas.data ?? [];

    const scheduledPosts = allPosts.filter((p) => p.data_sugerida);
    const unscheduledPosts = allPosts.filter((p) => !p.data_sugerida);
    const backlogPautas = allPautas.filter((p) => p.status === "approved");

    const calendarMonth = buildCalendarMonth(year, month, allPosts);

    return {
      isLoading: posts.isLoading || pautas.isLoading,
      error: posts.error ?? pautas.error ?? null,
      scheduledPosts,
      unscheduledPosts,
      backlogPautas,
      calendarMonth,
    };
  }, [posts.data, posts.isLoading, posts.error, pautas.data, pautas.isLoading, pautas.error, year, month]);
}
