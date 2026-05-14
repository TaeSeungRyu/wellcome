import { describe, expect, it } from "vitest";
import { resultMapper } from "./types";

describe("resultMapper", () => {
  it("주어진 key로 data를 추출하고 페이징 메타를 그대로 매핑한다", () => {
    const res = {
      auths: [{ code: "A", name: "관리자" }],
      total: 42,
      page: 2,
      limit: 10,
    };

    const mapped = resultMapper<typeof res.auths>(res, "auths");

    expect(mapped).toEqual({
      data: res.auths,
      total: 42,
      page: 2,
      limit: 10,
    });
  });

  it("페이징 메타가 없으면 undefined로 매핑한다", () => {
    const res = {
      data: { _id: "1", code: "X", name: "이름", desc: "설명" },
    };

    const mapped = resultMapper(res, "data");

    expect(mapped.data).toEqual(res.data);
    expect(mapped.total).toBeUndefined();
    expect(mapped.page).toBeUndefined();
    expect(mapped.limit).toBeUndefined();
  });

  it("존재하지 않는 key를 요청하면 data가 undefined가 된다", () => {
    const mapped = resultMapper({ total: 0 }, "nope");
    expect(mapped.data).toBeUndefined();
    expect(mapped.total).toBe(0);
  });
});
