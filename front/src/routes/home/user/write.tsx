import { createFileRoute } from "@tanstack/react-router";
import {
  useCheckExistUser,
  useUserAlter,
  useUserForm,
} from "./-/use.user.hook";
import { useEffect, useState } from "react";
import { useModal } from "@/context/modal.context";
import { useToast } from "@/context/toast.context";
import { UserFormView } from "./-/form.view";

export const Route = createFileRoute("/home/user/write")({
  component: RouteComponent,
});

function RouteComponent() {
  const { openModal, closeTopModal: closeConfirmModal } = useModal();
  const { form } = useUserForm();
  const { watch, setError, clearErrors } = form;
  const [isCheckingExistence, setIsCheckingExistence] = useState(false);
  const { mutateAsync: toAlter, data: alterData } = useUserAlter();
  const { refetch: refetchCheckExistUser } = useCheckExistUser(
    watch("username"),
  );
  const { showToast } = useToast();

  const onSubmit = (data: any) => {
    openModal({
      content: (
        <div>
          <h2>확인</h2>
          <p>사용자를 등록 하시겠습니까?</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={closeConfirmModal}
          >
            취소
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => toAlter(data)}
          >
            등록
          </button>
        </div>
      ),
    });
  };
  useEffect(() => {
    if (alterData) {
      closeConfirmModal();
      showToast(alterData?.message || "완료 하였습니다.", {
        type: "success",
      });
    }
  }, [alterData]);

  const askCheckUserExist = async () => {
    console.log("check user exist called");
    if (!username) {
      showToast("아이디를 입력하세요.", { type: "error" });
      return;
    }
    const { data: latestData } = await refetchCheckExistUser();
    if (!latestData?.data) return;
    if (latestData.data.exists) {
      showToast("이미 존재하는 아이디입니다.", { type: "error" });
      setError("username", { message: "이미 존재하는 아이디입니다." });
      setIsCheckingExistence(false);
    } else {
      showToast("사용 가능한 아이디입니다.", { type: "success" });
      clearErrors("username");
      setIsCheckingExistence(true);
    }
  };

  const username = watch("username");

  useEffect(() => {
    setIsCheckingExistence(false);
  }, [username]);

  return (
    <div className="py-2">
      <UserFormView
        form={form}
        onSubmit={onSubmit}
        submitLabel="등록"
        isCheckingExistence={isCheckingExistence}
        extraButtons={
          <button
            type="button"
            onClick={() => askCheckUserExist()}
            className="tailwind-blue-button mt-2"
          >
            중복 확인
          </button>
        }
      />
    </div>
  );
}
