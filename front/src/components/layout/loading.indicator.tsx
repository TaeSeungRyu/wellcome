// components/ui/LoadingIndicator.tsx
import { useEffect, useState } from "react";

export function LoadingIndicator({ isFetching }: { isFetching: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFetching) {
      setWidth(10); // 시작점
      interval = setInterval(() => {
        setWidth((prev) => {
          if (prev >= 90) return prev; // 90%에서 대기
          return prev + 2;
        });
      }, 100);
    } else {
      setWidth(100); // 완료 시 100%
      const timeout = setTimeout(() => setWidth(0), 300); // 사라짐
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [isFetching]);

  if (width === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[5px] w-full pointer-events-none">
      <div
        className="h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
