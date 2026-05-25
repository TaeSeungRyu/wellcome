import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

/**
 * Express Request 의 user 필드를 JwtStrategy 가 반환하는 타입으로 보강한다.
 * tsconfig.json 의 typeRoots 에 "./src/types" 가 포함되어 있어 자동으로 로드된다.
 */
declare global {
  namespace Express {
    interface User extends JwtPayload {}

    interface Request {
      /** LoggingInterceptor 가 부여하는 요청별 correlation ID (x-request-id) */
      correlationId?: string;
    }
  }
}

export {};
