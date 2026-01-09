import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useBoardForm, useBoardListHook } from "./-/useBoardHook";
import { PagingComponent } from "@/components/ui/pagingComponent";
import { useModal } from "@/context/modalContext";
import InputText from "@/components/form/inputText";
import { type BoardForm } from "./-/board.schema";

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

  const fields: (keyof BoardForm)[] = ["title", "contents"];
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useBoardForm();

  const onSubmit = (data: any) => {
    console.log("Form Data Submitted:", data);
  };

  const clearDataFields = () => {
    fields.forEach((field) => setValue(field, ""));
  };

  return (
    <div>
      <div>Dashboard Page</div>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() =>
          openModal({
            options: {
              afterClose: () => clearDataFields(),
            },
            content: (
              <div>
                <h2>데이터 등록</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <InputText
                    name={fields[0]}
                    label="제목"
                    placeholder="제목을 입력하세요"
                    register={register}
                    setValue={setValue}
                    errors={errors}
                  />
                  <InputText
                    name={fields[1]}
                    label="내용"
                    placeholder="내용을 입력하세요"
                    register={register}
                    setValue={setValue}
                    errors={errors}
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    type="submit"
                  >
                    제출
                  </button>
                </form>
              </div>
            ),
          })
        }
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
