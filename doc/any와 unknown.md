
# TypeScript에서 `any` vs `unknown` 차이

TypeScript에서 `any`와 `unknown`은 둘 다 "모든 타입을 받을 수 있는" 타입이지만, **안전성**에서 큰 차이



## 🔹 `any` 타입

### 특징
- 타입 검사를 **완전히 무시**
- 어떤 값이든 할당 가능
- 어떤 프로퍼티나 메서드도 자유롭게 사용 가능 (컴파일 에러 없음)

### 예시
```ts
let value: any = 10;

value = "hello";
value.toUpperCase(); // ✅ 에러 없음
value.nonExistentMethod(); // ❗ 런타임 에러 가능
````

### 문제점

* 타입 안정성이 없음
* 런타임 에러 발생 가능성이 높음
* TypeScript를 쓰는 의미가 줄어듦



## 🔹 `unknown` 타입

### 특징

* `any`와 달리 **타입 안전함**
* 모든 값을 할당할 수 있지만,
* 사용하기 전에 **타입 검증이 필요**

### 예시

```ts
let value: unknown = "hello";

value.toUpperCase(); 
// ❌ 에러: Object is of type 'unknown'

if (typeof value === "string") {
  value.toUpperCase(); // ✅ 안전하게 사용 가능
}
```

### 장점

* 안전한 타입 처리 가능
* 실수 방지
* 타입 좁히기(type narrowing) 강제

---

## 🔍 핵심 차이 비교

| 구분    | any        | unknown    |
| ----- | ---------- | ---------- |
| 타입 검사 | ❌ 없음       | ✅ 있음       |
| 할당    | 모든 타입 가능   | 모든 타입 가능   |
| 사용    | 자유롭게 사용 가능 | 타입 확인 후 사용 |
| 안정성   | ❌ 낮음       | ✅ 높음       |

---

## 💡 언제 사용해야 할까?

### `any`

* 빠르게 개발해야 할 때 (임시)
* 외부 라이브러리 타입이 없을 때

👉 하지만 **가능하면 사용 지양**

### `unknown`

* 타입을 아직 모를 때
* 외부 데이터(API 응답 등)를 받을 때

👉 **권장되는 안전한 선택**

---

## ✅ 한 줄 요약

> `any`는 "아무거나 막 써도 됨",
> `unknown`은 "뭐든 들어오지만 검사하고 써라"

---

```
```
