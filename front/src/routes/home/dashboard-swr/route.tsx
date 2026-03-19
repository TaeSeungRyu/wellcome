import { createFileRoute } from "@tanstack/react-router";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import useSWRInfinite from "swr/infinite"; // 1. 전용 훅 임포트
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
  // const { data, mutate: refetchList } = useSWR(
  //   ["boardList", page, limit],
  //   ([, page, limit]) => requestBoardList(page, limit),
  // );

  // const { trigger, isMutating, error } = useSWRMutation(
  //   ["boardList", page, limit],
  //   async () => {
  //     const { title, contents } = await getSampleData();
  //     await requestBoardInsert(title, contents); // 서버에 데이터 추가 요청
  //   },
  //   {
  //     onSuccess: (data) => {
  //       console.log("성공!", data); //추가 성공 후 별도의 refetchList 호출 없이 SWR이 자동으로 캐시를 갱신
  //     },
  //     onError: (err) => {
  //       console.error("실패!", err);
  //     },
  //   },
  // );

  // //게시글 추가 함수
  // const handleAddBoard = async () => {
  //   const { title, contents } = await getSampleData();
  //   try {
  //     // 서버에 데이터 추가 요청 (SWR과 별개인 일반 비동기 함수)
  //     await requestBoardInsert(title, contents);
  //     //추가 성공 후 'boardList' 캐시를 갱신 (서버에서 다시 불러오기)
  //     refetchList();
  //     alert("추가되었습니다!");
  //   } catch (e) {
  //     console.error("추가 실패", e);
  //   }
  // };
  // useEffect(() => {
  //   if (data) console.log("데이터 수신:", data);
  // }, [data]);

  //#1. useSWRInfinite
  const getKey = (pageIndex: number, previousPageData: any) => {
    // 끝에 도달했으면 null을 반환하여 더 이상 요청하지 않음
    if (previousPageData && !previousPageData.length) return null;

    // API가 1-based index라면 pageIndex + 1 사용
    return ["boardList-infinite", pageIndex + 1, limit];
  };
  // 2. useSWRInfinite 설정
  const {
    data: infiniteData,
    //error: infiniteError,
    size,
    setSize,
    isValidating,
    isLoading,
    //mutate, //데이터를 수정한 뒤에 캐시를 갱신할 때 사용
  } = useSWRInfinite(
    getKey,
    async ([, page, limit]) => {
      const result = await requestBoardList(Number(page), Number(limit));
      if (result?.result?.data?.boards) {
        console.log("board data : ", result.result.data.boards);
        return result.result.data.boards; // 페이지별 게시글 배열 반환
      }
      return [];
    },
    { revalidateFirstPage: false }, //다음 페이지 불러올 때 1페이지 재검증 안 함
  );

  // 4. 데이터 가공 (2차원 배열 [page1, page2...]을 1차원 [item1, item2...]로 펼침)
  /**
   * 2차원 배열로 만드는 이유(AI가 설명)
   * 만약 10페이지까지 데이터를 불러온 상태에서, 3페이지에 있는 게시글 하나만 수정되었다고 가정해 봅시다.
   * 1차원 배열일 때: 전체 50개의 아이템이 든 배열을 처음부터 끝까지 다 뒤져서 수정해야 합니다.
   * 2차원 배열일 때: data[2](3번째 서랍)만 딱 열어서 그 안의 데이터만 교체하면 끝입니다. 캐시 효율이 엄청나게 좋아지죠.
   */
  const boards = infiniteData ? infiniteData.flat() : [];
  const lastPage = infiniteData?.[infiniteData.length - 1];
  const isReachingEnd =
    infiniteData && (lastPage?.length < limit || lastPage?.length === 0);
  useEffect(() => {
    if (infiniteData) {
      console.log(
        "무한 스크롤 데이터 수신:",
        infiniteData,
        lastPage,
        boards.length,
        limit,
      );
    }
  }, [infiniteData]);
  return (
    <div>
      <h1> 목록</h1>
      {/* <button onClick={handleAddBoard}>
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
        {data?.result?.data?.boards?.map &&
          data?.result?.data?.boards?.map((board: any, index: number) => (
            <li key={index}>
              <h2>{board.title}</h2>
              <p>{board.contents}</p>
            </li>
          ))}
      </ul> */}
      <div>---------- useSWRInfinite ----------</div>
      <ul>
        {boards?.map &&
          boards?.map((board: any, index: number) => (
            <li
              key={index}
              style={{ borderBottom: "1px solid #ccc", padding: "10px" }}
            >
              <h2>{board.title}</h2>
              <p>{board.contents}</p>
            </li>
          ))}
      </ul>

      {/* 5. 더 보기 제어 부 */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => setSize(size + 1)}
          disabled={isLoading || isValidating || isReachingEnd}
        >
          {isLoading || isValidating
            ? "로딩 중..."
            : isReachingEnd
              ? "마지막 데이터입니다"
              : "더 보기"}
        </button>
      </div>
    </div>
  );
}
