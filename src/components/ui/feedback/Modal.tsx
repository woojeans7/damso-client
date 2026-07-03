"use client";

import { useEffect } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "title"> {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  /** Footer content — usually one or two Buttons */
  footer?: ReactNode;
  size?: ModalSize;
  /** Clicking the backdrop calls onClose */
  closeOnBackdrop?: boolean;
  style?: CSSProperties;
}

const widths: Record<ModalSize, string> = { sm: "360px", md: "480px", lg: "600px" };

/**
 * Modal — centered overlay dialog.
 * Supports sm / md / lg sizes.
 * Use onClose to wire the backdrop click and close button.
 */
export function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  style,
  ...rest
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={closeOnBackdrop ? onClose : undefined}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(30, 16, 5, 0.45)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: widths[size] ?? widths.md,
          background: "var(--canvas)",
          borderRadius: "var(--radius-xxxl)",
          boxShadow: "var(--elevation-modal)",
          overflow: "hidden",
          boxSizing: "border-box",
          ...style,
        }}
        {...rest}
      >
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 28px 0",
              gap: "16px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontWeight: "var(--weight-semibold)",
                fontSize: "18px",
                lineHeight: 1.35,
                color: "var(--text-1)",
              }}
            >
              {title}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="닫기"
                style={{
                  background: "var(--color-cream-200)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "var(--text-3)",
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            )}
          </div>
        )}

        <div style={{ padding: title ? "20px 28px 24px" : "28px" }}>{children}</div>

        {footer && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              padding: "0 28px 24px",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
