import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBoardForm, useBoardListHook } from "./-/useBoardHook";
import { PagingComponent } from "@/components/ui/pagingComponent";
import { useModal } from "@/context/modalContext";
import { BoardModalComponent } from "./-/board.modal";
import { FormProvider } from "react-hook-form";
import { BoardModalComponent222 } from "./-/board.modal2";

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

  const { openModal, closeTopModal } = useModal();
  const methods = useBoardForm();
  const [testShow, setTestShow] = useState(false);
  return (
    <div>
      <div>Dashboard Page</div>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => setTestShow(!testShow)}
      >
        {testShow ? "Hide" : "Show"}
      </button>
      {testShow && (
        <div className="m-3">
          <FormProvider {...methods}>
            <BoardModalComponent222></BoardModalComponent222>
          </FormProvider>
        </div>
      )}

      <button
        className="px-3 py-1 bg-blue-500 text-white rounded my-3 mx-2"
        onClick={() => {
          openModal({
            options: {
              afterClose: () => {},
            },
            content: (
              <BoardModalComponent
                closeTopModal={closeTopModal}
                search={search}
              ></BoardModalComponent>
            ),
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
