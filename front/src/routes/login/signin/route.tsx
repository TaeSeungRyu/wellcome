import { createFileRoute, useRouter } from "@tanstack/react-router";
import useSigninHook from "./-/use.signin.hook";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputText from "@/components/form/input.text";
import type { InputOption } from "@/components/form";
import InputPassword from "@/components/form/input.password";
import { useToast } from "@/context/toast.context";
import { signinSchema } from "./-/signin.schema";
import { useAuth } from "@/context/auth.context";

export const Route = createFileRoute("/login/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { isPending, error, mutateAsync, data: signinResult } = useSigninHook();
  const router = useRouter();
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(signinSchema),
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
    await mutateAsync({ username, password });
  };
  useEffect(() => {
    if (error) {
      showToast(error?.message || "데이터를 확인하여 주세요.", {
        type: "error",
      });
    } else if (signinResult) {
      showToast("로그인에 성공하였습니다.\n2초뒤 이동합니다.", {
        type: "success",
      });
      setTimeout(() => {
        router.navigate({
          to: "/home/dashboard",
        });
      }, 2000);
    }
  }, [signinResult, error]);

  useEffect(() => {
    logout(true);
  }, []);

  return (
    <div className="p-3 w-full flex flex-col gap-3 justify-center items-center">
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
          로그인
        </button>
      </form>
      <div className="my-2"></div>
      {/* 로딩 오버레이 */}
      {isPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] transition-all">
          <div className="flex flex-col items-center gap-2">
            {/* 간단한 스피너 아이콘 (Tailwind) */}
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-600 font-medium">
              데이터를 불러오는 중...
            </span>
          </div>
        </div>
      )}{" "}
    </div>
  );
}
