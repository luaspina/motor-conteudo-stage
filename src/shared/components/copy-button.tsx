import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string;
  /** Label shown next to the icon. Defaults to "Copiar" */
  label?: string;
  /** Compact mode: icon only, no label */
  compact?: boolean;
}

export function CopyButton({ text, label = "Copiar", compact = false }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }, [text]);

  const feedbackLabel = state === "copied" ? "Copiado" : state === "error" ? "Erro" : label;
  const feedbackColor = state === "copied" ? "#009B4D" : state === "error" ? "#d32f2f" : "#888";

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: compact ? "4px 6px" : "4px 10px",
        border: "none",
        borderRadius: 6,
        background: "transparent",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 500,
        color: feedbackColor,
        transition: "color 0.15s",
      }}
    >
      {state === "copied" ? <Check size={14} /> : <Copy size={14} />}
      {!compact && feedbackLabel}
    </button>
  );
}
