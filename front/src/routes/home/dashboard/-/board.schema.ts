import { z } from "zod";

export interface Board {
  _id: string;
  title: string;
  contents: string;
  username: string;
  createDate: string;
}

export const boardSchema = z.object({
  title: z.string().min(3, "제목을 입력하세요"),
  contents: z.string().min(3, "내용을 입력하세요"),
});

export type BoardForm = z.infer<typeof boardSchema>;

export interface Comment {
  boardId: string;
  username: string;
  comment: string;
  date?: string;
}

export const commentSchema = z.object({
  comment: z.string().min(1, "댓글을 입력하세요"),
});

export type CommentForm = z.infer<typeof commentSchema>;
