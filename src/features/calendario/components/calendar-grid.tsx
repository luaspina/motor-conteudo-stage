import type { CalendarMonth } from "../types";
import { WEEKDAY_NAMES } from "../types";
import { getPostStatusStyle } from "./status-styles";
import type { Post } from "@/features/posts/types";

interface CalendarGridProps {
  calendar: CalendarMonth;
  onPostClick: (post: Post) => void;
}

export function CalendarGrid({ calendar, onPostClick }: CalendarGridProps) {
  return (
    <div>
      {/* Weekday headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          marginBottom: 1,
        }}
      >
        {WEEKDAY_NAMES.map((day) => (
          <div
            key={day}
            style={{
              padding: "8px 4px",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "#999",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          background: "#e8e8e8",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {calendar.days.map((day) => (
          <div
            key={day.date}
            style={{
              background: day.isCurrentMonth ? "#fff" : "#f8f8f8",
              minHeight: 90,
              padding: 6,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: day.isToday ? 700 : 400,
                color: day.isCurrentMonth ? (day.isToday ? "#009B4D" : "#333") : "#ccc",
                marginBottom: 4,
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                background: day.isToday ? "#e6f7ed" : "transparent",
              }}
            >
              {day.dayNumber}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {day.posts.map((post) => {
                const s = getPostStatusStyle(post.status);
                return (
                  <button
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    title={`${post.titulo_arte ?? "Post"} · ${s.label}`}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "3px 6px",
                      border: `1px solid ${s.border}`,
                      borderLeft: `3px solid ${s.dot}`,
                      borderRadius: 4,
                      background: s.bg,
                      color: s.color,
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                      lineHeight: 1.3,
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {post.titulo_arte || "Post"}
                    </span>
                    {post.formato && (
                      <span
                        style={{
                          fontSize: 10,
                          opacity: 0.75,
                          fontWeight: 400,
                        }}
                      >
                        {post.formato}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
