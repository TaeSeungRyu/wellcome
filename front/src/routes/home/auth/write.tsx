import InputText from "@/components/form/input.text";
import { createFileRoute } from "@tanstack/react-router";
import { useAuthCodeExist, useAuthForm } from "./-/use.auth.hook";
import type { Auth, AuthForm } from "./-/auth.schema";
import { useModal } from "@/context/modal.context";

export const Route = createFileRoute("/home/auth/write")({
  component: RouteComponent,
});

function RouteComponent() {
  const { openModal, closeTopModal: closeConfirmModal } = useModal();
  const fields: (keyof AuthForm)[] = ["code", "name", "desc"];
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useAuthForm();
  const { refetch: requestCodeExist } = useAuthCodeExist(watch("code"));

  const toAlter = (data: Auth) => {
    console.log("Alter Data:", data);
  };

  const onSubmit = (data: Auth) => {
    openModal({
      content: (
        <div>
          <h2>확인</h2>
          <p>권한을 등록 하시겠습니까?</p>
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
  const checkCodeExist = async () => {
    requestCodeExist()
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
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
            option={{}}
          />
          <button
            type="button"
            className={`bg-gray-200 text-gray-700 px-5 py-1 rounded w-40 h-11 mt-2 ${errors.code ? "cursor-not-allowed opacity-50 !mt-0 mb-4" : "hover:bg-gray-300"}`}
            onClick={checkCodeExist}
          >
            중복 확인
          </button>
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
          저장
        </button>
      </div>
    </form>
  );
}
