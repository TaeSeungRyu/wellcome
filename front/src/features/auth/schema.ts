import { z } from "zod";

export interface Auth {
  _id?: string;
  code: string;
  name: string;
  desc: string;
}

export const authSchema = z.object({
  code: z.string().min(1, "코드는 필수입니다."),
  name: z.string().min(1, "이름은 필수입니다."),
  desc: z.string().min(1, "설명은 필수입니다."),
});

export type AuthForm = z.infer<typeof authSchema>;

export const AUTH_PAGE_SIZE = 3;

export const authSearchSchema = z.object({
  page: z.number().catch(1),
  size: z.number().catch(AUTH_PAGE_SIZE),
  search: z.string().optional(),
});

export type AuthSearch = z.infer<typeof authSearchSchema>;
