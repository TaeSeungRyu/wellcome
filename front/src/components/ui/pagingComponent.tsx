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
  size: number
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

  return (
    <div className="paging-wrapper">
      <button
        disabled={cp === 1}
        onClick={() => onPageChange(1)}
        className="paging-button"
      >
        &laquo;
      </button>
      <button
        disabled={cp === 1}
        onClick={() => onPageChange(cp - 1)}
        className="paging-button"
      >
        &lt;
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`paging-button ${p === cp ? "active" : ""}`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={cp === tp}
        onClick={() => onPageChange(cp + 1)}
        className="paging-button"
      >
        &gt;
      </button>
      <button
        disabled={cp === tp}
        onClick={() => onPageChange(tp)}
        className="paging-button"
      >
        &raquo;
      </button>
    </div>
  );
};
