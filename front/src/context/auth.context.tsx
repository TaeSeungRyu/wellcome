// src/context/AuthContext.tsx
import { SIGNIN_PATH } from "@/const";
import { createContext, useContext, useState } from "react";

/*
 * 지금 구조는 엑세스 토큰을 쿠키에 담는 구조라 엑세스 토큰 관리는 하지 않습니다.
 * 다만 향후 구조 변경이나 리프레시 토큰 관리를 위해 토큰 관리 코드를 남겨둡니다.
 */
// 1. 토큰 관리를 위한 상수 및 헬퍼 함수 (필요에 따라 더 복잡하게 구현 가능)
export const ACCESS_TOKEN_KEY = "actkn";
export const REFRESH_TOKEN_KEY = "rftkn"; // 리프레시 토큰도 관리한다고 가정(지금 구조에서는 안씀...)
export const USER_NAME_KEY = "username";

// 로컬 스토리지에 액세스 토큰 저장
export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// 로컬 스토리지에 리프레시 토큰 저장
export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

// 로컬 스토리지에서 액세스 토큰 가져오기
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setUserName = (username: string) => {
  localStorage.setItem(USER_NAME_KEY, username);
};

export const getUserName = (): string | null => {
  return localStorage.getItem(USER_NAME_KEY);
};

// 토큰들을 제거하고 로그아웃 처리
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const AuthContext = createContext({
  token: null as string | null,
  login: (accessToken: string, refreshToken: string, username: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserName(username);
  },
  logout: (noNavigate?: boolean) => {
    clearTokens();
    if (!noNavigate) {
      location.href = SIGNIN_PATH; // 권한없으면 로그인페이지로
    }
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getAccessToken());
  const login = (
    accessToken: string,
    refreshToken: string,
    username: string,
  ) => {
    setToken(accessToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserName(username);
  };
  const logout = (noNavigate?: boolean) => {
    clearTokens();
    if (!noNavigate) {
      location.href = SIGNIN_PATH;
    }
  };
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
