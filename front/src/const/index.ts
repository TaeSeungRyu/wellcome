import type { FileRouteTypes } from "@/routeTree.gen";

export const API_BASE_URL = "/api";
export const SIGNIN_PATH = "/login";

export const API = {
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
};

export interface MenuItem {
  label: string;
  key: string;
  link?: FileRouteTypes["to"];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "Manage Board",
    key: "manage-board",
    link: "/home/dashboard",
  },
  {
    label: "Manage User",
    key: "manage-user",
    link: "/home/user",
  },
];
