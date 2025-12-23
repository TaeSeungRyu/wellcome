// src/context/AuthContext.tsx
import { SIGNIN_PATH } from "@/const";
import { Navigate } from "@tanstack/react-router";
import { createContext, useContext, useState } from "react";

// 1. 토큰 관리를 위한 상수 및 헬퍼 함수 (필요에 따라 더 복잡하게 구현 가능)
export const ACCESS_TOKEN_KEY = "actkn";
export const REFRESH_TOKEN_KEY = "rftkn"; // 리프레시 토큰도 관리한다고 가정

// 로컬 스토리지에 액세스 토큰 저장
export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  console.log("setAccessToken:", token);
};

// 로컬 스토리지에 리프레시 토큰 저장
export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
  console.log("setRefreshToken:", token);
};

// 로컬 스토리지에서 액세스 토큰 가져오기
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// 토큰들을 제거하고 로그아웃 처리
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const AuthContext = createContext({
  token: null as string | null,
  login: (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  },
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getAccessToken());
  const login = (accessToken: string, refreshToken: string) => {
    setToken(accessToken);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };
  const logout = () => {
    setToken(null);
    Navigate({ to: SIGNIN_PATH }); // 권한없으면 로그인페이지로
  };
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
