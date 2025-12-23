// ModalProvider.tsx
import { useCallback, useState } from "react";
import Modal from "./modalComponent";
import {
  ModalContext,
  type ModalItem,
  type OpenModalArgs,
} from "@/context/modalContext";

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stack, setStack] = useState<ModalItem[]>([]);

  const openModal = useCallback(({ content, options }: OpenModalArgs) => {
    setStack((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content,
        options: {
          closeOnOverlay: true,
          closeOnEsc: true,
          ...options,
        },
      },
    ]);
  }, []);

  const closeTopModal = useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeTopModal }}>
      {children}

      {/* ⭐ 스택 렌더링 */}
      {stack.map((modal, index) => {
        const isTop = index === stack.length - 1;

        return (
          <Modal
            key={modal.id}
            open
            onClose={isTop ? closeTopModal : () => {}}
            isTop={isTop}
            closeOnOverlay={modal.options?.closeOnOverlay}
            closeOnEsc={modal.options?.closeOnEsc}
          >
            {modal.content}
          </Modal>
        );
      })}
    </ModalContext.Provider>
  );
}
