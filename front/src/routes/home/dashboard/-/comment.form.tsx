import type { Comment } from "./board.schema";

export function CommentFormComponent({
  boardId,
  commentList,
}: {
  boardId: string;
  commentList?: Comment[];
}) {
  return (
    <div>
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
