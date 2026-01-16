import InputText from "@/components/form/inputText";
import type { Comment, CommentForm } from "./board.schema";
import { useBoardCommentForm } from "./useBoardHook";

export function CommentFormComponent({
  boardId,
  commentList,
}: {
  boardId?: string;
  commentList?: Comment[];
}) {
  const fields: (keyof CommentForm)[] = ["comment"];
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useBoardCommentForm(boardId);

  const onInsertSubmit = (data: CommentForm) => {
    console.log("Submit Comment:", data);
  };

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
