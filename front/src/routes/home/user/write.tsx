import { createFileRoute } from "@tanstack/react-router";
import {
  useUserAlter,
  useUserAuthListHook,
  useUserForm,
} from "./-/use.user.hook";
import InputText from "@/components/form/input.text";
import type { UserForm } from "./-/user.schema";
import InputCheckbox from "@/components/form/input.check";
import { useEffect } from "react";
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
  const { mutateAsync: toAlter, data: alterData, error } = useUserAlter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    // isFetching,
    // isError,
  } = useUserForm();
  const fields: (keyof UserForm)[] = [
    "username",
    "password",
    "name",
    "email",
    "phone",
    "role",
  ];
  const onSubmit = (data: any) => {
    //TODO ;;; 리펙토링 필요, 컴포넌트 말고 훅에서 처리 필요
    const param = {
      ...data,
    };
    param.role = data.role
      .filter((role: any) => {
        return role.selected;
      })
      .map((role: any) => {
        return role.value;
      });
    if (param.phone === "") {
      delete param.phone;
    }
    if (param.email === "") {
      delete param.email;
    }
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
            onClick={() => toAlter(param)}
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

  useEffect(() => {
    if (error) {
      showToast(error?.message || "에러 발생", {
        type: "error",
        duration: 1000,
      });
      console.error("Error during mutation:", error);
    }
  }, [error]);

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
        <button className="tailwind-blue-button" type="submit">
          등록
        </button>
      </form>
    </div>
  );
}
