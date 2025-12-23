// ToastContainer.tsx
import { useEffect } from "react";
import { useToast, type ToastItem } from "../../context/toastContext";

const ANIMATION_DURATION = 200;

export default function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  const { updateToast, removeToast } = useToast();

  useEffect(() => {
    if (toasts.length === 0) return;

    const first = toasts[0];

    const timer = setTimeout(() => {
      // ⭐ 먼저 퇴장 애니메이션
      updateToast(first.id, { visible: false });

      setTimeout(() => {
        removeToast(first.id);
      }, ANIMATION_DURATION);
    }, first.duration);

    return () => clearTimeout(timer);
  }, [toasts, updateToast, removeToast]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-2 rounded shadow text-white
            transition-all duration-200 ease-out
            ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
            ${toast.type === "success" && "bg-green-600"}
            ${toast.type === "error" && "bg-red-600"}
            ${toast.type === "info" && "bg-gray-800"}            
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
