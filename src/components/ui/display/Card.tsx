"use client";

import { useState } from "react";
import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode } from "react";

export type CardVariant = "base" | "feature" | "quote" | "video" | "diary" | "sage" | "amber";
export type CardElevation = "flat" | "subtle" | "card" | "modal";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "onClick"> {
  /** Visual variant — controls shape, bg color, and special chrome */
  variant?: CardVariant;
  /** Shadow depth */
  elevation?: CardElevation;
  /** Override padding — accepts any CSS value */
  padding?: string;
  /** Override background color */
  bg?: string;
  /** Makes card clickable with hover lift */
  onClick?: MouseEventHandler<HTMLDivElement>;
  children: ReactNode;
  style?: CSSProperties;
}

const elevationMap: Record<CardElevation, string> = {
  flat: "var(--elevation-flat)",
  subtle: "var(--elevation-subtle)",
  card: "var(--elevation-card)",
  modal: "var(--elevation-modal)",
};

/**
 * Card — surface container with multiple variants.
 * base:    Standard content card with hairline border.
 * feature: Large rounded feature card with warm beige bg.
 * quote:   AI-extracted memorable quote — coral-tinted bg + accent bar.
 * video:   Video thumbnail card with dark overlay.
 * diary:   Diary entry card with date label.
 */
export function Card({
  variant = "base",
  elevation = "subtle",
  padding,
  bg,
  onClick,
  children,
  style,
  ...rest
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const isClickable = !!onClick;

  const variantStyles: Record<CardVariant, CSSProperties> = {
    base: {
      background: bg || "var(--canvas)",
      borderRadius: "var(--radius-xl)",
      padding: padding || "var(--card-padding)",
      boxShadow: elevationMap[elevation],
    },
    feature: {
      background: bg || "var(--color-cream-100)",
      borderRadius: "var(--radius-xxxl)",
      padding: padding || "var(--card-padding-feature)",
      boxShadow: elevationMap[elevation === "flat" ? "subtle" : elevation],
    },
    quote: {
      background: bg || "var(--color-coral-50)",
      borderRadius: "var(--radius-xl)",
      padding: padding || "var(--card-padding)",
      boxShadow: elevationMap[elevation],
      borderLeft: "4px solid var(--color-coral-300)",
    },
    video: {
      background: bg || "#2A1A10",
      borderRadius: "var(--radius-xl)",
      padding: padding || "0",
      overflow: "hidden",
      boxShadow: elevationMap[elevation === "flat" ? "card" : elevation],
    },
    diary: {
      background: bg || "var(--canvas)",
      borderRadius: "var(--radius-xl)",
      padding: padding || "var(--card-padding)",
      boxShadow: elevationMap[elevation],
      border: "var(--border-soft)",
    },
    sage: {
      background: bg || "var(--color-sage-50)",
      borderRadius: "var(--radius-xxxl)",
      padding: padding || "var(--card-padding-feature)",
      boxShadow: elevationMap[elevation],
    },
    amber: {
      background: bg || "var(--color-amber-50)",
      borderRadius: "var(--radius-xxxl)",
      padding: padding || "var(--card-padding-feature)",
      boxShadow: elevationMap[elevation],
    },
  };

  const vs = variantStyles[variant] ?? variantStyles.base;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => isClickable && setHovered(true)}
      onMouseLeave={() => isClickable && setHovered(false)}
      style={{
        boxSizing: "border-box",
        transition: "box-shadow 180ms ease, transform 150ms ease",
        cursor: isClickable ? "pointer" : undefined,
        transform: isClickable && hovered ? "translateY(-2px)" : undefined,
        ...vs,
        ...(isClickable && hovered && { boxShadow: "var(--elevation-card)" }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
