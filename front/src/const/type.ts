export interface Column<T> {
  key: keyof T;
  header: string;
  width?: string; // Tailwind col-span or fixed width
  onHeaderClick?: (key: keyof T) => void;
  // render 콜백의 value는 동적 셀 표시 용도라 any로 둔다.
  // 호출 측에서 타입 가드/캐스팅을 적용해 사용한다.
  render?: (value: any, row: T) => React.ReactNode;
}

export interface GridTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}
