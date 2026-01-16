import { create } from "zustand";

// 상태의 타입 정의 (TypeScript 사용 시)
interface AppState {
  sharedValue: string;
  updateValue: (newValue: string) => void;
}

// 스토어 생성
export const useBoardState = create<AppState>((set) => ({
  sharedValue: "", // 초기 상태
  updateValue: (newValue) => set({ sharedValue: newValue }), // 상태 변경 함수
}));
