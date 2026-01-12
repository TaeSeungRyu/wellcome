// auth/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// 1. 유저 정보 인터페이스 정의 (프로젝트 상황에 맞게 수정하세요)
export interface UserPayload {
  userId: number;
  username: string;
  email?: string;
}

export const GetUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    // 2. Request 타입을 확장하여 user 속성이 있음을 명시
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: UserPayload }>();

    const user = request.user;

    // 3. 데이터가 요청되면 해당 키 값 반환, 아니면 유저 전체 반환
    return data ? user?.[data] : user;
  },
);
