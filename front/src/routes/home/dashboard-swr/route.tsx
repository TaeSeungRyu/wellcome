import { createFileRoute } from "@tanstack/react-router";
import useSWRInfinite from "swr/infinite"; // 1. 전용 훅 임포트
import { requestBoardList } from "../dashboard/-/board.repository";

export const Route = createFileRoute("/home/dashboard-swr")({
  component: RouteComponent,
});

function RouteComponent() {
  const limit = 5;

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
  return (
    <div>
      <h1> 목록</h1>
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
