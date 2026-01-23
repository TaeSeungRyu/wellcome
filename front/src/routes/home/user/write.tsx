import { createFileRoute } from "@tanstack/react-router";
import { useUserAuthListHook, useUserForm } from "./-/use.user.hook";
import InputText from "@/components/form/input.text";
import type { UserForm } from "./-/user.schema";
import InputCheckbox from "@/components/form/input.check";
import { useEffect } from "react";
import InputPassword from "@/components/form/input.password";
import { formatPhoneNumber } from "@/services/util";

export const Route = createFileRoute("/home/user/write")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: authList } = useUserAuthListHook();

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
    console.log("Form Data:", data);
  };

  const phoneValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setTimeout(() => setValue("phone", formatted), 1); //BAD 코드..
  };

  useEffect(() => {
    setValue("role", authList);
    console.log("authList:", authList);
  }, [authList, setValue]);

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
