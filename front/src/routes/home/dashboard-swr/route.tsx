import { createFileRoute } from "@tanstack/react-router";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import {
  requestBoardInsert,
  requestBoardList,
} from "../dashboard/-/board.repository";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/home/dashboard-swr")({
  component: RouteComponent,
});

const getSampleData = async () => {
  const title = Math.random().toString(36).substring(2, 7); // 랜덤 제목 생성
  const contents = Math.random().toString(36).substring(2, 15); // 랜덤 내용 생성
  return { title, contents };
};

function RouteComponent() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, mutate: refetchList } = useSWR(
    ["boardList", page, limit],
    ([, page, limit]) => requestBoardList(page, limit),
  );

  const { trigger, isMutating, error } = useSWRMutation(
    ["boardList", page, limit],
    async () => {
      const { title, contents } = await getSampleData();
      await requestBoardInsert(title, contents); // 서버에 데이터 추가 요청
    },
    {
      onSuccess: (data) => {
        console.log("성공!", data); //추가 성공 후 별도의 refetchList 호출 없이 SWR이 자동으로 캐시를 갱신
      },
      onError: (err) => {
        console.error("실패!", err);
      },
    },
  );

  //게시글 추가 함수
  const handleAddBoard = async () => {
    const { title, contents } = await getSampleData();
    try {
      // 서버에 데이터 추가 요청 (SWR과 별개인 일반 비동기 함수)
      await requestBoardInsert(title, contents);
      //추가 성공 후 'boardList' 캐시를 갱신 (서버에서 다시 불러오기)
      refetchList();
      alert("추가되었습니다!");
    } catch (e) {
      console.error("추가 실패", e);
    }
  };
  useEffect(() => {
    if (data) console.log("데이터 수신:", data);
  }, [data]);
  return (
    <div>
      <h1> 목록</h1>
      <button onClick={handleAddBoard}>
        {isMutating ? "저장 중..." : "추가(refetchList 방법)"}
      </button>
      <button
        onClick={() => {
          trigger();
        }}
        disabled={isMutating}
      >
        추가(useSWRMutation 사용)
      </button>
      {error && <p>추가 실패: {error.message}</p>}
      <ul>
        {data?.map((board: any) => (
          <li key={board._id}>
            <h2>{board.title}</h2>
            <p>{board.contents}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
