import { create } from "zustand";

// 상태의 타입 정의 (TypeScript 사용 시)
interface ConstState {
  sharedValue: Record<string, string>;
  updateValue: (newValue: Record<string, string>) => void;
}

// 스토어 생성
export const useConstState = create<ConstState>((set) => ({
  sharedValue: {}, // 초기 상태
  updateValue: (newValue) => set({ sharedValue: newValue }), // 상태 변경 함수
}));
