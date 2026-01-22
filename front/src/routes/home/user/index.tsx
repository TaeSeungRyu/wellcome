import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useUserListHook } from "./-/use.user.hook";
import { TableComponent } from "@/components/ui/table.component";
import { PagingComponent } from "@/components/ui/paging.component";
import type { Column } from "@/const/type";

export const Route = createFileRoute("/home/user/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [size, setSize] = useState(3);
  const {
    isFetching,
    data: result,
    refetch: search,
  } = useUserListHook(currentPage, size);
  const currentPageFromApi = result?.data?.page || 1;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: Column<any>[] = [
    {
      key: "username",
      header: "아이디",
      render(value) {
        return <strong className="text-red-300">{value as string}</strong>;
      },
    },
    {
      key: "email",
      header: "이메일",
    },
    { key: "phone", header: "전화번호" },
    {
      key: "createdAt",
      header: "작성일",
    },
  ];

  const [data, setData] = useState<any[]>([]);
  const onRowClick = (row: any) => {
    console.log(row);
  };

  useEffect(() => {
    search();
  }, [currentPage, size]);

  useEffect(() => {
    if (result?.data) {
      setSize(result?.data?.limit);
      setTotalPages(Math.ceil(result?.data?.total / result?.data?.limit));
      setData(result?.data?.users || []);
    }
  }, [result?.data]);

  const moveWritePage = () => {
    console.log(121212);
    router.navigate({
      to: "/home/user/write",
    });
  };

  return (
    <div className="p-8 bg-slate-50 ">
      {/* 헤더 섹션 */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              사용자 관리
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              시스템에 등록된 전체 사용자 목록을 조회하고 관리합니다.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="tailwind-blue-button" onClick={moveWritePage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              새 데이터 등록
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="max-w-6xl mx-auto relative group">
        {/* 로딩 상태 */}
        {isFetching && (
          <div className="absolute inset-0 z-30 bg-white/50 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* 테이블 헤더 필터 영역 (필요시 추가 가능) */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
            <h3 className="text-sm font-semibold text-slate-700">
              사용자 목록{" "}
              <span className="ml-2 text-blue-500 font-normal">
                {result?.data?.total || 0}명
              </span>
            </h3>
          </div>

          <div className="overflow-x-auto p-2">
            <TableComponent
              columns={columns}
              data={data}
              onRowClick={onRowClick}
            />
          </div>

          {/* 하단 푸터 영역 */}
          <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <PagingComponent
                totalPages={totalPages}
                currentPage={currentPageFromApi}
                size={size}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
