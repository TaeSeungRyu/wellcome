import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { ResponseDto } from '../common/dto/response.dto';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '게시글 단건 조회',
    description:
      'boardId로 특정 게시글을 조회합니다. (admin / super / manager 권한)',
  })
  @ApiQuery({ name: 'boardId', description: '조회할 게시글 ID' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super', 'manager')
  @Get('find')
  find(@Query('boardId') boardId: string): Promise<ResponseDto> {
    return this.boardService.findById(boardId);
  }

  @ApiOperation({
    summary: '게시글 목록 조회',
    description:
      '페이지네이션으로 게시글 목록을 조회합니다. (admin / super / manager 권한)',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super', 'manager')
  @Get('list')
  list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    return this.boardService.findAll(page, limit);
  }

  @ApiOperation({
    summary: '게시글 생성',
    description:
      '새로운 게시글을 생성합니다. 작성자는 토큰에서 추출됩니다. (admin / super / manager 권한)',
  })
  @ApiBody({ type: CreateBoardDto, description: '게시글 생성 정보' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Roles('admin', 'super', 'manager')
  @Post('create')
  create(
    @Body() boardData: CreateBoardDto,
    @CurrentUser('username') username: string,
  ): Promise<ResponseDto> {
    return this.boardService.create(boardData, username);
  }

  @ApiOperation({
    summary: '게시글 수정',
    description: '기존 게시글을 수정합니다. (admin / super / manager 권한)',
  })
  @ApiBody({ type: UpdateBoardDto, description: '게시글 수정 정보' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super', 'manager')
  @Put('update')
  update(
    @Body() boardData: UpdateBoardDto,
    @CurrentUser('username') username: string,
  ): Promise<ResponseDto> {
    return this.boardService.update(boardData, username);
  }

  @ApiOperation({
    summary: '게시글 삭제',
    description:
      'boardId로 게시글을 삭제합니다. (admin / super / manager 권한)',
  })
  @ApiQuery({ name: 'boardId', description: '삭제할 게시글 ID' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super', 'manager')
  @Delete('delete')
  delete(
    @Query('boardId') boardId: string,
    @CurrentUser('username') username: string,
  ): Promise<ResponseDto> {
    return this.boardService.delete(boardId, username);
  }

  @ApiOperation({
    summary: '댓글 추가',
    description:
      '지정한 게시글에 댓글을 추가합니다. (admin / super / manager 권한)',
  })
  @ApiBody({ type: CreateCommentDto, description: '댓글 생성 정보' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Roles('admin', 'super', 'manager')
  @Post('add-comment')
  addComment(@Body() commentData: CreateCommentDto): Promise<ResponseDto> {
    return this.boardService.addComment(commentData);
  }

  @ApiOperation({
    summary: '댓글 삭제',
    description:
      '지정한 게시글에서 특정 댓글을 삭제합니다. (admin / super / manager 권한)',
  })
  @ApiQuery({ name: 'boardId', description: '대상 게시글 ID' })
  @ApiQuery({ name: 'commentId', description: '삭제할 댓글 ID' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super', 'manager')
  @Delete('remove-comment')
  removeComment(
    @Query('boardId') boardId: string,
    @Query('commentId') commentId: string,
    @CurrentUser('username') username: string,
  ): Promise<ResponseDto> {
    return this.boardService.removeComment(boardId, commentId, username);
  }
}
