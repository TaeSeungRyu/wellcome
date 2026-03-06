import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuthDetail, useAuthForm } from "./-/use.auth.hook";
import InputText from "@/components/form/input.text";
import { useModal } from "@/context/modal.context";
import { useToast } from "@/context/toast.context";
import type { Auth, AuthForm } from "./-/auth.schema";
import { useEffect } from "react";

export const Route = createFileRoute("/home/auth/alter")({
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
  const { showToast } = useToast();
  const fields: (keyof AuthForm)[] = ["code", "name", "desc"];
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useAuthForm();

  useEffect(() => {
    if (info?.data) {
      setValue("code", info.data.code);
      setValue("name", info.data.name);
      setValue("desc", info.data.desc);
    }
  }, [info?.data]);

  const toAlter = (data: Auth) => {
    console.log("Alter Data:", data);
  };

  const onSubmit = (data: Auth) => {
    openModal({
      content: (
        <div>
          <h2>확인</h2>
          <p>권한을 수정 하시겠습니까?</p>
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
            수정
          </button>
        </div>
      ),
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded-xl"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <InputText
              name={fields[0]}
              label="코드명"
              register={register}
              setValue={setValue}
              errors={errors}
              watch={watch}
              option={{
                disabled: true,
              }}
            />
          </div>
          <div className="relative">
            <InputText
              name={fields[1]}
              label="이름"
              register={register}
              setValue={setValue}
              errors={errors}
              watch={watch}
            />
          </div>
          <div className="relative">
            <InputText
              name={fields[2]}
              label="설명"
              register={register}
              setValue={setValue}
              errors={errors}
              watch={watch}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            변경
          </button>
        </div>
      </form>
    </div>
  );
}
