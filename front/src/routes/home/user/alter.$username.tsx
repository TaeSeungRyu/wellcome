import { createFileRoute } from "@tanstack/react-router";
import { useUserForm } from "./-/use.user.hook";
import InputCheckbox from "@/components/form/input.check";
import InputText from "@/components/form/input.text";
import InputPassword from "@/components/form/input.password";
import { useToast } from "@/context/toast.context";
import type { UserForm } from "./-/user.schema";
import { formatPhoneNumber } from "@/services/util";

export const Route = createFileRoute("/home/user/alter/$username")({
  component: RouteComponent,
});

function RouteComponent() {
  const username = Route.useParams().username;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useUserForm(username);
  const { showToast } = useToast();
  const fields: (keyof UserForm)[] = [
    "username",
    "password",
    "name",
    "email",
    "phone",
    "role",
  ];
  const phoneValueHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone", formatted);
  };

  const onSubmit = (data: any) => {};

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
          option={{
            disabled: true,
          }}
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
          변경
        </button>
      </form>
    </div>
  );
}
