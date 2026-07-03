"use client";

import { useState } from "react";
import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "id"> {
  label?: string;
  /** Red error message shown below field */
  error?: string;
  /** Gray hint shown below field */
  hint?: string;
  /** Icon/element inside left edge */
  leftElement?: ReactNode;
  /** Icon/element inside right edge */
  rightElement?: ReactNode;
  id?: string;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

/**
 * Input — single-line text field.
 * 44px min height for senior accessibility.
 */
export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  hint,
  disabled = false,
  leftElement,
  rightElement,
  id,
  style,
  inputStyle,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

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
        <label
          htmlFor={inputId}
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
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          borderRadius: "var(--radius-md)",
          border: `1.5px solid ${borderColor}`,
          background: disabled ? "var(--color-cream-200)" : "var(--canvas)",
          boxShadow: shadow,
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          minHeight: "44px",
          boxSizing: "border-box",
        }}
      >
        {leftElement && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "12px",
              color: "var(--text-3)",
              flexShrink: 0,
            }}
          >
            {leftElement}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-sans)",
            fontSize: "16px",
            fontWeight: "var(--weight-regular)",
            color: disabled ? "var(--text-disabled)" : "var(--text-1)",
            padding: leftElement ? "10px 12px 10px 8px" : "10px 12px",
            paddingRight: rightElement ? "8px" : "12px",
            width: "100%",
            boxSizing: "border-box",
            lineHeight: 1.5,
            ...inputStyle,
          }}
          {...rest}
        />
        {rightElement && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "12px",
              color: "var(--text-3)",
              flexShrink: 0,
            }}
          >
            {rightElement}
          </span>
        )}
      </div>
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
