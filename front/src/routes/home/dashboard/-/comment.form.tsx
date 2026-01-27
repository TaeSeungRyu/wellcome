import InputText from "@/components/form/input.text";
import type { Comment, CommentForm } from "./board.schema";
import { useBoardCommentForm, useCommentAlter } from "./use.board.hook";
import { getUserName } from "@/context/auth.context";
import { useEffect } from "react";
import { useToast } from "@/context/toast.context";
import { useBoardState } from "@/state/useBoardState";
import { useModal } from "@/context/modal.context";

export function CommentFormComponent({
  boardId,
  commentList,
  closeTopModal,
}: {
  boardId?: string;
  commentList?: Comment[];
  closeTopModal?: () => void;
}) {
  const { openModal, closeTopModal: closeConfirmModal } = useModal();

  const updateValue = useBoardState((state) => state.updateValue);
  const username = getUserName() as string;
  const fields: (keyof CommentForm)[] = ["comment"];
  const { showToast } = useToast();
  const { mutateAsync, data: alterResult } = useCommentAlter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useBoardCommentForm(boardId);

  const toAlter = async (data: CommentForm) => {
    await mutateAsync({ comment: data.comment, username, boardId: boardId! });
  };

  const toRemove = async (commentId: string) => {
    await mutateAsync({ boardId: boardId!, commentId, username, comment: "" });
  };

  const onInsertSubmit = (data: CommentForm) => {
    openModal({
      content: (
        <div>
          <h2>확인</h2>
          <p>데이터를 등록 하시겠습니까?</p>
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

  const onDeleteSubmit = (commentId: string) => {
    openModal({
      content: (
        <div>
          <h2>확인</h2>
          <p>데이터를 삭제 하시겠습니까?</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={closeConfirmModal}
          >
            취소
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => toRemove(commentId)}
          >
            삭제
          </button>
        </div>
      ),
    });
  };

  useEffect(() => {
    if (alterResult) {
      setValue("comment", "");
      updateValue(Date.now().toString());
      showToast(alterResult?.message || "완료 하였습니다.", {
        type: "success",
      });
      closeConfirmModal();
      if (closeTopModal) {
        closeTopModal();
      }
    }
  }, [alterResult]);

  return (
    <div>
      <form onSubmit={handleSubmit(onInsertSubmit)}>
        <InputText
          name={fields[0]}
          label="댓글"
          placeholder="댓글을 입력하세요"
          register={register}
          setValue={setValue}
          errors={errors}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          댓글 등록
        </button>
      </form>

      {commentList && commentList.length > 0 && (
        <ul>
          {commentList.map((comment, index) => (
            <li key={index} className="border-b py-2">
              <p className="font-bold">
                {comment.username}{" "}
                <span className="text-sm text-gray-500">{comment.date}</span>
              </p>
              <p>{comment.comment}</p>
              <button
                className="text-red-500 text-sm mt-1"
                onClick={() => onDeleteSubmit(comment._id!)}
              >
                댓글 삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
