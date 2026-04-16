import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * user 컬렉션에서 로그인 검증에 필요한 최소 필드만 사용하는 모델.
 * 전체 사용자 관리는 user 모듈의 User 스키마를 사용한다.
 */
@Schema({
  timestamps: true,
  collection: 'user',
})
export class LoginUser {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name?: string;

  @Prop()
  accessDate?: string;

  @Prop({ type: [String], default: [] })
  role: string[];
}

export const LoginUserSchema = SchemaFactory.createForClass(LoginUser);
export type LoginUserDocument = HydratedDocument<LoginUser>;
