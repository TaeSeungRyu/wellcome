import { z } from "zod";

export interface Auth {
  _id: string;
  auth: string;
  code: string;
  name: string;
}

export const authSchema = z.object({
  auth: z.string().min(1, "권한은 필수입니다."),
  code: z.string().min(1, "코드는 필수입니다."),
  name: z.string().min(1, "이름은 필수입니다."),
});

export type AuthForm = z.infer<typeof authSchema>;
