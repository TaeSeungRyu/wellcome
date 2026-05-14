import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger, setLogTransport, type LogTransport } from "./logger";

describe("logger", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let debugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    infoSpy.mockRestore();
    debugSpy.mockRestore();
    setLogTransport(null);
  });

  it("error/warn은 콘솔의 해당 메서드를 호출한다", () => {
    logger.error("boom");
    logger.warn("careful");
    expect(errorSpy).toHaveBeenCalledWith("boom");
    expect(warnSpy).toHaveBeenCalledWith("careful");
  });

  it("context가 있으면 두 번째 인자로 전달한다", () => {
    const ctx = { traceId: "abc" };
    logger.error("failed", ctx);
    expect(errorSpy).toHaveBeenCalledWith("failed", ctx);
  });

  it("context가 없으면 단일 인자만 전달한다", () => {
    logger.error("plain");
    expect(errorSpy).toHaveBeenCalledWith("plain");
    expect(errorSpy.mock.calls[0]).toHaveLength(1);
  });

  it("transport가 주입되면 모든 level이 capture를 호출한다", () => {
    const transport: LogTransport = { capture: vi.fn() };
    setLogTransport(transport);

    logger.error("e", 1);
    logger.warn("w");
    logger.info("i");
    logger.debug("d");

    expect(transport.capture).toHaveBeenCalledTimes(4);
    expect(transport.capture).toHaveBeenNthCalledWith(1, "error", "e", 1);
    expect(transport.capture).toHaveBeenNthCalledWith(2, "warn", "w", undefined);
    expect(transport.capture).toHaveBeenNthCalledWith(3, "info", "i", undefined);
    expect(transport.capture).toHaveBeenNthCalledWith(4, "debug", "d", undefined);
  });

  it("transport를 null로 재설정하면 더 이상 호출되지 않는다", () => {
    const transport: LogTransport = { capture: vi.fn() };
    setLogTransport(transport);
    logger.error("first");
    setLogTransport(null);
    logger.error("second");
    expect(transport.capture).toHaveBeenCalledTimes(1);
  });
});
