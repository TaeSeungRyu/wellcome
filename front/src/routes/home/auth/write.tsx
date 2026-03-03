import InputText from "@/components/form/input.text";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuthAlter, useAuthCodeExist, useAuthForm } from "./-/use.auth.hook";
import type { Auth, AuthForm } from "./-/auth.schema";
import { useModal } from "@/context/modal.context";
import { useEffect, useState } from "react";
import { useToast } from "@/context/toast.context";

export const Route = createFileRoute("/home/auth/write")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { openModal, closeTopModal: closeConfirmModal } = useModal();
  const { showToast } = useToast();
  const fields: (keyof AuthForm)[] = ["code", "name", "desc"];
  const { mutateAsync } = useAuthAlter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useAuthForm();
  const { refetch: requestCodeExist } = useAuthCodeExist(watch("code"));
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  useEffect(() => {
    setIsCodeVerified(false);
  }, [watch("code")]);
  const toAlter = (data: Auth) => {
    console.log("Alter Data:", data);
    mutateAsync(data)
      .then((res) => {
        if (res?.result?.success) {
          router.history.go(-1);
          showToast(res.message || "등록 하였습니다.", {
            type: "success",
          });
        } else {
          showToast(res?.message || "등록에 실패하였습니다.", {
            type: "error",
          });
        }
        closeConfirmModal();
      })
      .catch((err) => {
        showToast(err?.message || "등록 중 오류가 발생하였습니다.", {
          type: "error",
        });
        closeConfirmModal();
      });
  };

  const onSubmit = (data: Auth) => {
    if (!isCodeVerified) {
      showToast("코드 중복 확인을 해주세요.", {
        type: "error",
      });
      return;
    }
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
    if (!watch("code")) return;

    try {
      const { data } = await requestCodeExist();
      if (!data?.success) {
        showToast("이미 존재하는 코드입니다.", {
          type: "error",
        });
        setIsCodeVerified(false);
      } else {
        showToast("사용 가능한 코드입니다.", {
          type: "success",
        });
        setIsCodeVerified(true);
      }
    } catch (err) {
      console.error(err);
      setIsCodeVerified(false);
    }
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
            onClick={checkCodeExist}
            disabled={isCodeVerified}
            className={`
    px-5 py-1 rounded w-40 h-11 mt-2 text-white transition-colors
    ${
      errors.code
        ? "cursor-not-allowed opacity-50"
        : isCodeVerified
          ? "bg-green-700 cursor-default"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }
  `}
          >
            {isCodeVerified ? "확인 완료" : "중복 확인"}
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
