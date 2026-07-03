import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "sage"
  | "amber"
  | "success"
  | "error"
  | "warning"
  | "outline"
  | "dark";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  /** Color scheme */
  variant?: BadgeVariant;
  /** Size */
  size?: BadgeSize;
  /** Show a colored dot before label */
  dot?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

interface SizeSpec {
  fontSize: string;
  padding: string;
  height: string;
  gap: string;
}

const sizes: Record<BadgeSize, SizeSpec> = {
  sm: { fontSize: "11px", padding: "2px 8px", height: "20px", gap: "4px" },
  md: { fontSize: "13px", padding: "4px 10px", height: "24px", gap: "5px" },
  lg: { fontSize: "14px", padding: "5px 12px", height: "28px", gap: "6px" },
};

const variants: Record<BadgeVariant, CSSProperties> = {
  default: { background: "var(--color-cream-200)", color: "var(--color-ink-700)" },
  primary: { background: "var(--color-coral-100)", color: "var(--color-coral-600)" },
  sage: { background: "var(--color-sage-100)", color: "var(--color-sage-500)" },
  amber: { background: "var(--color-amber-100)", color: "var(--color-amber-400)" },
  success: { background: "var(--color-success-bg)", color: "var(--color-success)" },
  error: { background: "var(--color-error-bg)", color: "var(--color-error)" },
  warning: { background: "var(--color-warning-bg)", color: "var(--color-warning)" },
  outline: { background: "transparent", color: "var(--color-ink-500)", border: "1px solid var(--hairline-strong)" },
  dark: { background: "var(--color-ink-900)", color: "#fff" },
};

/**
 * Badge — small inline label. Always pill-shaped.
 * Use for status, emotional tags, categories.
 */
export function Badge({ variant = "default", size = "md", dot = false, children, style, ...rest }: BadgeProps) {
  const s = sizes[size] ?? sizes.md;
  const v = variants[variant] ?? variants.default;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        borderRadius: "var(--radius-full)",
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--weight-semibold)",
        fontSize: s.fontSize,
        lineHeight: 1,
        padding: s.padding,
        height: s.height,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        letterSpacing: "0.01em",
        ...v,
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "currentColor",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
