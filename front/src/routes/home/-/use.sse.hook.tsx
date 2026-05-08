import { useEffect, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { API_BASE_URL } from "@/const";
export const useSSEHook = (
  id: string | null,
  token: string | null,
  onMessage: (data: any) => void,
  onError?: (error: any) => void,
) => {
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    if (!id || !token) return;

    const es = new EventSourcePolyfill(`${API_BASE_URL}/events/sse/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatTimeout: 60_000,
    });

    eventSourceRef.current = es;

    const handleMessage = (event: any) => {
      onMessage(event); // 이제 여기서 콘솔이 찍힐 겁니다!
    };

    es.addEventListener("ping", handleMessage);
    es.addEventListener("event", handleMessage); // type이 없는 경우

    es.onerror = (error) => {
      console.error("SSE Error:", error);
      onError?.(error);
      // ❌ 여기서 토큰 건드리지 않음
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [id, token]); // 🔥 token 바뀌면 자동 재연결
};
