import InputText from "@/components/form/inputText";
import type { BoardForm } from "./board.schema";
import { useBoardAlter, useBoardForm } from "./useBoardHook";
import { useModal } from "@/context/modalContext";
import { useEffect } from "react";
import { useToast } from "@/context/toastContext";

export function BoardModalComponent({
  closeTopModal,
  search,
}: {
  closeTopModal: () => void;
  search: () => void;
}) {
  //FORM 영역
  const fields: (keyof BoardForm)[] = ["title", "contents"];
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useBoardForm();

  //MUTATION 영역
  const { openModal, closeTopModal: closeConfirmModal } = useModal();
  const { mutateAsync, data, error } = useBoardAlter();
  const { showToast } = useToast();

  const toAlter = async (data: any) => {
    console.log("Form Data Submitted:", data);
    await mutateAsync({
      title: data.title,
      contents: data.contents,
    });
  };

  useEffect(() => {
    if (data) {
      closeConfirmModal();
      closeTopModal();
      search();
      showToast("저장되었습니다", { type: "success" });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      showToast("에러 발생", { type: "error", duration: 1000 });
      console.error("Error during mutation:", error);
    }
  }, [error]);

  const onSubmit = (data: any) => {
    openModal({
      content: (
        <div>
          <h2>확인</h2>
          <p>데이터를 등록하시겠습니까?</p>
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

  return (
    <div>
      <div>
        <h2>데이터 등록</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputText
            name={fields[0]}
            label="제목"
            placeholder="제목을 입력하세요"
            register={register}
            setValue={setValue}
            errors={errors}
          />
          <InputText
            name={fields[1]}
            label="내용"
            placeholder="내용을 입력하세요"
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
      </div>
    </div>
  );
}
