import type { GridTableProps } from "@/const/type";
export function TableComponent<T>({
  columns,
  data,
  onRowClick,
}: GridTableProps<T>) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="grid bg-gray-100 border-b text-sm font-semibold"
        style={gridStyle}
      >
        {columns.map((col) => (
          <div
            key={String(col.key)}
            onClick={() => col.onHeaderClick?.(col.key)}
            className={`
              px-3 py-2 flex items-center
              ${col.onHeaderClick ? "cursor-pointer select-none hover:bg-gray-200" : ""}
            `}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="divide-y">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid hover:bg-gray-50 cursor-pointer"
            style={gridStyle}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <div key={String(col.key)} className="px-3 py-2 text-sm">
                {col.render
                  ? col.render(row[col.key], row)
                  : String(row[col.key])}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
