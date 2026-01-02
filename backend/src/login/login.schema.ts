import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoginDocument = HydratedDocument<LoginUser>;

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

export const LoginSchema = SchemaFactory.createForClass(LoginUser);
