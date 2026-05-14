import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TableComponent } from "./Table";
import type { Column } from "@/const/type";

interface Row {
  _id: string;
  name: string;
  age: number;
}

const columns: Column<Row>[] = [
  { key: "name", header: "이름" },
  { key: "age", header: "나이" },
];

const data: Row[] = [
  { _id: "1", name: "홍길동", age: 30 },
  { _id: "2", name: "임꺽정", age: 40 },
];

describe("TableComponent", () => {
  it("헤더와 모든 행의 데이터를 표시한다", () => {
    render(<TableComponent columns={columns} data={data} />);
    expect(screen.getByText("이름")).toBeDefined();
    expect(screen.getByText("나이")).toBeDefined();
    expect(screen.getByText("홍길동")).toBeDefined();
    expect(screen.getByText("임꺽정")).toBeDefined();
    expect(screen.getByText("30")).toBeDefined();
    expect(screen.getByText("40")).toBeDefined();
  });

  it("render 함수가 있으면 그 결과를 표시한다", () => {
    const customColumns: Column<Row>[] = [
      {
        key: "name",
        header: "이름",
        render: (value) => <strong data-testid="custom">★{value}</strong>,
      },
    ];
    render(<TableComponent columns={customColumns} data={data} />);
    expect(screen.getAllByTestId("custom").map((el) => el.textContent)).toEqual([
      "★홍길동",
      "★임꺽정",
    ]);
  });

  it("onRowClick이 행 클릭 시 해당 row 객체로 호출된다", () => {
    const onRowClick = vi.fn();
    render(
      <TableComponent columns={columns} data={data} onRowClick={onRowClick} />,
    );
    fireEvent.click(screen.getByText("임꺽정"));
    expect(onRowClick).toHaveBeenCalledWith(data[1]);
  });

  it("onHeaderClick이 있으면 헤더 클릭 시 해당 key로 호출된다", () => {
    const onHeaderClick = vi.fn();
    const sortableColumns: Column<Row>[] = [
      { key: "name", header: "이름", onHeaderClick },
      { key: "age", header: "나이" },
    ];
    render(<TableComponent columns={sortableColumns} data={data} />);
    fireEvent.click(screen.getByText("이름"));
    expect(onHeaderClick).toHaveBeenCalledWith("name");
  });

  it("data가 비어있으면 행은 렌더링되지 않는다", () => {
    render(<TableComponent columns={columns} data={[]} />);
    expect(screen.queryByText("홍길동")).toBeNull();
    expect(screen.queryByText("임꺽정")).toBeNull();
    // 헤더는 그대로
    expect(screen.getByText("이름")).toBeDefined();
  });
});
