/**
 * JwtStrategy.validate() 가 반환하는 값이자,
 * 이후 Guard/Controller 에서 request.user 로 접근할 때의 타입
 */
export interface JwtPayload {
  username: string;
  role: string[];
  iat?: number;
  exp?: number;
}
