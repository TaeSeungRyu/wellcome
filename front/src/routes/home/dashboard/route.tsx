import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBoardListHook } from "./-/use.board.hook";
import { PagingComponent } from "@/components/ui/paging.component";
import { useModal } from "@/context/modal.context";
import { BoardFormComponent } from "./-/board.form";
import { TableComponent } from "@/components/ui/table.component";
import type { Column } from "@/const/type";
import type { Board, Comment } from "./-/board.schema";
import { useBoardState } from "@/state/useBoardState";

export const Route = createFileRoute("/home/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { openModal, closeTopModal } = useModal();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(3);
  const {
    isFetching,
    data: result,
    refetch: search,
  } = useBoardListHook(currentPage, size);

  const sharedValue = useBoardState((state) => state.sharedValue);
  const currentPageFromApi = result?.data?.page || 1;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    search();
  }, [currentPage, size]);

  const columns: Column<Board>[] = [
    {
      key: "title",
      header: "제목",
      render(value) {
        return <strong className="text-red-300">{value as string}</strong>;
      },
    },
    {
      key: "contents",
      header: "내용",
    },
    { key: "username", header: "작성자" },
    {
      key: "createDate",
      header: "작성일",
    },
  ];
  const [data, setData] = useState<Board[]>([]);
  const onRowClick = (row: Board) => {
    runModal(row._id, row.comments);
  };

  useEffect(() => {
    if (result?.data) {
      setSize(result?.data?.limit);
      setTotalPages(Math.ceil(result?.data?.total / result?.data?.limit));
      setData(result?.data?.boards || []);
    }
  }, [result?.data]);

  const runModal = (_id?: string, comments?: Comment[]) => {
    openModal({
      options: {
        afterClose: () => {},
      },
      content: (
        <>
          <BoardFormComponent
            closeTopModal={closeTopModal}
            search={search}
            _id={_id}
            comments={comments}
          ></BoardFormComponent>
        </>
      ),
    });
  };

  useEffect(() => {
    if (sharedValue) {
      search();
    }
  }, [sharedValue]);
  return (
    <div className=" bg-slate-50/50 p-6">
      {/* 상단 헤더 영역 */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            게시글을 관리하고 실시간 현황을 확인하세요.
          </p>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95"
          onClick={() => runModal()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          새 데이터 등록
        </button>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* 로딩 오버레이: 더 부드러운 블러 효과 */}
        {isFetching && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/40 backdrop-blur-sm rounded-2xl transition-all">
            <div className="flex flex-col items-center gap-3 p-6 bg-white shadow-xl rounded-2xl border border-slate-100">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-600 font-medium">
                데이터를 동기화 중입니다...
              </span>
            </div>
          </div>
        )}

        {/* 테이블 컨테이너: 카드 스타일 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-sm font-semibold text-slate-700">
              게시글 목록{" "}
              <span className="ml-2 text-blue-500 font-normal">
                {result?.data?.total || 0}명
              </span>
            </h3>
          </div>

          <div className="p-1">
            {" "}
            {/* 테이블 내부 여백 조절 */}
            <TableComponent
              columns={columns}
              data={data}
              onRowClick={onRowClick}
            />
          </div>

          {/* 하단 페이징 영역: 테이블과 일체형으로 구성 */}
          <div className="bg-slate-50/50 border-t border-slate-100 py-4 flex justify-center">
            <PagingComponent
              totalPages={totalPages}
              currentPage={currentPageFromApi}
              size={size}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
