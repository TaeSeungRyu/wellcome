import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PagingComponent } from "./Paging";

const renderPaging = (overrides: Partial<Parameters<typeof PagingComponent>[0]> = {}) => {
  const onPageChange = vi.fn();
  render(
    <PagingComponent
      currentPage={overrides.currentPage ?? 1}
      totalPages={overrides.totalPages ?? 10}
      size={overrides.size ?? 5}
      onPageChange={overrides.onPageChange ?? onPageChange}
    />,
  );
  return { onPageChange: overrides.onPageChange ?? onPageChange };
};

describe("PagingComponent", () => {
  it("size에 따라 페이지 버튼이 렌더링된다 (10페이지, size=5, currentPage=1)", () => {
    renderPaging({ totalPages: 10, currentPage: 1, size: 5 });
    [1, 2, 3, 4, 5].forEach((p) => {
      expect(screen.getByRole("button", { name: String(p) })).toBeDefined();
    });
    expect(screen.queryByRole("button", { name: "6" })).toBeNull();
  });

  it("currentPage가 가운데에 있으면 좌우로 균등 표시한다", () => {
    renderPaging({ totalPages: 10, currentPage: 5, size: 5 });
    [3, 4, 5, 6, 7].forEach((p) => {
      expect(screen.getByRole("button", { name: String(p) })).toBeDefined();
    });
  });

  it("페이지 번호 클릭 시 onPageChange가 호출된다", () => {
    const { onPageChange } = renderPaging({ totalPages: 10, currentPage: 1 });
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("처음 페이지에서는 First/Previous 버튼이 비활성화된다", () => {
    renderPaging({ totalPages: 10, currentPage: 1 });
    const first = screen.getByTitle("First Page") as HTMLButtonElement;
    const prev = screen.getByTitle("Previous Page") as HTMLButtonElement;
    expect(first.disabled).toBe(true);
    expect(prev.disabled).toBe(true);
  });

  it("마지막 페이지에서는 Next/Last 버튼이 비활성화된다", () => {
    renderPaging({ totalPages: 10, currentPage: 10 });
    const next = screen.getByTitle("Next Page") as HTMLButtonElement;
    const last = screen.getByTitle("Last Page") as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    expect(last.disabled).toBe(true);
  });

  it("Last 클릭은 totalPages를 전달한다", () => {
    const { onPageChange } = renderPaging({ totalPages: 7, currentPage: 1 });
    fireEvent.click(screen.getByTitle("Last Page"));
    expect(onPageChange).toHaveBeenCalledWith(7);
  });
});
