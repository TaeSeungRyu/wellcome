import { useEffect, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

export const useSSEHook = (
  id: string | null,
  jwtToken: string | null,
  onMessage: (data: any) => void,
  onError?: (error: any) => void,
) => {
  // eventSource 인스턴스를 유지하기 위한 ref
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    // ID나 토큰이 없으면 연결하지 않음
    if (!id || !jwtToken) return;

    console.log("SSE 연결 시도:", id);

    eventSourceRef.current = new EventSourcePolyfill(`/api/events/sse/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      heartbeatTimeout: 60 * 1000,
    });

    eventSourceRef.current.onmessage = (event) => {
      onMessage(event.data);
    };

    eventSourceRef.current.onerror = (error) => {
      console.error("SSE Error:", error);
      if (onError) onError(error);
    };

    //Cleanup
    return () => {
      if (eventSourceRef.current) {
        console.log("SSE 연결 해제");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [id, jwtToken]); // 의존성 배열 관리

  return eventSourceRef.current;
};
