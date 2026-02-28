## 📌 IndexedDB

브라우저에서 제공하는 **로컬 데이터베이스 API**로, 구조화된 데이터를 클라이언트 측에 저장할 수 있습니다.
`localStorage` / `sessionStorage`보다 더 강력하고 확장성이 높은 저장소입니다.

---

### 🔹 핵심 특징

* **비동기(Asynchronous) API**

  * 메인 스레드를 블로킹하지 않음
  * 대용량 데이터 처리에 적합
  * `onsuccess`, `onerror` 또는 `Promise` 기반으로 사용

* **대용량 저장 가능**

  * 수십 MB ~ 수백 MB 이상 (브라우저 정책에 따라 다름)
  * 문자열뿐 아니라 **객체, Blob, 파일 등 구조화된 데이터 저장 가능**

* **트랜잭션 기반**

  * 모든 작업은 `transaction` 단위로 수행
  * 원자성(Atomicity) 보장
  * 여러 작업을 묶어 안전하게 처리 가능

---

## 🔹 주요 개념

| 개념           | 설명                    |
| ------------ | --------------------- |
| Database     | 전체 데이터베이스 단위          |
| Object Store | 테이블과 유사한 개념           |
| Key          | 데이터 식별자 (Primary Key) |
| Index        | 검색 성능 향상을 위한 보조 키     |
| Transaction  | 데이터 처리 단위             |

---

## 🔹 기본 사용 흐름

```js
const request = indexedDB.open("MyDB", 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("users", { keyPath: "id" });
};

request.onsuccess = (event) => {
  const db = event.target.result;
  const transaction = db.transaction("users", "readwrite");
  const store = transaction.objectStore("users");

  store.add({ id: 1, name: "Kim" });
};
```

---

## 🔹 언제 사용하면 좋을까?

* 오프라인 웹앱 (PWA)
* 대량 데이터 캐싱
* 이미지, 파일 저장
* 복잡한 구조의 데이터 관리

---

## 🔹 localStorage와 비교

| 구분     | IndexedDB        | localStorage |
| ------ | ---------------- | ------------ |
| 동작 방식  | 비동기              | 동기           |
| 저장 용량  | 대용량 가능           | 약 5MB        |
| 데이터 구조 | 객체, 파일 등 구조화 데이터 | 문자열만 가능      |
| 트랜잭션   | O                | X            |
| 성능     | 대량 데이터에 적합       | 소량 데이터에 적합   |

---

## 🔐 보안 참고

* 동일 출처 정책(Same-Origin Policy) 적용
* 자바스크립트 접근 가능 → **XSS 공격에 취약**
* 민감 정보 저장은 지양

---