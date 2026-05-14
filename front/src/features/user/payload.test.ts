import { describe, expect, it } from "vitest";
import { buildUserPayload } from "./payload";

describe("buildUserPayload", () => {
  it("role 배열에서 selected=true 인 항목의 value만 추출한다", () => {
    const { payload } = buildUserPayload({
      username: "u",
      role: [
        { value: "ADMIN", label: "관리자", selected: true },
        { value: "USER", label: "사용자", selected: false },
        { value: "GUEST", label: "게스트", selected: true },
      ],
    });

    expect(payload.role).toEqual(["ADMIN", "GUEST"]);
  });

  it("role이 없으면 undefined로 둔다", () => {
    const { payload } = buildUserPayload({ username: "u" });
    expect(payload.role).toBeUndefined();
  });

  it("phone과 email이 빈 문자열이면 payload에서 제거한다", () => {
    const { payload } = buildUserPayload({
      username: "u",
      phone: "",
      email: "",
    });

    expect("phone" in payload).toBe(false);
    expect("email" in payload).toBe(false);
  });

  it("phone과 email이 채워져 있으면 그대로 유지한다", () => {
    const { payload } = buildUserPayload({
      username: "u",
      phone: "010-1234-5678",
      email: "u@example.com",
    });

    expect(payload.phone).toBe("010-1234-5678");
    expect(payload.email).toBe("u@example.com");
  });

  it("file 필드는 FileList의 첫 번째 File만 분리해 반환한다", () => {
    const first = new File(["a"], "first.txt");
    const second = new File(["b"], "second.txt");
    const fileList = {
      0: first,
      1: second,
      length: 2,
      item: (i: number) => (i === 0 ? first : second),
    } as unknown as FileList;

    const { file, payload } = buildUserPayload({ username: "u", file: fileList });

    expect(file).toBe(first);
    expect("file" in payload).toBe(false);
  });

  it("file이 없으면 file은 undefined", () => {
    const { file } = buildUserPayload({ username: "u" });
    expect(file).toBeUndefined();
  });

  it("나머지 필드(password, name, profileImage)는 그대로 통과시킨다", () => {
    const { payload } = buildUserPayload({
      username: "u",
      password: "pw",
      name: "홍길동",
      profileImage: "/img/abc",
    });

    expect(payload).toMatchObject({
      username: "u",
      password: "pw",
      name: "홍길동",
      profileImage: "/img/abc",
    });
  });
});
