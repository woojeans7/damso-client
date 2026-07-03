"use client";

import { useState } from "react";
import type { CSSProperties, HTMLAttributes } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  /** Image URL — falls back to initials if missing or broken */
  src?: string;
  /** Name used for initials and aria-label */
  name?: string;
  /** Size — all sizes have accessible touch targets when wrapped in a button */
  size?: AvatarSize;
  /** Show online indicator dot (true = green, false = gray) */
  online?: boolean;
  style?: CSSProperties;
}

interface SizeSpec {
  px: number;
  font: string;
}

const sizes: Record<AvatarSize, SizeSpec> = {
  xs: { px: 24, font: "10px" },
  sm: { px: 32, font: "13px" },
  md: { px: 44, font: "16px" },
  lg: { px: 56, font: "20px" },
  xl: { px: 72, font: "26px" },
  "2xl": { px: 96, font: "34px" },
};

const bgColors: Array<[string, string]> = [
  ["var(--color-coral-100)", "var(--color-coral-500)"],
  ["var(--color-sage-100)", "var(--color-sage-500)"],
  ["var(--color-amber-100)", "var(--color-amber-400)"],
  ["var(--color-cream-300)", "var(--color-ink-500)"],
];

/**
 * Avatar — circular user/family member avatar.
 * Shows image if src provided, initials fallback, or icon fallback.
 */
export function Avatar({ src, name, size = "md", online, style, ...rest }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const s = sizes[size] ?? sizes.md;

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const colorIdx = name ? name.charCodeAt(0) % bgColors.length : 0;
  const [bg, fg] = bgColors[colorIdx];

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          width: s.px,
          height: s.px,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          color: fg,
          fontFamily: "var(--font-sans)",
          fontWeight: "var(--weight-semibold)",
          fontSize: s.font,
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {src && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name || "avatar"}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: Math.max(8, s.px * 0.22),
            height: Math.max(8, s.px * 0.22),
            borderRadius: "50%",
            background: online ? "var(--color-success)" : "var(--color-cream-500)",
            border: "2px solid var(--canvas)",
          }}
        />
      )}
    </div>
  );
}
