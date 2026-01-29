import { createFileRoute } from "@tanstack/react-router";
import { useUserAuthListHook, useUserForm } from "./-/use.user.hook";
import InputCheckbox from "@/components/form/input.check";
import InputText from "@/components/form/input.text";
import InputPassword from "@/components/form/input.password";
import { useToast } from "@/context/toast.context";
import type { UserForm } from "./-/user.schema";
import { formatPhoneNumber } from "@/services/util";
import { UserFormView } from "./-/form.view";
import { useEffect, useMemo } from "react";

export const Route = createFileRoute("/home/user/alter/$username")({
  component: RouteComponent,
});

function RouteComponent() {
  const username = Route.useParams().username;
  const form = useUserForm(username);
  const { data: authList } = useUserAuthListHook();

  const { setValue, getValues } = form;

  const { showToast } = useToast();
  const fields: (keyof UserForm)[] = [
    "username",
    "password",
    "name",
    "email",
    "phone",
    "role",
  ];

  useEffect(() => {
    const currentRoles = getValues("role"); // 현재 폼의 role 값
    // 권한 목록과 유저의 권한 정보가 모두 존재할 때만 실행
    if (authList?.length > 0 && currentRoles?.length > 0) {
      const combinedRoles = authList.map((auth: any) => ({
        ...auth,
        selected: currentRoles.some((r: any) => r.value === auth.value),
      }));
      // 주의: 단순 비교를 통해 값이 같으면 업데이트하지 않음 (무한루프 방지)
      setValue("role", combinedRoles);
    }
  }, [authList, setValue]); // authList가 오면 딱 한 번 세팅

  const onSubmit = (data: any) => {};

  return (
    <div className="py-2">
      <UserFormView form={form} onSubmit={onSubmit} submitLabel="변경" isEdit />
    </div>
  );
}
