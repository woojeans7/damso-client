"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface BottomNavItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface BottomNavProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "onChange"> {
  items: BottomNavItem[];
  activeId?: string;
  onChange?: (id: string) => void;
  style?: CSSProperties;
}

/**
 * BottomNav — mobile app primary navigation.
 * Active item gets a warm pill highlight matching the DAMSO screen tone.
 */
export function BottomNav({ items, activeId, onChange, style, ...rest }: BottomNavProps) {
  const active = activeId ?? items[0]?.id;

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
        minHeight: "54px",
        padding: "6px",
        background: "rgba(255, 255, 255, 0.86)",
        border: "1px solid var(--hairline-soft)",
        borderRadius: "var(--radius-full)",
        boxSizing: "border-box",
        boxShadow: "var(--elevation-subtle)",
        ...style,
      }}
      {...rest}
    >
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange?.(item.id)}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                minHeight: "40px",
                padding: "0 12px",
                borderRadius: "var(--radius-full)",
                background: isActive ? "var(--color-coral-100)" : "transparent",
                border: isActive ? "1px solid var(--color-coral-200)" : "1px solid transparent",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontWeight: isActive ? "var(--weight-semibold)" : "var(--weight-medium)",
                color: isActive ? "var(--color-ink-700)" : "var(--text-3)",
                whiteSpace: "nowrap",
                transition: "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
              }}
            >
              {item.icon}
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
