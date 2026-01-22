import { MENU_ITEMS } from "@/const";
import { getUserName } from "@/context/auth.context";
import { useLocation, useRouter } from "@tanstack/react-router";
import { useIsFetching } from "@tanstack/react-query";
import { LoadingIndicator } from "./loading.indicator";

export default function HeaderComponent() {
  const isFetching = useIsFetching();
  const router = useRouter();
  const pathInfo = useLocation();
  const username = getUserName();

  const movePage = (link?: string) => {
    if (link) {
      router.navigate({ to: link });
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-200">
      {/* 1. 상단 로딩 바 (isFetching 상태 연동) */}
      <div className="absolute top-0 left-0 w-full h-[2px] z-[60]">
        <LoadingIndicator isFetching={isFetching > 0} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 2. 좌측 영역: 로고 또는 서비스명 */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => router.navigate({ to: "/home" })}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 group-hover:rotate-12 transition-transform">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              시스템
            </span>
          </div>

          {/* 3. 중앙 영역: 메인 메뉴 내비게이션 */}
          <nav className="hidden md:flex space-x-8 h-full">
            {MENU_ITEMS.map((item) => {
              const isActive = pathInfo.pathname.startsWith(item.link || "");
              return (
                <div
                  key={item.link}
                  className={`
                    relative flex items-center px-1 pt-1 text-sm font-medium transition-all cursor-pointer
                    ${
                      isActive
                        ? "text-blue-600"
                        : "text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    }
                  `}
                  onClick={() => movePage(item.link)}
                >
                  {item.label}
                  {/* 하단 활성화 라인 (Underline) */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in zoom-in duration-300" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* 4. 우측 영역: 사용자 정보 및 프로필 */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs text-slate-400 font-medium">
                Administrator
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {username || "Guest"}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold hover:bg-slate-200 transition-colors cursor-pointer">
              {username?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
