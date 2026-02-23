## 📌 script `async` vs `defer`

`<script>` 태그의 **로딩 및 실행 방식을 제어하는 속성**으로,
페이지 성능과 렌더링 흐름에 큰 영향을 줍니다.

기본 `<script>`는 **HTML 파싱을 차단(blocking)** 합니다.

---

## 1️⃣ 기본 script 동작

### 특징

- HTML 파싱 중 `<script>` 발견
- 다운로드
- 실행
- 다시 HTML 파싱

### 동작 과정

```
HTML 파싱
   ↓
script 발견
   ↓
다운로드
   ↓
실행
   ↓
HTML 파싱 재개
```

### 문제점

- 렌더링 지연
- 성능 저하

---

## 2️⃣ async

### 개념

- 스크립트를 **병렬 다운로드**
- 다운로드 완료 즉시 실행

### 특징

- HTML 파싱과 병렬 다운로드
- 실행 시 HTML 파싱 중단
- 실행 순서 보장 안됨

### 사용 예

```html
<script async src="analytics.js"></script>
<script async src="ads.js"></script>
```

### 동작 과정

```
HTML 파싱
   ↓
script 발견
   ↓
다운로드 시작 (병렬)
   ↓
다운로드 완료
   ↓
즉시 실행
   ↓
HTML 파싱 재개
```

### 실행 순서

```
async1.js
async2.js
```

다운로드 순서:

```
async2 먼저 완료
→ async2 먼저 실행
```

즉:

```
순서 보장 X
```

---

### 사용 대상

독립적인 스크립트

예:

- 광고 스크립트
- 분석 스크립트
- 트래킹 코드

예:

- Google Analytics
- 광고 SDK

---

## 3️⃣ defer

### 개념

- 스크립트를 병렬 다운로드
- DOM 파싱 완료 후 실행

### 특징

- HTML 파싱 차단 없음
- DOM 생성 후 실행
- 실행 순서 보장

### 사용 예

```html
<script defer src="lib.js"></script>
<script defer src="app.js"></script>
```

### 동작 과정

```
HTML 파싱
   ↓
script 발견
   ↓
다운로드 시작
   ↓
HTML 파싱 계속
   ↓
DOM 생성 완료
   ↓
script 실행
```

---

### 실행 순서

```
lib.js
app.js
```

실행:

```
lib.js → app.js
```

즉:

```
순서 보장 O
```

---

### 사용 대상

애플리케이션 코드

예:

- 메인 JS
- UI 로직
- 프레임워크 코드

예:

- Vue 앱
- React 앱

---

## 4️⃣ async vs defer 비교

| 구분           | async         | defer       |
| -------------- | ------------- | ----------- |
| 다운로드       | 병렬          | 병렬        |
| 실행 시점      | 다운로드 즉시 | DOM 완료 후 |
| 순서 보장      | X             | O           |
| DOM 접근       | 위험          | 안전        |
| HTML 파싱 차단 | 실행 시 차단  | 없음        |
| 용도           | 독립 스크립트 | 앱 코드     |

---

## 5️⃣ 실행 타이밍 비교

### 기본 script

```
HTML → script → HTML
```

차단 발생

---

### async

```
HTML → HTML → script 실행 → HTML
```

중간 실행

---

### defer

```
HTML → HTML → HTML → script 실행
```

마지막 실행

---

## 6️⃣ DOMContentLoaded와 관계

### defer

`defer`는 DOM 생성 이후 실행됩니다.

```
HTML 파싱 완료
 ↓
defer 실행
 ↓
DOMContentLoaded
```

즉:

```
defer → DOMContentLoaded 이전 실행
```

---

### async

```
async 실행 시점
→ 랜덤
```

```
DOMContentLoaded 이전일 수도
이후일 수도 있음
```

---

## 7️⃣ 언제 무엇을 써야 하나

### async 사용

```
다른 script와 독립적
DOM 의존성 없음
```

예:

```
analytics.js
ads.js
tracking.js
```

---

### defer 사용

```
앱 코드
순서 중요
DOM 필요
```

예:

```
main.js
vendor.js
ui.js
```

---

## 8️⃣ 실무 권장 방식

### 일반 웹앱

```
defer 기본 사용
```

예:

```html
<script defer src="/main.js"></script>
```

---

### 외부 스크립트

```
async 사용
```

예:

```html
<script async src="analytics.js"></script>
```

---

## 9️⃣ module script 특징

```html
<script type="module" src="app.js"></script>
```

특징:

- 기본적으로 defer처럼 동작

즉:

```
module = defer 기본 포함
```

특징:

- 병렬 다운로드
- DOM 후 실행

---

## 10️⃣ 렌더링 성능 관점

### 나쁜 예

```html
<script src="main.js"></script>
```

결과:

```
렌더링 차단
```

---

### 좋은 예

```html
<script defer src="main.js"></script>
```

결과:

```
빠른 렌더링
```

---

## ✅ 핵심 정리

### async

```
다운로드 후 바로 실행
→ 순서 보장 X
```

### defer

```
DOM 완료 후 실행
→ 순서 보장 O
```

```
async는 독립 스크립트,
defer는 앱 스크립트에 적합하다.
```
