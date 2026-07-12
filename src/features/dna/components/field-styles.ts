import type { CSSProperties } from "react";

export const fieldStyles = {
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: 80,
    outline: "none",
  } satisfies CSSProperties,

  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
  } satisfies CSSProperties,

  inputSmall: {
    width: 80,
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    textAlign: "center",
  } satisfies CSSProperties,

  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#444",
    marginBottom: 4,
  } satisfies CSSProperties,

  addButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    border: "1px dashed #ccc",
    borderRadius: 8,
    background: "none",
    cursor: "pointer",
    fontSize: 13,
    color: "#666",
    marginTop: 8,
  } satisfies CSSProperties,

  removeButton: {
    padding: "6px 10px",
    border: "none",
    borderRadius: 6,
    background: "#fee",
    color: "#c33",
    cursor: "pointer",
    fontSize: 12,
    flexShrink: 0,
  } satisfies CSSProperties,

  itemCard: {
    border: "1px solid #eee",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  } satisfies CSSProperties,
};
