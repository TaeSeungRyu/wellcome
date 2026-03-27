
# TypeScript `any` vs `unknown` — 더 깊이 있는 설명

단순히 "안전하다 vs 아니다"를 넘어서, **타입 시스템 내부에서 어떻게 다르게 동작하는지**까지 이해하면 훨씬 명확해집니다.

---

## 🔹 1. 핵심 개념 차이

| 타입 | 의미 |
|------|------|
| `any` | 타입 체커를 **완전히 우회하는 탈출구** |
| `unknown` | 모든 값을 받을 수 있지만 **사용 시 검증이 필요한 안전한 상위 타입** |

👉 쉽게 말하면:

- `any`: TypeScript가 **"몰라, 알아서 해"**
- `unknown`: TypeScript가 **"몰라, 근데 확인하고 써"**

---

## 🔹 2. 타입 시스템에서의 위치

```ts
// unknown은 모든 타입의 상위 타입 (Top Type)
let a: unknown;

a = 10;
a = "hello";
a = true;

// any도 모든 타입을 허용하지만, 규칙 자체를 무시
let b: any;

b = 10;
b = "hello";
b = true;


👉 둘 다 "모든 값 할당 가능"은 같지만
👉 **이후 동작이 완전히 다름**

---

## 🔹 3. 사용 가능 여부 (가장 중요한 차이)

### `any`는 모든 연산 허용

```ts
let value: any = "hello";

value.toUpperCase();      // ✅ 가능
value.foo.bar.baz;        // ✅ 가능
value();                  // ✅ 가능
```

👉 컴파일 에러 없음 → 대신 런타임에서 터질 수 있음

---

### `unknown`은 아무것도 못함 (검증 전까지)

```ts
let value: unknown = "hello";

value.toUpperCase(); 
// ❌ Error: Object is of type 'unknown'

value(); 
// ❌ Error
```

👉 반드시 타입 좁히기 필요

---

## 🔹 4. 타입 좁히기 (Type Narrowing)

`unknown`의 핵심은 **검증 후 안전하게 사용**입니다.

### ✔ typeof 사용

```ts
function printLength(value: unknown) {
  if (typeof value === "string") {
    console.log(value.length); // ✅ OK
  }
}
```

---

### ✔ instanceof 사용

```ts
function handleDate(value: unknown) {
  if (value instanceof Date) {
    console.log(value.getFullYear()); // ✅ OK
  }
}
```

---

### ✔ 사용자 정의 타입 가드

```ts
type User = { name: string };

function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "name" in value;
}

function printUser(value: unknown) {
  if (isUser(value)) {
    console.log(value.name); // ✅ 안전
  }
}
```

---

## 🔹 5. 할당 관계 (중요 포인트)

### `any`

```ts
let a: any = "hello";

let str: string = a; // ✅ 가능 (위험)
```

👉 아무 타입으로도 자유롭게 이동 가능

---

### `unknown`

```ts
let a: unknown = "hello";

let str: string = a; 
// ❌ Error: unknown은 바로 할당 불가
```

👉 반드시 타입 확인 또는 단언 필요

```ts
let str: string = a as string; // ⚠️ 개발자가 책임짐
```

---

## 🔹 6. 함수에서의 차이

### `any` 사용

```ts
function log(value: any) {
  console.log(value.toUpperCase()); // ❗ 위험
}
```

👉 문자열이 아니면 런타임 에러

---

### `unknown` 사용

```ts
function log(value: unknown) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // ✅ 안전
  }
}
```

👉 안전한 코드 강제

---

## 🔹 7. 실제 사용 사례 비교

### 📌 API 응답 처리

❌ 잘못된 방식 (`any`)

```ts
async function fetchData(): Promise<any> {
  return fetch("/api").then(res => res.json());
}

const data = await fetchData();
console.log(data.user.name); // ❗ 위험
```

---

✅ 안전한 방식 (`unknown`)

```ts
async function fetchData(): Promise<unknown> {
  return fetch("/api").then(res => res.json());
}

const data = await fetchData();

if (typeof data === "object" && data !== null && "user" in data) {
  // 추가 검증 필요하지만 기본 안전성 확보
}
```

---

## 🔹 8. `any` vs `unknown` 요약 비교

| 항목         | any     | unknown   |
| ---------- | ------- | --------- |
| 타입 검사      | ❌ 안함    | ✅ 강제      |
| 모든 값 할당    | ✅       | ✅         |
| 다른 타입으로 할당 | ✅       | ❌ (검증 필요) |
| 메서드 호출     | ✅       | ❌         |
| 안전성        | ❌ 매우 낮음 | ✅ 높음      |
| 사용 권장 여부   | 🚫 지양   | 👍 권장     |

---

## 🔹 9. 언제 무엇을 써야 할까?

### ✅ `unknown`을 써야 하는 경우

* API 응답
* 외부 입력 (폼, JSON)
* 타입이 아직 확정되지 않은 데이터

👉 "일단 받고, 나중에 검증"

---

### ⚠️ `any`를 써도 되는 경우

* 점진적 마이그레이션
* 타입 정의가 없는 외부 라이브러리
* 정말 빠르게 프로토타입 만들 때

👉 단, **최종 코드에는 남기지 않는 것이 좋음**

---

## 🔥 최종 핵심 정리

```ts
// any: 자유 but 위험
let a: any = "hello";
a.foo.bar(); // 😱 런타임 에러 가능

// unknown: 제한 but 안전
let b: unknown = "hello";
if (typeof b === "string") {
  b.toUpperCase(); // 😎 안전
}
```

---

## ✅ 한 줄 핵심

> `any`는 타입 시스템을 끄는 것,
> `unknown`은 타입 시스템을 지키면서 유연하게 쓰는 것

```
```
