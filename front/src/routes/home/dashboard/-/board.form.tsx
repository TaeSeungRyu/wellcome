import InputText from "@/components/form/inputText";
import type { BoardForm } from "./board.schema";
import { useBoardAlter, useBoardForm } from "./useBoardHook";
import { useModal } from "@/context/modalContext";
import { useEffect } from "react";
import { useToast } from "@/context/toastContext";
//import { getUserName } from "@/context/authContext";

export function BoardFormComponent({
  closeTopModal,
  search,
  _id,
}: {
  closeTopModal: () => void;
  search: () => void;
  _id?: string;
}) {
  //FORM 영역

  //console.log("providing getUserName() : ", getUserName());

  const fields: (keyof BoardForm)[] = ["title", "contents"];
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    isFetching,
    isError,
  } = useBoardForm(_id);

  //MUTATION 영역
  const { openModal, closeTopModal: closeConfirmModal } = useModal();
  const { mutateAsync, data, error } = useBoardAlter();
  const { showToast } = useToast();

  const toAlter = async (data: any) => {
    await mutateAsync({
      _id,
      title: data.title,
      contents: data.contents,
    });
  };

  useEffect(() => {
    if (data) {
      closeConfirmModal();
      closeTopModal();
      search();
      showToast(data?.message || "완료 하였습니다.", { type: "success" });
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
          <p>데이터를 {_id ? "수정" : "등록"}하시겠습니까?</p>
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
            {_id ? "수정" : "등록"}
          </button>
        </div>
      ),
    });
  };

  const onDelete = () => {
    openModal({
      content: (
        <div>
          <h2>확인</h2>
          <p>데이터를 삭제하시겠습니까?</p>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={closeConfirmModal}
          >
            취소
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              mutateAsync({ _id, isDelete: true, title: "", contents: "" });
            }}
          >
            삭제
          </button>
        </div>
      ),
    });
  };

  return (
    <div>
      <div className="p-4 space-y-4 my-2 mx-4 w-96">
        <h2>데이터 {_id ? "수정" : "등록"}</h2>
        {_id && isFetching && <p>Loading...</p>}
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
          {isError && <p className="text-red-500">데이터 로드 중 에러 발생</p>}
          {!isError && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              type="submit"
            >
              제출
            </button>
          )}
          {_id && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
              type="button"
              onClick={onDelete}
            >
              삭제
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
