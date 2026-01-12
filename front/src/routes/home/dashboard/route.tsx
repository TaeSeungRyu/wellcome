import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBoardListHook } from "./-/useBoardHook";
import { PagingComponent } from "@/components/ui/pagingComponent";
import { useModal } from "@/context/modalContext";
import { BoardModalComponent } from "./-/board.modal";
import { TableComponent } from "@/components/ui/tableComponent";
import type { Column } from "@/const/type";
import type { Board } from "./-/board.schema";

export const Route = createFileRoute("/home/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  //const router = useRouter();

  const { openModal, closeTopModal } = useModal();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(3);
  const {
    isPending,
    data: result,
    refetch: search,
  } = useBoardListHook(currentPage, size);
  const onPageChange = (page: number) => {
    console.log("Page changed to:", page);
    setCurrentPage(page);
  };
  useEffect(() => {
    search();
  }, [currentPage, size]);

  const columns: Column<Board>[] = [
    {
      key: "title",
      header: "제목",
      render(value, row) {
        return <strong className="text-red-300">{value}</strong>;
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
    //console.log("Row clicked:", row);
    runModal(row._id);
  };

  useEffect(() => {
    if (result?.data) {
      setSize(result?.data?.limit);
      setTotalPages(Math.ceil(result?.data?.total / result?.data?.limit));
      setData(result?.data?.boards || []);
    }
  }, [result?.data]);

  const runModal = (_id?: string) => {
    openModal({
      options: {
        afterClose: () => {},
      },
      content: (
        <BoardModalComponent
          closeTopModal={closeTopModal}
          search={search}
          _id={_id}
        ></BoardModalComponent>
      ),
    });
  };

  return (
    <div>
      <div>Dashboard Page</div>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded my-3 mx-2"
        onClick={() => {
          runModal();
        }}
      >
        데이터 등록
      </button>
      {isPending && <div>Loading...</div>}
      <TableComponent
        columns={columns}
        data={data}
        onRowClick={onRowClick}
      ></TableComponent>
      {result && (
        <div>
          <h2>Board List:</h2>
          <ul>
            {result?.data?.boards?.map((board: any) => (
              <li key={board._id}>{board.title}</li>
            ))}
          </ul>
        </div>
      )}

      <PagingComponent
        totalPages={totalPages}
        currentPage={currentPage}
        size={size}
        onPageChange={onPageChange}
      ></PagingComponent>
    </div>
  );
}
