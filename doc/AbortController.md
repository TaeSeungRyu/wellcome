## 📌 AbortController 이론 정리

`AbortController`는 비동기 작업(대표적으로 `fetch`)을 **중단(cancel)** 할 수 있도록 도와주는 Web API입니다.
SPA(React, Vue, Nuxt, Next.js 등) 환경에서 **메모리 누수 방지**, **경쟁 요청 제어**, **불필요한 네트워크 낭비 방지**를 위해 매우 중요합니다.

---

# 1️⃣ AbortController 기본 개념

### 🔹 왜 필요한가?

기본적으로 `fetch()`는 한 번 실행되면 **자동으로 취소되지 않습니다.**

- 사용자가 페이지를 떠났는데 요청이 계속 진행됨
- 검색어 입력 중 이전 요청이 늦게 도착해서 최신 결과를 덮어씀
- 같은 API를 여러 번 빠르게 호출함

이런 문제를 해결하기 위해 `AbortController`를 사용합니다.

---

### 🔹 기본 구조

```js
const controller = new AbortController();
const signal = controller.signal;

fetch("/api/data", { signal });

// 요청 취소
controller.abort();
```

- `controller.abort()` → 요청 중단
- `signal` → fetch에 연결되는 취소 신호

---

# 2️⃣ fetch 요청 취소

## 📌 동작 원리

1. AbortController 생성
2. signal을 fetch에 전달
3. abort() 호출 시 Promise reject 발생
4. 에러 타입은 `"AbortError"`

---

### 🔹 예제

```js
const controller = new AbortController();

try {
  const res = await fetch("/api/data", {
    signal: controller.signal,
  });
} catch (error) {
  if (error.name === "AbortError") {
    console.log("요청이 취소되었습니다.");
  }
}
```

---

### 🔹 특징

- 네트워크 요청을 실제로 중단
- catch 블록에서 반드시 AbortError 분기 필요
- 취소는 단방향 (다시 살릴 수 없음)

---

# 3️⃣ 경쟁 요청 처리 (Race Condition 해결)

## 📌 문제 상황

검색창에서:

```
a 입력 → 요청1
ab 입력 → 요청2
abc 입력 → 요청3
```

만약 요청1이 가장 늦게 응답하면?

👉 오래된 데이터가 최신 데이터를 덮어씀

---

## 📌 해결 방법: 이전 요청 취소

```js
let controller;

async function search(keyword) {
  if (controller) {
    controller.abort(); // 이전 요청 취소
  }

  controller = new AbortController();

  const res = await fetch(`/api/search?q=${keyword}`, {
    signal: controller.signal,
  });

  const data = await res.json();
  return data;
}
```

---

### 🔹 결과

- 항상 "마지막 요청"만 유효
- 오래된 응답 무시 가능
- UX 개선

---

# 4️⃣ 컴포넌트 unmount 시 요청 정리

SPA 프레임워크에서 매우 중요합니다.

## 📌 왜 필요할까?

컴포넌트가 사라졌는데:

- API 응답이 도착함
- setState 실행
- 경고 발생
- 메모리 누수 위험

---

## 📌 React 예시

```js
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", {
    signal: controller.signal,
  });

  return () => {
    controller.abort(); // 언마운트 시 취소
  };
}, []);
```

---

## 📌 Vue 3 예시

```js
import { onUnmounted } from "vue";

const controller = new AbortController();

fetch("/api/data", {
  signal: controller.signal,
});

onUnmounted(() => {
  controller.abort();
});
```

---

# 5️⃣ AbortController 내부 동작 이론

## 📌 Signal 기반 설계

AbortController는 Observer 패턴 기반입니다.

- controller → 신호 발행자
- signal → 구독 객체
- fetch → signal을 구독

`abort()` 호출 시:

```
controller.abort()
  ↓
signal.aborted = true
  ↓
fetch 내부 리스너 실행
  ↓
Promise reject
```

---

# 6️⃣ AbortSignal 확장 기능

### 🔹 timeout 지원 (최신 브라우저)

```js
const signal = AbortSignal.timeout(5000);

fetch("/api/data", { signal });
```

→ 5초 후 자동 취소

---

### 🔹 여러 요청 동시에 취소

```js
const controller = new AbortController();

fetch("/api/1", { signal: controller.signal });
fetch("/api/2", { signal: controller.signal });

controller.abort(); // 모두 취소
```

---

# 7️⃣ 실무에서 중요한 포인트

### ✅ 1. 항상 AbortError 분기 처리

```js
if (error.name !== "AbortError") {
  // 실제 에러 처리
}
```

---

### ✅ 2. axios도 지원

```js
axios.get("/api/data", {
  signal: controller.signal,
});
```

(axios v1 이상)

---

### ✅ 3. SSR 환경 주의 (Next.js, Nuxt)

- 서버 환경에서는 AbortController가 동작 방식이 다를 수 있음
- Node 18 이상은 기본 지원

---

# 8️⃣ 언제 반드시 써야 하는가?

| 상황                   | 필요성     |
| ---------------------- | ---------- |
| 검색 자동완성          | ⭐⭐⭐⭐⭐ |
| 페이지 이동이 잦은 SPA | ⭐⭐⭐⭐   |
| 실시간 필터링          | ⭐⭐⭐⭐   |
| 단순 1회성 요청        | ⭐         |

---

# 9️⃣ 장점 정리

- 불필요한 네트워크 요청 감소
- 메모리 누수 방지
- Race Condition 해결
- UX 개선
- 서버 부하 감소

---

# 🔟 한 줄 요약

> AbortController는 SPA에서 “요청 생명주기 제어”를 위한 필수 도구다.

---
