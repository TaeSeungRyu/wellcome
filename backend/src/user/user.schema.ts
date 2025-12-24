import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  collection: 'user',
})
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name?: string;

  @Prop()
  accessDate?: string;

  @Prop()
  role?: string[];

  @Prop()
  email?: string;

  @Prop()
  phone?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
