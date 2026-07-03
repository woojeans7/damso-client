"use client";

import { Children, cloneElement, isValidElement } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type ToastType = "default" | "success" | "error" | "warning" | "info";

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "title"> {
  type?: ToastType;
  title?: string;
  message?: string;
  onClose?: () => void;
  /** Animate in/out — set false to animate out before unmounting */
  visible?: boolean;
  style?: CSSProperties;
}

export interface ToastContainerProps {
  children: ReactNode;
  style?: CSSProperties;
}

interface TypeSpec {
  icon: string;
  accent: string;
  bg: string;
}

const types: Record<ToastType, TypeSpec> = {
  default: { icon: "💬", accent: "var(--color-ink-700)", bg: "var(--canvas)" },
  success: { icon: "✓", accent: "var(--color-success)", bg: "var(--color-success-bg)" },
  error: { icon: "✕", accent: "var(--color-error)", bg: "var(--color-error-bg)" },
  warning: { icon: "!", accent: "var(--color-warning)", bg: "var(--color-warning-bg)" },
  info: { icon: "i", accent: "var(--color-coral-400)", bg: "var(--color-coral-50)" },
};

/**
 * Toast — brief notification that auto-dismisses.
 * Slides in from bottom; use ToastContainer for stacking.
 */
export function Toast({ type = "default", title, message, onClose, visible = true, style, ...rest }: ToastProps) {
  const t = types[type] ?? types.default;

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        background: "var(--canvas)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--elevation-modal)",
        border: "var(--border-soft)",
        padding: "14px 16px",
        minWidth: "280px",
        maxWidth: "360px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 250ms ease, transform 250ms ease",
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: t.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t.accent,
          fontFamily: "var(--font-sans)",
          fontWeight: "var(--weight-semibold)",
          fontSize: "14px",
          flexShrink: 0,
        }}
      >
        {t.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: "var(--weight-semibold)",
              fontSize: "14px",
              color: "var(--text-1)",
              lineHeight: 1.4,
            }}
          >
            {title}
          </div>
        )}
        {message && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "var(--text-3)",
              lineHeight: 1.5,
              marginTop: title ? "2px" : 0,
            }}
          >
            {message}
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            color: "var(--text-muted)",
            fontSize: "16px",
            lineHeight: 1,
            flexShrink: 0,
            borderRadius: "var(--radius-sm)",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

/**
 * ToastContainer — positions toast stack at bottom-center.
 */
export function ToastContainer({ children, style, ...rest }: ToastContainerProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 9999,
        pointerEvents: "none",
        ...style,
      }}
      {...rest}
    >
      {Children.map(children, (child) => {
        if (!isValidElement<{ style?: CSSProperties }>(child)) return child;
        return cloneElement(child, {
          style: { pointerEvents: "auto", ...child.props.style },
        });
      })}
    </div>
  );
}
