import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBoardForm, useBoardListHook } from "./-/useBoardHook";
import { PagingComponent } from "@/components/ui/pagingComponent";
import { useModal } from "@/context/modalContext";
import InputText from "@/components/form/inputText";
import { type BoardForm } from "./-/board.schema";
import { BoardModalComponent } from "./-/board.modal";

export const Route = createFileRoute("/home/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  //const router = useRouter();

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

  useEffect(() => {
    if (result?.data) {
      setSize(result?.data?.limit);
      setTotalPages(Math.ceil(result?.data?.total / result?.data?.limit));
    }
  }, [result?.data]);

  const { openModal } = useModal();

  return (
    <div>
      <div>Dashboard Page</div>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => {
          openModal({
            options: {
              afterClose: () => {},
            },
            content: <BoardModalComponent></BoardModalComponent>,
          });
        }}
      >
        run modal
      </button>
      {isPending && <div>Loading...</div>}
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
