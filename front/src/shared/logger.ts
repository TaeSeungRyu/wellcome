// 통일 로거. 모든 에러/경고/디버그 로그는 이곳을 통과한다.
//
// - dev 환경: console에 출력
// - prod 환경: 기본은 console.error만 (운영 디버깅용), 외부 모니터링(Sentry 등)은
//   `setLogTransport`로 주입한다. 모니터링 도구 선정 후 main.tsx에서 호출.
//
// 사용: logger.error("token refresh failed", err);

type LogLevel = "error" | "warn" | "info" | "debug";

export interface LogTransport {
  capture(level: LogLevel, message: string, context?: unknown): void;
}

let transport: LogTransport | null = null;

export const setLogTransport = (t: LogTransport | null) => {
  transport = t;
};

const isDev = import.meta.env.DEV;

const dispatch = (level: LogLevel, message: string, context?: unknown) => {
  if (isDev || level === "error" || level === "warn") {
    // 운영 환경에서도 error/warn은 브라우저 콘솔에 남긴다 (운영 디버깅)
    const fn =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : level === "info"
            ? console.info
            : console.debug;
    if (context !== undefined) {
      fn(message, context);
    } else {
      fn(message);
    }
  }
  transport?.capture(level, message, context);
};

export const logger = {
  error: (message: string, context?: unknown) =>
    dispatch("error", message, context),
  warn: (message: string, context?: unknown) =>
    dispatch("warn", message, context),
  info: (message: string, context?: unknown) =>
    dispatch("info", message, context),
  debug: (message: string, context?: unknown) =>
    dispatch("debug", message, context),
};
