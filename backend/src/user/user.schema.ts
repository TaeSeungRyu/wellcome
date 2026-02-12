import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Auth } from 'src/auth/auth.schema';

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
  role?: any[];

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  profileImage?: string;

  @Prop()
  authList?: Auth[];
}

// export interface UserInfo extends User {
//   authList: Auth[];
// }

export const UserSchema = SchemaFactory.createForClass(User);
