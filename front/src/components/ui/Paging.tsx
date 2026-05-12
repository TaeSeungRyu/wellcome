import "../css/paging.css";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: number; // 중앙 페이지 개수 (기본: 5)
}

const _getPageRange = (
  currentPage: number,
  totalPages: number,
  size: number,
) => {
  const cp = Math.max(1, Math.min(currentPage, totalPages));
  const tp = Math.max(1, totalPages);
  let halfLeft = Math.floor((size - 1) / 2);
  let halfRight = size - 1 - halfLeft;
  let start = cp - halfLeft;
  let end = cp + halfRight;
  // start < 1 보정
  if (start < 1) {
    start = 1;
    end = Math.min(tp, start + size - 1);
  }
  // end > totalPages 보정
  if (end > tp) {
    end = tp;
    start = Math.max(1, end - size + 1);
  }
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
};

export const PagingComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  size = 5,
}: PaginationProps) => {
  const pages = _getPageRange(currentPage, totalPages, size);
  const cp = currentPage;
  const tp = totalPages;
  const baseButtonClass =
    "flex items-center justify-center min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed";
  const normalButtonClass =
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent";
  const activeButtonClass =
    "bg-blue-600 text-white shadow-md shadow-blue-100 border border-blue-600";
  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      {/* 처음으로 */}
      <button
        disabled={cp === 1}
        onClick={() => onPageChange(1)}
        className={`${baseButtonClass} ${normalButtonClass}`}
        title="First Page"
      >
        <span className="sr-only">First</span>
        &laquo;
      </button>

      {/* 이전으로 */}
      <button
        disabled={cp === 1}
        onClick={() => onPageChange(cp - 1)}
        className={`${baseButtonClass} ${normalButtonClass} mr-1`}
        title="Previous Page"
      >
        <span className="sr-only">Previous</span>
        &lt;
      </button>

      {/* 페이지 번호 리스트 */}
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${baseButtonClass} ${p === cp ? activeButtonClass : normalButtonClass}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* 다음으로 */}
      <button
        disabled={cp === tp || tp === 0}
        onClick={() => onPageChange(cp + 1)}
        className={`${baseButtonClass} ${normalButtonClass} ml-1`}
        title="Next Page"
      >
        <span className="sr-only">Next</span>
        &gt;
      </button>

      {/* 끝으로 */}
      <button
        disabled={cp === tp || tp === 0}
        onClick={() => onPageChange(tp)}
        className={`${baseButtonClass} ${normalButtonClass}`}
        title="Last Page"
      >
        <span className="sr-only">Last</span>
        &raquo;
      </button>
    </div>
  );
};
