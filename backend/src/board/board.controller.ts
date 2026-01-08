import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ResponseDto } from 'src/common/common.dto';
import { BoardDto, CommentDto, UpdateBoardDto } from './board.dto';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get('find')
  async find(@Query('boardId') boardId: string): Promise<ResponseDto> {
    const user = await this.boardService.findById(boardId);
    return user;
  }

  @Get('list')
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    const users = await this.boardService.findAll(page, limit);
    return users;
  }

  @Post('create')
  async create(@Body() boardData: BoardDto): Promise<ResponseDto> {
    const board = await this.boardService.create(boardData);
    return board;
  }

  @Put('update')
  async update(@Body() boardData: UpdateBoardDto): Promise<ResponseDto> {
    const board = await this.boardService.update(boardData);
    return board;
  }

  @Delete('delete')
  async delete(@Query('boardId') boardId: string): Promise<ResponseDto> {
    const board = await this.boardService.delete(boardId);
    return board;
  }

  @Post('add-comment')
  async addComment(@Body() commentData: CommentDto): Promise<ResponseDto> {
    const board = await this.boardService.addComment(commentData);
    return board;
  }

  @Delete('remove-comment')
  async removeComment(
    @Query('boardId') boardId: string,
    @Query('commentId') commentId: string,
  ): Promise<ResponseDto> {
    const board = await this.boardService.removeComment(boardId, commentId);
    return board;
  }
}
