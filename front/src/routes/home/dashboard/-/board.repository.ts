import { API } from "@/const";
import { ApiClient } from "@/services/apiClient";

const requestBoardList = async (page: number, limit: number) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: {
      page,
      limit,
    },
  };
  return apiClient.request(API.BOARD, params);
};

const requestBoardDetail = async (_id: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "get",
    query: {
      boardId: _id,
    },
  };
  return apiClient.request(API.BOARD_DETAIL, params);
};

const requestBoardInsert = async (title: string, contents: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "post",
    body: JSON.stringify({
      title,
      contents,
    }),
  };
  return apiClient.request(API.BOARD_CREATE, params);
};

const requestBoardUpdate = async (
  _id: string,
  title: string,
  contents: string
) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "put",
    body: JSON.stringify({
      _id,
      title,
      contents,
    }),
  };
  return apiClient.request(API.BOARD_UPDATE, params);
};

const requestBoardDelete = async (_id: string) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "delete",
    query: {
      boardId: _id,
    },
  };
  return apiClient.request(API.BOARD_DELETE, params);
};

const requestAddComment = async (
  boardId: string,
  comment: string,
  username: string
) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "post",
    body: JSON.stringify({
      boardId,
      comment,
      username,
    }),
  };
  return apiClient.request(API.BOARD_COMMENT_ADD, params);
};

const requestCommentDelete = async (
  boardId: string,
  commentId: string,
  username: string
) => {
  const apiClient = ApiClient.getInstance();
  const params = {
    method: "delete",
    query: {
      boardId,
      commentId,
      username,
    },
  };
  return apiClient.request(API.BOARD_COMMENT_DELETE, params);
};

export {
  requestBoardList,
  requestBoardInsert,
  requestBoardUpdate,
  requestBoardDetail,
  requestBoardDelete,
  requestAddComment,
  requestCommentDelete,
};
