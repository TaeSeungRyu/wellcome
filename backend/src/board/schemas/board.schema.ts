import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BoardDocument = HydratedDocument<Board>;

@Schema()
export class Comment {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  comment: string;

  @Prop()
  date: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({
  timestamps: true,
  collection: 'board',
})
export class Board {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  contents: string;

  @Prop()
  createDate?: string;

  @Prop()
  updateDate?: string;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
