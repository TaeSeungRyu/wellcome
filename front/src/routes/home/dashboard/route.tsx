import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import useBoardListHook from "./-/useBoardHook";
import { PagingComponent } from "@/components/ui/pagingComponent";

export const Route = createFileRoute("/home/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(3);
  const { isPending, result, search } = useBoardListHook(currentPage, size);

  const onPageChange = (page: number) => {
    console.log("Page changed to:", page);
    setCurrentPage(page);
  };

  useEffect(() => {
    search();
  }, [currentPage, size]);

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    console.log(result?.data);
    setSize(result?.data?.limit);
    setTotalPages(Math.ceil(result?.data?.total / result?.data?.limit));
  }, [result?.data]);

  return (
    <div>
      <div>Dashboard Page</div>
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
