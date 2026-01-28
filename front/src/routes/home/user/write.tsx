import { createFileRoute } from "@tanstack/react-router";
import {
  useCheckExistUser,
  useUserAlter,
  useUserAuthListHook,
  useUserForm,
} from "./-/use.user.hook";
import InputText from "@/components/form/input.text";
import type { UserForm } from "./-/user.schema";
import InputCheckbox from "@/components/form/input.check";
import { useEffect, useState } from "react";
import InputPassword from "@/components/form/input.password";
import { formatPhoneNumber } from "@/services/util";
import { useModal } from "@/context/modal.context";
import { useToast } from "@/context/toast.context";

export const Route = createFileRoute("/home/user/write")({
  component: RouteComponent,
});

function RouteComponent() {
  const { openModal, closeTopModal: closeConfirmModal } = useModal();
  const { data: authList } = useUserAuthListHook();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useUserForm();

  const [isCheckingExistence, setIsCheckingExistence] = useState(false);
  const { mutateAsync: toAlter, data: alterData } = useUserAlter();
  const { refetch: refetchCheckExistUser } = useCheckExistUser(
    watch("username"),
  );
  const { showToast } = useToast();
  const fields: (keyof UserForm)[] = [
    "username",
    "password",
    "name",
    "email",
    "phone",
    "role",
  ];
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

  const phoneValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone", formatted);
  };

  useEffect(() => {
    setValue("role", authList);
  }, [authList, setValue]);

  useEffect(() => {
    if (alterData) {
      closeConfirmModal();
      showToast(alterData?.message || "완료 하였습니다.", {
        type: "success",
      });
    }
  }, [alterData]);

  const askCheckUserExist = async () => {
    if (!username) {
      showToast("아이디를 입력하세요.", { type: "error" });
      return;
    }

    // refetch의 결과를 직접 받아서 처리
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
    <div className="py-8">
      <form
        className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4 text-lg font-semibold">사용자 등록</div>
        <InputText
          name={fields[0]}
          label="아이디"
          placeholder="아이디를 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <button
          className="tailwind-blue-button"
          type="button"
          onClick={askCheckUserExist}
        >
          중복 확인
        </button>
        <InputPassword
          name={fields[1]}
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <InputText
          name={fields[2]}
          label="이름"
          placeholder="이름을 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <InputText
          name={fields[3]}
          label="이메일"
          placeholder="이메일을 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <InputText
          name={fields[4]}
          label="전화번호"
          placeholder="전화번호를 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
          maxLength={13}
          option={{
            onChange: (e) => phoneValueHandler(e),
          }}
        />
        <InputCheckbox
          name={fields[5]}
          label="역할 선택"
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          option={{ direction: "row" }}
        ></InputCheckbox>
        <button
          className="tailwind-blue-button"
          type="submit"
          disabled={!isCheckingExistence}
        >
          등록
        </button>
      </form>
    </div>
  );
}
