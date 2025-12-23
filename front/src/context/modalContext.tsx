// modal-context.tsx
import { createContext, useContext } from "react";

export interface ModalOptions {
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

export interface OpenModalArgs {
  content: React.ReactNode;
  options?: ModalOptions;
}

export interface ModalItem {
  id: string;
  content: React.ReactNode;
  options?: ModalOptions;
}

interface ModalContextType {
  openModal: (args: OpenModalArgs) => void;
  closeTopModal: () => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("ModalProvider missing");
  return ctx;
};
