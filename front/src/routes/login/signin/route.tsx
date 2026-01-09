import { createFileRoute, useRouter } from "@tanstack/react-router";
import useSigninHook from "./-/useSigninHook";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputText from "@/components/form/inputText";
import type { InputOption } from "@/components/form";
import InputPassword from "@/components/form/inputPassword";
import { useToast } from "@/context/toastContext";

export const Route = createFileRoute("/login/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { showToast } = useToast();
  const { result, signin, isPending, error, errorString } = useSigninHook();
  const router = useRouter();
  const schema = z.object({
    myText: z.string().min(3, "텍스트는 최소 3자 이상이어야 합니다."),
    myPassword: z.string().min(3, "비밀번호는 최소 3자 이상이어야 합니다."),
  });
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {},
  });

  const [option, _] = useState<InputOption>({
    style: {},
    offRightIcon: false,
    disabled: false,
  });

  const onSubmit = async (_: any) => {
    const username = getValues("myText");
    const password = getValues("myPassword");
    await signin(username, password);
  };
  useEffect(() => {
    if (error) {
      showToast(errorString || "데이터를 확인하여 주세요.", { type: "error" });
    } else if (result) {
      router.navigate({
        to: "/home/dashboard",
      });
    }
  }, [result, error]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          name="myText"
          label="my text 입력 테스트"
          placeholder="비밀번호를 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
          option={option}
        />

        <InputPassword
          name="myPassword"
          label="my password 입력 테스트"
          placeholder="비밀번호를 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          type="submit"
        >
          제출
        </button>
      </form>

      <div className="my-2"></div>

      <div className="text-blue-400 text-3xl font-bold underline">
        Hello "/login/signin"! -- {result} --{" "}
      </div>
      <div>is pending : {isPending ? "Yes" : "No"}</div>
    </>
  );
}
