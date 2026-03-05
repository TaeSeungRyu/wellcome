import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuthAlter, useAuthDetail } from "./-/use.auth.hook";
import { useModal } from "@/context/modal.context";
import { useEffect } from "react";
import { useToast } from "@/context/toast.context";

export const Route = createFileRoute("/home/auth/info")({
  component: RouteComponent,
  beforeLoad: async ({ search }: { search: { id?: string } }) => {
    const { id } = search;
    if (!id) {
      throw new Error("ID가 필요합니다.");
    }
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: typeof search.id === "string" ? search.id : "",
    };
  },
});

function RouteComponent() {
  const router = useRouter();
  const { id } = Route.useSearch();
  const { data: info } = useAuthDetail(id);
  const { openModal, closeTopModal: closeConfirmModal } = useModal();
  const { mutateAsync, data: deleteResult } = useAuthAlter();
  const { showToast } = useToast();

  const runConfirmModal = () => {
    openModal({
      content: (
        <div>
          <h2>확인</h2>
          <p>권한 코드를 삭제 하시겠습니까?</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={closeConfirmModal}
          >
            취소
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => mutateAsync({ _id: id, isDelete: true })}
          >
            삭제
          </button>
        </div>
      ),
    });
  };

  useEffect(() => {
    if (deleteResult) {
      closeConfirmModal();
      showToast(deleteResult?.message || "삭제 하였습니다.", {
        type: "success",
      });
      setTimeout(() => {
        router.history.back();
      }, 100);
    }
  }, [deleteResult]);

  return (
    <div className="flex flex-col  p-4 max-w-2xl mx-auto bg-white shadow-md rounded-xl gap-4">
      <h1>권한 코드 상세 정보</h1>
      {info && (
        <>
          <div className="flex flex-col gap-4">
            <p>
              <strong>코드:</strong> {info.data?.code}
            </p>
            <p>
              <strong>이름:</strong> {info.data?.name}
            </p>
            <p>
              <strong>설명:</strong> {info.data?.desc}
            </p>
          </div>
          <div className="flex">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={runConfirmModal}
            >
              삭제
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              수정
            </button>
          </div>
        </>
      )}
    </div>
  );
}
