import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useUserAlter, useUserDetail } from "./-/use.user.hook";
import { useEffect } from "react";
import { useModal } from "@/context/modal.context";
import { useToast } from "@/context/toast.context";

export const Route = createFileRoute("/home/user/info")({
  component: RouteComponent,
  validateSearch: (search) => ({
    username: String(search.username || ""),
  }),
  beforeLoad: (context) => {
    const { username } = context.search;
    if (!username) {
      throw new Error("username is required");
    }
  },
});

function RouteComponent() {
  const router = useRouter();
  const { openModal, closeTopModal: closeConfirmModal } = useModal();
  const { showToast } = useToast();
  const { mutateAsync, data: deleteResult } = useUserAlter();
  const { username } = Route.useSearch();
  const { data: info } = useUserDetail(username);

  useEffect(() => {
    if (deleteResult) {
      closeConfirmModal();
      showToast(deleteResult?.message || "삭제 하였습니다.", {
        type: "success",
      });
      setTimeout(() => {
        router.navigate({
          to: "/home/user",
        });
      }, 100);
    }
  }, [deleteResult]);

  const runConfirmModal = () => {
    openModal({
      content: (
        <div>
          <h2>확인</h2>
          <p>사용자를 삭제 하시겠습니까?</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={closeConfirmModal}
          >
            취소
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => mutateAsync({ username, isDelete: true })}
          >
            삭제
          </button>
        </div>
      ),
    });
  };

  const moveAlterPage = () => {
    router.navigate({
      to: "/home/user/alter/$username",
      params: {
        username,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">사용자 정보</h2>
        </div>
        <div className="px-6 py-5 space-y-3 text-sm">
          <InfoRow label="아이디" value={info?.username} />
          <InfoRow label="이름" value={info?.name} />
          <InfoRow label="이메일" value={info?.email || "-"} />
          <InfoRow label="전화번호" value={info?.phone || "-"} />
          <InfoRow label="역할" value={info?.role?.join(", ") || "-"} />
          <InfoRow
            label="작성일"
            value={
              info?.createdAt ? new Date(info.createdAt).toLocaleString() : "-"
            }
          />
          <InfoRow
            label="수정일"
            value={
              info?.updatedAt ? new Date(info.updatedAt).toLocaleString() : "-"
            }
          />
        </div>

        <div className="px-6 flex gap-2 justify-end py-4 border-t border-gray-200">
          <button className="tailwind-blue-button" onClick={moveAlterPage}>
            정보 수정
          </button>
          <button className="tailwind-red-button" onClick={runConfirmModal}>
            사용자 삭제
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
