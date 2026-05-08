import { z } from "zod";

export interface RoleOption {
  value: string;
  label: string;
  selected: boolean;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  name?: string;
  accessDate?: string;
  role?: RoleOption[];
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  file?: FileList;
  profileImage?: string;
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
  profileImage: z.string().optional(),
});

// 등록·수정 폼이 같은 컴포넌트를 공유하므로, 더 넓은 형태(UpdatedUserForm)를
// 단일 폼 타입으로 사용한다. password는 등록 시 zodResolver(userSchema)로 검증.
export type UserForm = z.infer<typeof updatedUserSchema>;

export const USER_PAGE_SIZE = 3;

export const userSearchSchema = z.object({
  page: z.number().catch(1),
  size: z.number().catch(USER_PAGE_SIZE),
});

export type UserSearch = z.infer<typeof userSearchSchema>;
