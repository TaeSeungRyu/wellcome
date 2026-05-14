import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingComponent } from "./Loading";

describe("LoadingComponent", () => {
  it("text가 없으면 기본 문구를 표시한다", () => {
    render(<LoadingComponent />);
    expect(screen.getByText("데이터를 불러오는 중...")).toBeDefined();
  });

  it("text를 전달하면 해당 문구를 표시한다", () => {
    render(<LoadingComponent text="저장 중..." />);
    expect(screen.getByText("저장 중...")).toBeDefined();
  });
});
