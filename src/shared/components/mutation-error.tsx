interface MutationErrorProps {
  error: Error | null;
}

export function MutationError({ error }: MutationErrorProps) {
  if (!error) return null;

  return (
    <p
      style={{
        fontSize: 13,
        color: "#d32f2f",
        background: "#fef2f2",
        padding: "10px 14px",
        borderRadius: 8,
        marginTop: 12,
      }}
    >
      {error.message || "Ocorreu um erro. Tente novamente."}
    </p>
  );
}
