import { useCallback, useEffect, useRef } from "react";
import { SWRConfig, type Middleware, type SWRHook } from "swr";

// 키가 변경되더라도 데이터를 유지하기 위한 SWR 미들웨어입니다.
const laggy: Middleware = (useSWRNext: SWRHook) => {
  return (key, fetcher, config) => {
    // 이전에 반환된 데이터를 저장하기 위해 ref를 사용합니다.
    const laggyDataRef = useRef<undefined | any>(undefined);
    // 실제 SWR hook.
    const swr = useSWRNext(key, fetcher, config);
    useEffect(() => {
      // 데이터가 undefined가 아니면 ref를 업데이트합니다.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data;
      }
    }, [swr.data]);
    // 지연 데이터가 존재할 경우 이를 제거하기 위한 메서드를 노출합니다.
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined;
    }, []);
    // 현재 데이터가 undefined인 경우에 이전 데이터로 폴백
    const dataOrLaggyData =
      swr.data === undefined ? laggyDataRef.current : swr.data;
    // 이전 데이터를 보여주고 있나요?
    const isLagging =
      swr.data === undefined && laggyDataRef.current !== undefined;
    // `isLagging` 필드 또한 SWR에 추가합니다.
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    });
  };
};

// SWR 미들웨어: 로깅 기능 추가
const logger: Middleware = (useSWRNext: SWRHook) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    useEffect(() => {
      console.log("SWR 인스턴스 실행:", key);
    }, [key]);
    useEffect(() => {
      if (swr.data) console.log("데이터 수신:", key, swr.data);
      if (swr.error) console.error("에러 발생:", key, swr.error);
    }, [swr.data, swr.error, key]);
    return swr;
  };
};

export function SWRProviders({ children }: any) {
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          //에러를 전역으로 처리 가능
          console.error(`Error fetching data for key: ${key}`, error);
        },
        use: [logger, laggy],
      }}
    >
      {children}
    </SWRConfig>
  );
}
