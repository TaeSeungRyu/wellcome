import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { ResponseDto } from '../common/dto/response.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board, BoardDocument } from './schemas/board.schema';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name)
    private readonly boardModel: Model<BoardDocument>,
  ) {}

  private now(): string {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  }

  private async findBoardOrThrow(boardId: string): Promise<BoardDocument> {
    const board = await this.boardModel.findById(boardId).exec();
    if (!board) {
      throw new NotFoundException(
        new ResponseDto(
          { success: false },
          'board_not_found',
          '게시판 글을 찾을 수 없습니다.',
        ),
      );
    }
    return board;
  }

  private assertOwner(owner: string, username: string, action: string): void {
    if (owner !== username) {
      throw new ForbiddenException(
        new ResponseDto(
          { success: false },
          'forbidden',
          `${action} 권한이 없습니다.`,
        ),
      );
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ResponseDto> {
    const skip = (page - 1) * limit;
    const [boards, total] = await Promise.all([
      this.boardModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.boardModel.countDocuments().exec(),
    ]);
    return new ResponseDto(
      { success: true, data: { boards, total, page, limit } },
      '',
      '게시판 글 목록을 성공적으로 조회했습니다.',
      200,
    );
  }

  async findById(boardId: string): Promise<ResponseDto> {
    const board = await this.findBoardOrThrow(boardId);
    return new ResponseDto(
      { success: true, data: board },
      '',
      '게시판 글을 성공적으로 조회했습니다.',
      200,
    );
  }

  async create(
    boardData: CreateBoardDto,
    usernameInAuth: string,
  ): Promise<ResponseDto> {
    try {
      const savedBoard = await new this.boardModel({
        ...boardData,
        username: usernameInAuth,
        createDate: this.now(),
      }).save();
      return new ResponseDto(
        { success: true, data: savedBoard },
        '',
        '게시판 글이 성공적으로 생성되었습니다.',
        201,
      );
    } catch (error) {
      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'save_error',
          error instanceof Error
            ? error.message
            : '게시판 글 생성 중 오류가 발생했습니다.',
        ),
      );
    }
  }

  async update(
    updateData: UpdateBoardDto,
    usernameInAuth: string,
  ): Promise<ResponseDto> {
    const { _id, ...rest } = updateData;
    const board = await this.findBoardOrThrow(_id);
    this.assertOwner(board.username, usernameInAuth, '게시판 글 수정');

    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(
        _id,
        { ...rest, username: usernameInAuth, updateDate: this.now() },
        { new: true },
      )
      .exec();
    if (!updatedBoard) {
      throw new NotFoundException(
        new ResponseDto(
          { success: false },
          'board_not_found',
          '게시판 글을 찾을 수 없습니다.',
        ),
      );
    }
    return new ResponseDto(
      { success: true, data: updatedBoard },
      '',
      '게시판 글이 성공적으로 수정되었습니다.',
      200,
    );
  }

  async delete(boardId: string, usernameInAuth: string): Promise<ResponseDto> {
    const board = await this.findBoardOrThrow(boardId);
    this.assertOwner(board.username, usernameInAuth, '게시판 글 삭제');

    const deletedBoard = await this.boardModel
      .findByIdAndDelete(boardId)
      .exec();
    if (!deletedBoard) {
      throw new NotFoundException(
        new ResponseDto(
          { success: false },
          'board_not_found',
          '게시판 글을 찾을 수 없습니다.',
        ),
      );
    }
    return new ResponseDto(
      { success: true, data: deletedBoard },
      '',
      '게시판 글이 성공적으로 삭제되었습니다.',
      200,
    );
  }

  async addComment(
    commentData: CreateCommentDto,
    usernameInAuth: string,
  ): Promise<ResponseDto> {
    const board = await this.findBoardOrThrow(commentData.boardId);
    board.comments.push({
      username: usernameInAuth,
      comment: commentData.comment,
      date: this.now(),
    });
    const updatedBoard = await board.save();
    return new ResponseDto(
      { success: true, data: updatedBoard },
      '',
      '댓글이 성공적으로 추가되었습니다.',
      201,
    );
  }

  async removeComment(
    boardId: string,
    commentId: string,
    usernameInAuth: string,
  ): Promise<ResponseDto> {
    const board = await this.findBoardOrThrow(boardId);
    const target = board.comments.find(
      (comment) => comment?._id?.toString() === commentId,
    );
    if (!target) {
      throw new NotFoundException(
        new ResponseDto(
          { success: false },
          'comment_not_found',
          '댓글을 찾을 수 없습니다.',
        ),
      );
    }
    this.assertOwner(target.username, usernameInAuth, '댓글 삭제');

    board.comments = board.comments.filter(
      (comment) => comment?._id?.toString() !== commentId,
    );
    const updatedBoard = await board.save();
    return new ResponseDto(
      { success: true, data: updatedBoard },
      '',
      '댓글이 성공적으로 삭제되었습니다.',
      200,
    );
  }
}
