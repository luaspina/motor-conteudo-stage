interface ToastProps {
  message: string;
  type: "success" | "error";
}

export function Toast({ message, type }: ToastProps) {
  const bg = type === "success" ? "#009B4D" : "#d32f2f";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        padding: "12px 20px",
        background: bg,
        color: "#fff",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        zIndex: 2000,
        animation: "toast-in 0.2s ease-out",
      }}
    >
      {message}
    </div>
  );
}
