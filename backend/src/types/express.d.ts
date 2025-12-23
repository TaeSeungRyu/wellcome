// src/types/express.d.ts
import { Auth } from 'src/modules/user/domain/auth.entity.js';

declare global {
  namespace Express {
    interface User {
      username: string; // 사용자 ID
      name: string;
      email: string; // 사용자 이메일
      iat: number; // 발급 시간
      exp: number; // 만료 시간
      roles?: Auth[]; // 사용자 역할
    }
    interface Request {
      user: User;
    }
  }
}
