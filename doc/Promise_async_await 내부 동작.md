
---

# 📌 Promise & async/await 내부 동작 정리

## 1️⃣ JavaScript의 비동기 실행 구조

JavaScript는 **Single Thread(단일 스레드)** 기반 언어입니다.
하지만 비동기 처리를 위해 다음과 같은 구조를 사용합니다:

* **Call Stack**
* **Web APIs (Browser / Node APIs)**
* **Task Queue (Macrotask Queue)**
* **Microtask Queue**
* **Event Loop**

### 🔁 Event Loop 동작 순서

1. Call Stack 실행
2. Stack이 비면
   → **Microtask Queue 먼저 모두 실행**
3. 이후
   → Macrotask Queue에서 1개 실행
4. 다시 Microtask 전부 실행
5. 반복

👉 **Microtask가 Macrotask보다 항상 우선**

---

## 2️⃣ Promise 내부 동작

### 🔹 Promise란?

비동기 작업의 결과를 나타내는 객체

```js
new Promise((resolve, reject) => {
  resolve("success");
});
```

### 🔹 Promise 상태

* `pending`
* `fulfilled`
* `rejected`

### 🔹 핵심 특징

✅ `.then()`, `.catch()`, `.finally()`는 **Microtask Queue**에 등록됨

```js
console.log("1");

Promise.resolve().then(() => {
  console.log("2");
});

console.log("3");
```

### 실행 결과

```
1
3
2
```

### 실행 흐름

1. 1 출력
2. Promise.then → Microtask Queue 등록
3. 3 출력
4. Stack 비어있음
5. Microtask 실행 → 2 출력

---

## 3️⃣ Microtask Queue vs Macrotask Queue

| 구분    | Microtask                    | Macrotask               |
| ----- | ---------------------------- | ----------------------- |
| 예시    | Promise.then, queueMicrotask | setTimeout, setInterval |
| 우선순위  | 🔥 높음                        | 낮음                      |
| 실행 시점 | 현재 Stack 종료 직후               | Microtask 모두 실행 후       |

### 예제

```js
setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("sync");
```

### 실행 결과

```
sync
promise
timeout
```

---

## 4️⃣ async 함수 내부 동작

### 🔹 async 함수의 특징

* 항상 **Promise 반환**
* 내부적으로 Promise 기반으로 동작

```js
async function test() {
  return 1;
}

console.log(test());
```

출력:

```
Promise { 1 }
```

👉 `return 1` 은 `Promise.resolve(1)`과 동일

---

## 5️⃣ await의 내부 동작

### 🔹 await의 역할

* Promise가 처리될 때까지 함수 실행을 **일시 중단**
* 이후 코드는 **Microtask Queue로 재진입**

### 예제

```js
async function example() {
  console.log("A");

  await Promise.resolve();

  console.log("B");
}

example();
console.log("C");
```

### 실행 결과

```
A
C
B
```

### 실행 흐름

1. example 호출
2. A 출력
3. await 만나면 함수 중단
4. 이후 코드는 Microtask에 등록
5. C 출력
6. Microtask 실행 → B 출력

---

## 6️⃣ await는 단순한 "중단"이 아니다

실제로는 다음과 같이 변환된다고 볼 수 있습니다:

```js
async function example() {
  console.log("A");

  Promise.resolve().then(() => {
    console.log("B");
  });
}
```

👉 즉, `await` 이후 코드는 **Promise.then과 동일하게 Microtask 처리**

---

## 7️⃣ async/await + setTimeout 혼합 예제

```js
async function test() {
  console.log("1");

  setTimeout(() => console.log("2"), 0);

  await Promise.resolve();

  console.log("3");
}

test();
console.log("4");
```

### 실행 결과

```
1
4
3
2
```

### 실행 순서 정리

1 → 4 (동기)
3 (Microtask)
2 (Macrotask)

---

## 8️⃣ 정리 핵심 포인트

### 🔥 반드시 기억할 것

* Promise.then → Microtask
* await 이후 코드 → Microtask
* Microtask는 Macrotask보다 항상 먼저 실행
* async 함수는 무조건 Promise 반환
* await는 함수 실행을 나누는 문법적 설탕(Syntax Sugar)

---

## 📌 한 줄 요약

> async/await는 결국 Promise 기반이며,
> await 이후 코드는 Microtask Queue에서 실행된다.

---
