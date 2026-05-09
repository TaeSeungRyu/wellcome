import { API } from "@/const";
import { api } from "@/services/api";
import type { ApiResponse } from "@/shared/api/types";
import type { Board, Comment } from "./board.schema";

export interface BoardListResult {
  success?: boolean;
  data: {
    boards: Board[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface BoardDetailResult {
  success?: boolean;
  data: Board;
}

export interface BoardMutationResult {
  success?: boolean;
  data?: Board;
}

export interface CommentMutationResult {
  success?: boolean;
  data?: Comment;
}

const requestBoardList = (page: number, limit: number) =>
  api.get<ApiResponse<BoardListResult>>(API.BOARD, { page, limit });

const requestBoardDetail = (_id: string) =>
  api.get<ApiResponse<BoardDetailResult>>(API.BOARD_DETAIL, { boardId: _id });

const requestBoardInsert = (title: string, contents: string) =>
  api.post<ApiResponse<BoardMutationResult>>(API.BOARD_CREATE, {
    title,
    contents,
  });

const requestBoardUpdate = (_id: string, title: string, contents: string) =>
  api.put<ApiResponse<BoardMutationResult>>(API.BOARD_UPDATE, {
    _id,
    title,
    contents,
  });

const requestBoardDelete = (_id: string) =>
  api.delete<ApiResponse<BoardMutationResult>>(API.BOARD_DELETE, {
    boardId: _id,
  });

const requestAddComment = (
  boardId: string,
  comment: string,
  username: string,
) =>
  api.post<ApiResponse<CommentMutationResult>>(API.BOARD_COMMENT_ADD, {
    boardId,
    comment,
    username,
  });

const requestCommentDelete = (
  boardId: string,
  commentId: string,
  username: string,
) =>
  api.delete<ApiResponse<CommentMutationResult>>(API.BOARD_COMMENT_DELETE, {
    boardId,
    commentId,
    username,
  });

export {
  requestBoardList,
  requestBoardInsert,
  requestBoardUpdate,
  requestBoardDetail,
  requestBoardDelete,
  requestAddComment,
  requestCommentDelete,
};
