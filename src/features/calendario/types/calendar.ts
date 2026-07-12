import type { Post } from "@/features/posts/types";

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: Post[];
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-11
  days: CalendarDay[];
}

/** Builds a calendar grid for a given month */
export function buildCalendarMonth(
  year: number,
  month: number,
  posts: Post[],
): CalendarMonth {
  const today = new Date();
  const todayStr = formatDate(today);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start from Sunday of the week containing the 1st
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // End at Saturday of the week containing the last day
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  // Index posts by date
  const postsByDate = new Map<string, Post[]>();
  for (const post of posts) {
    if (post.data_sugerida) {
      const dateKey = post.data_sugerida;
      const existing = postsByDate.get(dateKey);
      if (existing) {
        existing.push(post);
      } else {
        postsByDate.set(dateKey, [post]);
      }
    }
  }

  const days: CalendarDay[] = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const dateStr = formatDate(cursor);
    days.push({
      date: dateStr,
      dayNumber: cursor.getDate(),
      isCurrentMonth: cursor.getMonth() === month,
      isToday: dateStr === todayStr,
      posts: postsByDate.get(dateStr) ?? [],
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return { year, month, days };
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
] as const;

export const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;
