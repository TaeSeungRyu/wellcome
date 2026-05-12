export function LoadingComponent({ text }: { text?: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] transition-all">
      <div className="flex flex-col items-center gap-2">
        {/* 간단한 스피너 아이콘 (Tailwind) */}
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-blue-600 font-medium">
          {text || "데이터를 불러오는 중..."}
        </span>
      </div>
    </div>
  );
}
