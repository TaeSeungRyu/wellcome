import { MENU_ITEMS } from "@/const";
import { getUserName } from "@/context/auth.context";
import { useLocation, useRouter } from "@tanstack/react-router";
import { useIsFetching } from "@tanstack/react-query";
import { LoadingIndicator } from "./loading.indicator";

export default function HeaderComponent() {
  const isFetching = useIsFetching(); // 앱 전체의 패칭 상태 감시
  const router = useRouter();
  const pathInfo = useLocation();
  const username = getUserName();

  const movePage = (link?: string) => {
    if (link) {
      router.navigate({ to: link });
    }
  };

  return (
    <div className="header">
      <LoadingIndicator isFetching={isFetching > 0} />
      <div>user name : {username}</div>
      <div className="relative h-10 border-b border-b-neutral-200 flex justify-center items-center gap-5">
        {MENU_ITEMS.map((item) => {
          const isActive = pathInfo.pathname.startsWith(item.link || "");
          return (
            <div
              key={item.link}
              className={` cursor-pointer ${isActive ? "font-bold" : "font-normal"} hover:underline hover:text-blue-700 hover:scale-105 hover:shadow-lg`}
              onClick={() => movePage(item.link)}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
