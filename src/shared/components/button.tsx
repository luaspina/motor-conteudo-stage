import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "success" | "danger" | "neutral" | "ghost";
export type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon element rendered before the label */
  icon?: ReactNode;
  children: ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, {
  background: string;
  color: string;
  border: string;
  hoverBackground: string;
}> = {
  primary: {
    background: "#111",
    color: "#fff",
    border: "none",
    hoverBackground: "#333",
  },
  success: {
    background: "#009B4D",
    color: "#fff",
    border: "none",
    hoverBackground: "#007a3d",
  },
  danger: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    hoverBackground: "#b71c1c",
  },
  neutral: {
    background: "#fff",
    color: "#444",
    border: "1px solid #ddd",
    hoverBackground: "#f5f5f5",
  },
  ghost: {
    background: "transparent",
    color: "#666",
    border: "none",
    hoverBackground: "#f0f0f0",
  },
};

const SIZE_STYLES: Record<ButtonSize, { padding: string; fontSize: number }> = {
  sm: { padding: "6px 14px", fontSize: 13 },
  md: { padding: "10px 20px", fontSize: 14 },
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];

  return (
    <button
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 500,
        fontFamily: "inherit",
        border: v.border,
        borderRadius: 8,
        background: v.background,
        color: v.color,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "background 0.15s",
        lineHeight: 1,
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
