import { createFileRoute } from "@tanstack/react-router";
import { useUserDetail } from "./-/use.user.hook";
import { useEffect } from "react";

export const Route = createFileRoute("/home/user/info")({
  component: RouteComponent,
  validateSearch: (search) => ({
    username: String(search.username || ""),
  }),
  beforeLoad: (context) => {
    const { username } = context.search;
    if (!username) {
      throw new Error("username is required");
    }
  },
});

function RouteComponent() {
  const { username } = Route.useSearch();
  const { data: info } = useUserDetail(username);

  useEffect(() => {
    console.log("User Info:", info);
  }, [info]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">사용자 정보</h2>
        </div>
        <div className="px-6 py-5 space-y-3 text-sm">
          <InfoRow label="아이디" value={info?.username} />
          <InfoRow label="이름" value={info?.name} />
          <InfoRow label="이메일" value={info?.email || "-"} />
          <InfoRow label="전화번호" value={info?.phone || "-"} />
          <InfoRow label="역할" value={info?.role?.join(", ") || "-"} />
          <InfoRow
            label="작성일"
            value={
              info?.createdAt ? new Date(info.createdAt).toLocaleString() : "-"
            }
          />
          <InfoRow
            label="수정일"
            value={
              info?.updatedAt ? new Date(info.updatedAt).toLocaleString() : "-"
            }
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
