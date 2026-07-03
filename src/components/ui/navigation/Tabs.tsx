"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export type TabsVariant = "line" | "pill";

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "onChange"> {
  tabs: TabItem[];
  activeTab?: string;
  onChange?: (id: string) => void;
  /** line: underline indicator (main nav); pill: filled pill (in-page toggle) */
  variant?: TabsVariant;
  /** Stretch tabs to fill container */
  fullWidth?: boolean;
  style?: CSSProperties;
}

/**
 * Tabs — segmented navigation.
 * variant "line":  underline indicator (default, for main nav)
 * variant "pill":  filled pill indicator (for in-page switching)
 */
export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = "line",
  fullWidth = false,
  style,
  ...rest
}: TabsProps) {
  const active = activeTab ?? tabs[0]?.id;

  if (variant === "pill") {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "var(--color-cream-200)",
          borderRadius: "var(--radius-full)",
          padding: "4px",
          gap: "2px",
          width: fullWidth ? "100%" : undefined,
          ...style,
        }}
        {...rest}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => onChange?.(tab.id)}
              disabled={tab.disabled}
              style={{
                flex: fullWidth ? 1 : undefined,
                padding: "8px 18px",
                borderRadius: "var(--radius-full)",
                border: "none",
                cursor: tab.disabled ? "not-allowed" : "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                fontWeight: isActive ? "var(--weight-semibold)" : "var(--weight-regular)",
                color: isActive ? "var(--text-1)" : "var(--text-3)",
                background: isActive ? "var(--canvas)" : "transparent",
                boxShadow: isActive ? "var(--elevation-subtle)" : "none",
                transition: "background 150ms ease, box-shadow 150ms ease, color 150ms ease",
                whiteSpace: "nowrap",
                minHeight: "36px",
                opacity: tab.disabled ? 0.4 : 1,
              }}
            >
              {tab.icon && <span style={{ marginRight: "6px", fontSize: "14px" }}>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1.5px solid var(--hairline-soft)",
        gap: "0",
        width: fullWidth ? "100%" : undefined,
        ...style,
      }}
      {...rest}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange?.(tab.id)}
            disabled={tab.disabled}
            style={{
              flex: fullWidth ? 1 : undefined,
              padding: "12px 16px",
              border: "none",
              borderBottom: isActive ? "2px solid var(--color-coral-400)" : "2px solid transparent",
              marginBottom: "-1.5px",
              cursor: tab.disabled ? "not-allowed" : "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: isActive ? "var(--weight-medium)" : "var(--weight-regular)",
              color: isActive ? "var(--color-coral-400)" : "var(--text-3)",
              background: "transparent",
              transition: "color 150ms ease, border-color 150ms ease",
              whiteSpace: "nowrap",
              minHeight: "44px",
              opacity: tab.disabled ? 0.4 : 1,
            }}
          >
            {tab.icon && <span style={{ marginRight: "6px", fontSize: "15px" }}>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
