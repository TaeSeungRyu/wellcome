import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { ResponseDto } from '../common/dto/response.dto';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Roles('admin', 'super', 'manager')
  @Get('find')
  find(@Query('boardId') boardId: string): Promise<ResponseDto> {
    return this.boardService.findById(boardId);
  }

  @Roles('admin', 'super', 'manager')
  @Get('list')
  list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    return this.boardService.findAll(page, limit);
  }

  @Roles('admin', 'super', 'manager')
  @Post('create')
  create(
    @Body() boardData: CreateBoardDto,
    @CurrentUser('username') username: string,
  ): Promise<ResponseDto> {
    return this.boardService.create(boardData, username);
  }

  @Roles('admin', 'super', 'manager')
  @Put('update')
  update(
    @Body() boardData: UpdateBoardDto,
    @CurrentUser('username') username: string,
  ): Promise<ResponseDto> {
    return this.boardService.update(boardData, username);
  }

  @Roles('admin', 'super', 'manager')
  @Delete('delete')
  delete(
    @Query('boardId') boardId: string,
    @CurrentUser('username') username: string,
  ): Promise<ResponseDto> {
    return this.boardService.delete(boardId, username);
  }

  @Roles('admin', 'super', 'manager')
  @Post('add-comment')
  addComment(@Body() commentData: CreateCommentDto): Promise<ResponseDto> {
    return this.boardService.addComment(commentData);
  }

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
