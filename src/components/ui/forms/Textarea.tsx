"use client";

import { useState } from "react";
import type { CSSProperties, TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style" | "id"> {
  label?: string;
  /** Red error message */
  error?: string;
  /** Gray hint text */
  hint?: string;
  /** Character limit — shows counter when set */
  maxLength?: number;
  id?: string;
  style?: CSSProperties;
  textareaStyle?: CSSProperties;
}

/**
 * Textarea — multiline text input.
 * Auto-grows or fixed height. Korean-friendly line-height.
 */
export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  rows = 4,
  maxLength,
  id,
  style,
  textareaStyle,
  ...rest
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const textareaId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  const charCount = value ? String(value).length : 0;

  const borderColor = error
    ? "var(--color-error)"
    : focused
    ? "var(--color-coral-400)"
    : "var(--color-cream-500)";

  const shadow = focused && !error
    ? "0 0 0 3px var(--color-coral-100)"
    : error
    ? "0 0 0 3px var(--color-error-bg)"
    : "none";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", ...style }}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <label
            htmlFor={textareaId}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontWeight: "var(--weight-medium)",
              color: disabled ? "var(--text-disabled)" : "var(--text-1)",
              lineHeight: 1.4,
            }}
          >
            {label}
          </label>
          {maxLength && (
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                color: charCount > maxLength * 0.9 ? "var(--color-coral-400)" : "var(--text-muted)",
              }}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          border: `1.5px solid ${borderColor}`,
          borderRadius: "var(--radius-md)",
          background: disabled ? "var(--color-cream-200)" : "var(--canvas)",
          boxShadow: shadow,
          fontFamily: "var(--font-sans)",
          fontSize: "16px",
          fontWeight: "var(--weight-regular)",
          color: disabled ? "var(--text-disabled)" : "var(--text-1)",
          lineHeight: 1.65,
          padding: "12px 14px",
          width: "100%",
          boxSizing: "border-box",
          outline: "none",
          resize: "vertical",
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          ...textareaStyle,
        }}
        {...rest}
      />
      {(error || hint) && (
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "13px",
            lineHeight: 1.4,
            color: error ? "var(--color-error)" : "var(--text-3)",
          }}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
}
