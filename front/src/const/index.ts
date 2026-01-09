export const API_BASE_URL = "/api";
export const SIGNIN_PATH = "/login";

export const API = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGIN_REFRESH: `${API_BASE_URL}/auth/refresh`,
  TEST_URL: `${API_BASE_URL}/category`, //테스트용 URL
  BOARD: `${API_BASE_URL}/board/list`,
  BOARD_CREATE: `${API_BASE_URL}/board/create`,
  BOARD_UPDATE: `${API_BASE_URL}/board/update`,
  BOARD_DELETE: `${API_BASE_URL}/board/delete`,
};
