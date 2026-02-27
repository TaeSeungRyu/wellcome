import type { FileRouteTypes } from "@/routeTree.gen";

export const API_BASE_URL = "/api";
export const SIGNIN_PATH = "/login/signin";

export const API = {
  CONST_LIST: `${API_BASE_URL}/const/list`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGIN_REFRESH: `${API_BASE_URL}/auth/refresh`,
  TEST_URL: `${API_BASE_URL}/category`, //테스트용 URL
  BOARD: `${API_BASE_URL}/board/list`,
  BOARD_DETAIL: `${API_BASE_URL}/board/find`,
  BOARD_CREATE: `${API_BASE_URL}/board/create`,
  BOARD_UPDATE: `${API_BASE_URL}/board/update`,
  BOARD_DELETE: `${API_BASE_URL}/board/delete`,
  BOARD_COMMENT_ADD: `${API_BASE_URL}/board/add-comment`,
  BOARD_COMMENT_DELETE: `${API_BASE_URL}/board/remove-comment`,
  USER: `${API_BASE_URL}/user/list`,
  USER_CREATE: `${API_BASE_URL}/user/create`,
  USER_CHECK_EXIST: `${API_BASE_URL}/user/check-exist`,
  USER_DETAIL: `${API_BASE_URL}/user/find`,
  USER_DELETE: `${API_BASE_URL}/user/delete`,
  USER_UPDATE: `${API_BASE_URL}/user/update`,
  USER_CREATE_FILE: `${API_BASE_URL}/user/create-with-file`,
  USER_UPDATE_FILE: `${API_BASE_URL}/user/update-with-file`,

  AUTH_LIST: `${API_BASE_URL}/auth-code/list`,
  AUTH_CREATE: `${API_BASE_URL}/auth-code/create`,
  AUTH_UPDATE: `${API_BASE_URL}/auth-code/update`,
  AUTH_DELETE: `${API_BASE_URL}/auth-code/delete`,
  AUTH_DETAIL: `${API_BASE_URL}/auth-code/find`,
  AUTH_CODE_EXIST: `${API_BASE_URL}/auth-code/check-code`,
};

export interface MenuItem {
  label: string;
  key: string;
  link?: FileRouteTypes["to"];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "게시글 관리",
    key: "manage-board",
    link: "/home/dashboard",
  },
  {
    label: "사용자 관리",
    key: "manage-user",
    link: "/home/user",
  },
  {
    label: "권한 관리",
    key: "manage-auth",
    link: "/home/auth",
  },
];
