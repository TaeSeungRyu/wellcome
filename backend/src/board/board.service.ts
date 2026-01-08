import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board, BoardDocument } from './board.schema';
import { Model } from 'mongoose';
import { ResponseDto } from 'src/common/common.dto';
import { BoardDto, CommentDto, UpdateBoardDto } from './board.dto';
import dayjs from 'dayjs';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name)
    private boardModel: Model<BoardDocument>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<ResponseDto> {
    const skip = (page - 1) * limit;
    const [boards, total] = await Promise.all([
      this.boardModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      this.boardModel.countDocuments(),
    ]);
    const paginationData = {
      boards,
      total,
      page,
      limit,
    };
    return new ResponseDto(
      {
        success: true,
        data: paginationData,
      },
      '',
      '게시판 글 목록을 성공적으로 조회했습니다.',
      200,
    );
  }

  async create(boardData: BoardDto): Promise<ResponseDto> {
    try {
      boardData.createDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const newBoard = new this.boardModel(boardData);
      const savedBoard = await newBoard.save();
      return new ResponseDto(
        {
          success: true,
          data: savedBoard,
        },
        '',
        '게시판 글이 성공적으로 생성되었습니다.',
        201,
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '게시판 글 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async update(updateData: UpdateBoardDto): Promise<ResponseDto> {
    try {
      const { _id } = updateData;
      updateData.updateDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const updatedBoard = await this.boardModel.findByIdAndUpdate(
        _id,
        updateData,
        { new: true },
      );
      if (!updatedBoard) {
        throw new Error('게시판 글을 찾을 수 없습니다.');
      }
      return new ResponseDto(
        {
          success: true,
          data: updatedBoard,
        },
        '',
        '게시판 글이 성공적으로 수정되었습니다.',
        200,
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '게시판 글 수정 중 오류가 발생했습니다.',
      );
    }
  }

  async delete(boardId: string): Promise<ResponseDto> {
    try {
      const deletedBoard = await this.boardModel.findByIdAndDelete(boardId);
      if (!deletedBoard) {
        throw new Error('게시판 글을 찾을 수 없습니다.');
      }
      return new ResponseDto(
        {
          success: true,
          data: deletedBoard,
        },
        '',
        '게시판 글이 성공적으로 삭제되었습니다.',
        200,
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '게시판 글 삭제 중 오류가 발생했습니다.',
      );
    }
  }

  async findById(boardId: string): Promise<ResponseDto> {
    try {
      const board = await this.boardModel.findById(boardId);
      if (!board) {
        throw new Error('게시판 글을 찾을 수 없습니다.');
      }
      return new ResponseDto(
        {
          success: true,
          data: board,
        },
        '',
        '게시판 글을 성공적으로 조회했습니다.',
        200,
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '게시판 글 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async addComment(commentData: CommentDto): Promise<ResponseDto> {
    try {
      const board = await this.boardModel.findById(commentData.boardId);
      if (!board) {
        throw new Error('게시판 글을 찾을 수 없습니다.');
      }
      commentData.date = dayjs().format('YYYY-MM-DD HH:mm:ss');
      board.comments.push(commentData);
      const updatedBoard = await board.save();
      return new ResponseDto(
        {
          success: true,
          data: updatedBoard,
        },
        '',
        '댓글이 성공적으로 추가되었습니다.',
        200,
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '댓글 추가 중 오류가 발생했습니다.',
      );
    }
  }

  async removeComment(
    boardId: string,
    commentId: string,
  ): Promise<ResponseDto> {
    try {
      const board = await this.boardModel.findById(boardId);
      if (!board) {
        throw new Error('게시판 글을 찾을 수 없습니다.');
      }

      board.comments = board.comments.filter(
        (comment) => comment?._id?.toString() !== commentId,
      );

      const updatedBoard = await board.save();
      return new ResponseDto(
        {
          success: true,
          data: updatedBoard,
        },
        '',
        '댓글이 성공적으로 삭제되었습니다.',
        200,
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '댓글 삭제 중 오류가 발생했습니다.',
      );
    }
  }
}
