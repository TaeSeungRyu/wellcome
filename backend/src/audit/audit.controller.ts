import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { ResponseDto } from '../common/dto/response.dto';
import { AuditService } from './audit.service';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({
    summary: '감사 로그 목록 조회',
    description:
      '페이지네이션 + 필터로 감사 로그를 조회합니다. (super / admin 권한)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'target', required: false })
  @ApiQuery({
    name: 'success',
    required: false,
    description: 'true / false',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'ISO date (createdAt 시작)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'ISO date (createdAt 종료)',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('super', 'admin')
  @Get('list')
  list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('username') username?: string,
    @Query('action') action?: string,
    @Query('target') target?: string,
    @Query('success') success?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<ResponseDto> {
    const successFilter =
      success === 'true' ? true : success === 'false' ? false : undefined;

    return this.auditService.findAll(page, limit, {
      username,
      action,
      target,
      success: successFilter,
      from,
      to,
    });
  }

  @ApiOperation({
    summary: '감사 로그 단건 조회',
    description: '_id로 감사 로그 한 건을 조회합니다. (super / admin 권한)',
  })
  @ApiQuery({ name: '_id', description: '감사 로그 _id' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('super', 'admin')
  @Get('find')
  find(@Query('_id') id: string): Promise<ResponseDto> {
    return this.auditService.findById(id);
  }
}
