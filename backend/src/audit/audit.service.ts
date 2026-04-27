import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Model } from 'mongoose';
import { Logger } from 'winston';
import { ResponseDto } from '../common/dto/response.dto';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

const SENSITIVE_KEYS = new Set([
  'password',
  'newPassword',
  'oldPassword',
  'accessToken',
  'refreshToken',
  'token',
  'authorization',
]);

const MAX_FIELD_LENGTH = 2000;

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditModel: Model<AuditLogDocument>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  static sanitize(input: unknown): Record<string, unknown> | undefined {
    if (!input || typeof input !== 'object') return undefined;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key)) {
        out[key] = '[REDACTED]';
        continue;
      }
      if (typeof value === 'string' && value.length > MAX_FIELD_LENGTH) {
        out[key] = value.slice(0, MAX_FIELD_LENGTH) + '...[truncated]';
        continue;
      }
      out[key] = value;
    }
    return out;
  }

  record(entry: Partial<AuditLog>): void {
    this.auditModel
      .create(entry)
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.error(`AuditLog write failed: ${msg}`);
      });
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    filters: {
      username?: string;
      action?: string;
      target?: string;
      success?: boolean;
      from?: string;
      to?: string;
    } = {},
  ): Promise<ResponseDto> {
    const query: Record<string, unknown> = {};
    if (filters.username) query.username = filters.username;
    if (filters.action) query.action = filters.action;
    if (filters.target) query.target = filters.target;
    if (typeof filters.success === 'boolean') query.success = filters.success;
    if (filters.from || filters.to) {
      const range: Record<string, Date> = {};
      if (filters.from) range.$gte = new Date(filters.from);
      if (filters.to) range.$lte = new Date(filters.to);
      query.createdAt = range;
    }

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.auditModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.auditModel.countDocuments(query).exec(),
    ]);

    return new ResponseDto(
      { success: true, data: { logs, total, page, limit } },
      '',
      '성공적으로 조회했습니다.',
      200,
    );
  }

  async findById(id: string): Promise<ResponseDto> {
    const log = await this.auditModel.findById(id).lean().exec();
    if (!log) {
      return new ResponseDto(
        { success: false },
        'not_found',
        '해당 감사 로그를 찾을 수 없습니다.',
        404,
      );
    }
    return new ResponseDto(
      { success: true, data: log },
      '',
      '성공적으로 조회했습니다.',
      200,
    );
  }
}
