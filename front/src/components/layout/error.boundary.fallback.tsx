import type { FallbackProps } from "react-error-boundary";

export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-xl font-bold">문제가 발생했어요</h2>
      <p className="max-w-md text-sm text-gray-600">
        잠시 후 다시 시도해주세요.
      </p>

      <details className="max-w-2xl whitespace-pre-wrap rounded border p-3 text-left text-xs">
        {errorMessage}
      </details>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="rounded border px-4 py-2"
        >
          다시 시도
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded border px-4 py-2"
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
