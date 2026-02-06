import { z } from "zod";

export interface User {
  _id: string;
  username: string;
  password: string;
  name?: string;
  accessDate?: string;
  role?: string[];
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  file?: any;
}

export const userSchema = z.object({
  username: z.string().min(3, "아이디를 입력하세요"),
  password: z.string().min(4, "4자리 이상 비밀번호를 입력하세요"),
  name: z.string().optional(),
  accessDate: z.string().optional(),
  role: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        selected: z.boolean(),
      }),
    )
    .min(1, "권한을 선택하세요")
    .refine((roles) => roles.some((role) => role.selected), {
      message: "권한을 하나 이상 선택하세요",
    }),
  email: z.string().optional(),
  phone: z.string().optional(),
  file: z.any().optional(),
});

export const updatedUserSchema = userSchema.extend({
  password: z.string().optional(),
});

export type UserForm = z.infer<typeof userSchema>;
