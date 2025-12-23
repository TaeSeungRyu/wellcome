import { createFileRoute, useRouter } from "@tanstack/react-router";
import useSigninHook from "./-/useSigninHook";
import useTestHook from "./-/usingTestHook";
import { useEffect, useState } from "react";
import { PagingComponent } from "@/components/ui/pagingComponent";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputText from "@/components/form/inputText";
import InputCommaNumber from "@/components/form/inputCommaNumber";
import InputNumber from "@/components/form/inputNumber";
import InputSelect from "@/components/form/inputSelect";
import InputRadio from "@/components/form/inputRadio";
import InputCheckbox from "@/components/form/inputCheck";
import InputToggle from "@/components/form/inputToggle";
import type { InputOption } from "@/components/form";
import InputPassword from "@/components/form/inputPassword";
import { useModal } from "@/context/modalContext";
import { useToast } from "@/context/toastContext";
import { TableComponent } from "@/components/ui/tableComponent";
import type { Column } from "@/const/type";

export const Route = createFileRoute("/login/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { result, signin, isPending } = useSigninHook();
  const {
    result: testResult,
    isPending: testIsPending,
    testTodo,
  } = useTestHook();
  const router = useRouter();
  const testSignIn = () => {
    console.log("Sign In Clicked");
    signin("baumtreasure", "admin1234!");
    // router.navigate({
    //   to: "/home/dashboard",
    // });
  };

  const testMove = () => {
    router.navigate({
      to: "/home/dashboard",
    });
  };

  ///////////////////////paging test///////////////////////
  const [page, setPage] = useState(1);
  const [totalPages, _] = useState(20);

  ///////////////////////form test///////////////////////
  const schema = z.object({
    myText: z.string().min(1, "값을 입력하세요"),
    myPassword: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    pureNum: z.number(),
    numTest: z.number().min(0, "숫자는 0 이상이어야 합니다."),
    dropDown: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        selected: z.boolean(),
      })
    ),
    radios: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        selected: z.boolean(),
      })
    ),
    checks: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        selected: z.boolean(),
      })
    ),
    myToggle: z.object({
      value: z.string(),
      selected: z.boolean(),
      leftLabel: z.string().optional(),
      rightLabel: z.string().optional(),
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    //getValues,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const allValues = watch("pureNum");
  useEffect(() => {
    // startDate가 변경될 때 endDate 최소값 설정
    console.log("현재 pureNum 값:", allValues);
  }, [allValues]);

  const onSubmit = (data: any) => {
    console.log("입력값:", data.text);
  };

  const [option, setOption] = useState<InputOption>({
    style: {},
    offRightIcon: false,
    disabled: false,
  });

  useEffect(() => {
    setValue("dropDown", [
      { value: "option1", label: "옵션 1", selected: false },
      { value: "option2", label: "옵션 2", selected: false },
    ]);

    setValue("radios", [
      { value: "asdf1234", label: "ffff1 ", selected: false },
      { value: "fff1234", label: "bbbb 2", selected: false },
    ]);

    setValue("checks", [
      { value: "check1", label: "체크박스 1", selected: false },
      { value: "check2", label: "체크박스 2", selected: false },
      { value: "check3", label: "체크박스 3", selected: false },
    ]);

    setTimeout(() => {
      option.style = {
        border: "1px solid blue",
        padding: "8px",
      };
      option.offRightIcon = true;
      option.disabled = true;
      option.className = "bg-red-200";
      option.labelClassName = "text-green-500";
      option.wrapperClassName = "bg-yellow-50";
      setOption({ ...option });
      setValue("myPassword", "initialValue");
    }, 2000);

    setValue("myToggle", {
      value: "11111",
      selected: false,
      leftLabel: "끔",
      rightLabel: "켬",
    });
  }, []);

  //모달
  const { openModal, closeTopModal } = useModal();

  //토스트
  const { showToast } = useToast();

  //테이블 샘플

  interface User {
    id: number;
    name: string;
    email: string;
  }
  const columns: Column<User>[] = [
    {
      key: "name",
      header: "이름",
      onHeaderClick: () => {},
      render(value, row) {
        console.log(row);
        return <strong className="text-red-300">{value}</strong>;
      },
    },
    {
      key: "email",
      header: "이메일",
      onHeaderClick: () => {},
    },
  ];
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    setData([
      { id: 1, name: "홍길동", email: "adf.com" },
      { id: 2, name: "김철수", email: "fff.com" },
    ]);
  }, []);

  return (
    <>
      <TableComponent columns={columns} data={data}></TableComponent>

      <button
        onClick={testMove}
        className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
      >
        페이지 이동 테스트
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          showToast("저장되었습니다", { type: "success" });
          showToast("동기화 중...", { type: "info" });
          showToast("에러 발생", { type: "error", duration: 1000 });
        }}
      >
        토스트 실행
      </button>

      <button
        className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
        onClick={() =>
          openModal({
            options: {
              closeOnEsc: false,
              closeOnOverlay: false,
            },
            content: (
              <div className="">
                <h2 className="text-lg font-bold">첫 번째 모달</h2>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={closeTopModal}
                >
                  1번째 모달 닫기
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                  onClick={() =>
                    openModal({
                      content: (
                        <div>
                          <h3>두 번째 모달</h3>
                          <button
                            className="bg-yellow-600  text-white px-4 py-2 rounded ml-2"
                            onClick={closeTopModal}
                          >
                            2번째 모달 닫기
                          </button>
                        </div>
                      ),
                    })
                  }
                >
                  다음 모달
                </button>
              </div>
            ),
          })
        }
      >
        모달 열기
      </button>

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

        <InputNumber
          name="pureNum"
          label="숫자 입력 테스트(쉼표 없음)"
          placeholder="숫자를 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
        />

        <InputCommaNumber
          name="numTest"
          label="숫자 입력 테스트"
          placeholder="숫자를 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <InputSelect
          name="dropDown"
          label="드롭다운 테스트"
          placeholder="옵션을 선택하세요"
          register={register}
          setValue={setValue}
          errors={errors}
          watch={watch}
          option={option}
        ></InputSelect>

        <InputRadio
          name="radios"
          label="라디오 테스트"
          register={register}
          setValue={setValue}
          errors={errors}
          watch={watch}
          option={option}
        ></InputRadio>

        <InputCheckbox
          name="checks"
          label="체크박스 테스트"
          register={register}
          setValue={setValue}
          errors={errors}
          watch={watch}
          option={option}
        ></InputCheckbox>

        <InputToggle
          name="myToggle"
          label="토글 테스트"
          register={register}
          setValue={setValue}
          errors={errors}
          watch={watch}
          option={option}
        ></InputToggle>

        <button type="submit">제출</button>
      </form>

      <div className="my-2"></div>

      <PagingComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        size={3}
      ></PagingComponent>
      <div className="text-blue-400 text-3xl font-bold underline">
        Hello "/login/signin"! -- {result} --{" "}
      </div>
      <div>is pending : {isPending ? "Yes" : "No"}</div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={testSignIn}
      >
        Sign In
      </button>
      <div>is test {testIsPending ? "Yes" : "No"}</div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => testTodo()}
      >
        Test Todo
      </button>
      <div>Test Result: {JSON.stringify(testResult)}</div>
    </>
  );
}
