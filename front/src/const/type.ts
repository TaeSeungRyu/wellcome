export interface Column<T> {
  key: keyof T;
  header: string;
  width?: string; // Tailwind col-span or fixed width
  onHeaderClick?: (key: keyof T) => void;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface GridTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}
