import { z } from "zod";

export const boardSchema = z.object({
  title: z.string().min(3, "제목을 입력하세요"),
  contents: z.string().min(3, "내용을 입력하세요"),
});

export type BoardForm = z.infer<typeof boardSchema>;
