import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({
  timestamps: true,
  collection: 'audit_log',
})
export class AuditLog {
  @Prop({ index: true })
  username?: string;

  @Prop({ type: [String], default: [] })
  role?: string[];

  @Prop({ required: true, index: true })
  action: string;

  @Prop({ required: true, index: true })
  target: string;

  @Prop({ index: true })
  targetId?: string;

  @Prop()
  method?: string;

  @Prop()
  path?: string;

  @Prop({ type: Object })
  query?: Record<string, unknown>;

  @Prop({ type: Object })
  params?: Record<string, unknown>;

  @Prop({ type: Object })
  body?: Record<string, unknown>;

  @Prop()
  ip?: string;

  @Prop()
  userAgent?: string;

  @Prop({ index: true })
  statusCode?: number;

  @Prop({ default: true })
  success: boolean;

  @Prop()
  errorMessage?: string;

  @Prop()
  durationMs?: number;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ username: 1, createdAt: -1 });
AuditLogSchema.index({ target: 1, action: 1, createdAt: -1 });
