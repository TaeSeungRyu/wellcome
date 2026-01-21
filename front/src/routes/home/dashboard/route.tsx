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
    <div>
      <div>Dashboard Page</div>
      {/* 로딩 오버레이 */}
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] transition-all">
          <div className="flex flex-col items-center gap-2">
            {/* 간단한 스피너 아이콘 (Tailwind) */}
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-600 font-medium">
              데이터를 불러오는 중...
            </span>
          </div>
        </div>
      )}
      <div className="p-3 w-full flex flex-col gap-3 justify-center items-center">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => {
            runModal();
          }}
        >
          데이터 등록
        </button>

        <div className="w-4/6">
          <TableComponent
            columns={columns}
            data={data}
            onRowClick={onRowClick}
          ></TableComponent>
        </div>
        <PagingComponent
          totalPages={totalPages}
          currentPage={currentPageFromApi}
          size={size}
          onPageChange={onPageChange}
        ></PagingComponent>
      </div>
    </div>
  );
}
