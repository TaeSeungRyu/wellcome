import type { RoleOption } from "./schema";

// 폼/페이로드 공통 입력 타입 (생성/수정 양쪽에서 사용)
export interface UserMutationInput {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: RoleOption[];
  file?: FileList;
  profileImage?: string;
}

// 폼 데이터 → API payload 변환
// - role: selected=true인 항목만 value로 추출
// - phone/email: 빈 문자열이면 제거 (백엔드 partial update 대응)
// - file: FileList의 첫 번째 항목만 전달
export const buildUserPayload = (input: UserMutationInput) => {
  const { file, role, ...rest } = input;
  const payload: Record<string, unknown> = {
    ...rest,
    role: role?.filter((r) => r.selected).map((r) => r.value),
  };
  if (payload.phone === "") delete payload.phone;
  if (payload.email === "") delete payload.email;
  return { payload, file: file?.[0] };
};
