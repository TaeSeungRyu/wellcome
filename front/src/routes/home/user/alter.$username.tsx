import { createFileRoute } from "@tanstack/react-router";
import {
  useUserAlter,
  useUserAuthListHook,
  useUserForm,
} from "./-/use.user.hook";

import { useToast } from "@/context/toast.context";
import type { UserForm } from "./-/user.schema";
import { UserFormView } from "./-/form.view";
import { useEffect, type BaseSyntheticEvent } from "react";
import { useModal } from "@/context/modal.context";

export const Route = createFileRoute("/home/user/alter/$username")({
  component: RouteComponent,
});

function RouteComponent() {
  const username = Route.useParams().username;
  const { form, refetch } = useUserForm(username);
  const { openModal, closeTopModal: closeConfirmModal } = useModal();

  const { data: authList } = useUserAuthListHook();
  const { mutate: userAlterMutate, data: alterData } = useUserAlter();

  const { showToast } = useToast();
  const fields: (keyof UserForm)[] = [
    "username",
    "password",
    "name",
    "email",
    "phone",
    "role",
  ];

  const onSubmit = (
    data: any,
    e: BaseSyntheticEvent<object, any, any> | undefined,
  ) => {
    data.isUpdate = true;
    e?.preventDefault();
    e?.stopPropagation();
    // openModal({
    //   content: (
    //     <div>
    //       <h2>확인</h2>
    //       <p>사용자를 수정 하시겠습니까?</p>
    //       <button
    //         className="bg-red-500 text-white px-4 py-2 rounded mr-2"
    //         onClick={closeConfirmModal}
    //       >
    //         취소
    //       </button>
    //       <button
    //         className="bg-blue-500 text-white px-4 py-2 rounded"
    //         onClick={() => userAlterMutate(data)}
    //       >
    //         수정
    //       </button>
    //     </div>
    //   ),
    // });
  };

  useEffect(() => {
    if (alterData?.result?.success) {
      showToast(alterData?.message || "완료 하였습니다.", {
        type: "success",
      });
      closeConfirmModal();
    }
  }, [alterData, showToast, closeConfirmModal]);

  return (
    <div className="py-2">
      <UserFormView form={form} onSubmit={onSubmit} submitLabel="변경" isEdit />
    </div>
  );
}
