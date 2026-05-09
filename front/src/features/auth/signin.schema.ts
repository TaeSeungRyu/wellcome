import { z } from "zod";

export const signinSchema = z.object({
  myText: z.string().min(3, "텍스트는 최소 3자 이상이어야 합니다."),
  myPassword: z.string().min(3, "비밀번호는 최소 3자 이상이어야 합니다."),
});
