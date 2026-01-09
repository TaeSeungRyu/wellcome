// Modal.tsx
import { type ReactNode, useEffect, useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  isTop: boolean;
  children: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

export default function Modal({
  open,
  onClose,
  isTop,
  children,
  closeOnEsc,
  closeOnOverlay,
}: ModalProps) {
  const [visible, setVisible] = useState(open);

  // open 변경에 따른 mount / unmount 제어
  useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  // ESC (Top 모달만)
  useEffect(() => {
    if (!open || !isTop) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (closeOnEsc) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isTop, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/50 transition-opacity duration-200
        ${open ? "opacity-100" : "opacity-0"}
      `}
      onClick={isTop && closeOnOverlay ? onClose : undefined}
    >
      <div
        className={`
          bg-white rounded-lg shadow-lg p-6 min-w-[300px]
          transform transition-all duration-200
          ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
