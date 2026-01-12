import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ResponseDto } from 'src/common/common.dto';
import { BoardDto, CommentDto, UpdateBoardDto } from './board.dto';
import { Role } from 'src/auth/role.decorator';
import { Request } from 'express';
import { GetUser } from 'src/auth/username.decorator';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Role('admin', 'super', 'manager')
  @Get('find')
  async find(@Query('boardId') boardId: string): Promise<ResponseDto> {
    const user = await this.boardService.findById(boardId);
    return user;
  }

  @Role('admin', 'super', 'manager')
  @Get('list')
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    const users = await this.boardService.findAll(page, limit);
    return users;
  }

  @Role('admin', 'super', 'manager')
  @Post('create')
  async create(
    @Body() boardData: BoardDto,
    @GetUser('username') username: string,
  ): Promise<ResponseDto> {
    const board = await this.boardService.create(boardData, username);
    return board;
  }

  @Role('admin', 'super', 'manager')
  @Put('update')
  async update(
    @Body() boardData: UpdateBoardDto,
    @GetUser('username') username: string,
  ): Promise<ResponseDto> {
    const board = await this.boardService.update(boardData, username);
    return board;
  }

  @Role('admin', 'super', 'manager')
  @Delete('delete')
  async delete(
    @Query('boardId') boardId: string,
    @GetUser('username') username: string,
  ): Promise<ResponseDto> {
    const board = await this.boardService.delete(boardId, username);
    return board;
  }

  @Role('admin', 'super', 'manager')
  @Post('add-comment')
  async addComment(@Body() commentData: CommentDto): Promise<ResponseDto> {
    const board = await this.boardService.addComment(commentData);
    return board;
  }

  @Role('admin', 'super', 'manager')
  @Delete('remove-comment')
  async removeComment(
    @Query('boardId') boardId: string,
    @Query('commentId') commentId: string,
    @Req() req: Request,
  ): Promise<ResponseDto> {
    const board = await this.boardService.removeComment(
      boardId,
      commentId,
      req.headers['authorization'] as string,
    );
    return board;
  }
}
