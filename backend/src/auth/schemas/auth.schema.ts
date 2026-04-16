import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'auth',
})
export class Auth {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  desc: string;

  @Prop()
  createDate?: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
export type AuthDocument = HydratedDocument<Auth>;
