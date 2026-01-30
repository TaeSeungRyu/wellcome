// components/domain/user/UserFormView.tsx

import InputText from "@/components/form/input.text";
import InputPassword from "@/components/form/input.password";
import InputCheckbox from "@/components/form/input.check";
import { formatPhoneNumber } from "@/services/util";
import type { UserForm } from "./user.schema";
import type { UseFormReturn } from "react-hook-form";
import type { BaseSyntheticEvent } from "react";

interface UserFormViewProps {
  form: UseFormReturn<UserForm | any>; // 타입이 섞여있다면 any 혹은 공통 타입 사용
  onSubmit: (
    data: any,
    e: BaseSyntheticEvent<object, any, any> | undefined,
  ) => void;
  submitLabel: string;
  isEdit?: boolean;
  extraButtons?: React.ReactNode; // 중복 확인 버튼 등을 위한 자리
  isCheckingExistence?: boolean; // 중복 확인 로딩 상태
}

export const UserFormView = ({
  form,
  onSubmit,
  submitLabel,
  isEdit,
  extraButtons,
  isCheckingExistence,
}: UserFormViewProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const fields: (keyof UserForm)[] = [
    "username",
    "password",
    "name",
    "email",
    "phone",
    "role",
  ];

  const phoneValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("phone", formatPhoneNumber(e.target.value));
  };

  return (
    <form
      className="p-4 max-w-2xl mx-auto bg-white shadow-md rounded-xl"
      onSubmit={handleSubmit((data, e) => onSubmit(data, e))}
    >
      <div className="mb-2 text-lg font-semibold">
        사용자 {isEdit ? "수정" : "등록"}
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <InputText
            name={fields[0]}
            label="아이디"
            register={register}
            setValue={setValue}
            errors={errors}
            option={{ disabled: isEdit }}
            watch={watch}
          />
          {extraButtons}
        </div>

        <InputPassword
          name={fields[1]}
          label="비밀번호"
          register={register}
          setValue={setValue}
          errors={errors}
          watch={watch}
        />
        <InputText
          name={fields[2]}
          label="이름"
          register={register}
          setValue={setValue}
          errors={errors}
          watch={watch}
        />
        <InputText
          name={fields[3]}
          label="이메일"
          register={register}
          setValue={setValue}
          errors={errors}
          watch={watch}
        />

        <InputText
          name={fields[4]}
          label="전화번호"
          register={register}
          setValue={setValue}
          errors={errors}
          maxLength={13}
          option={{ onChange: phoneValueHandler }}
          watch={watch}
        />

        <InputCheckbox
          name={fields[5]}
          label="역할 선택"
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          option={{ direction: "row" }}
        />

        <button
          className="tailwind-blue-button"
          type="submit"
          disabled={isCheckingExistence === false}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
