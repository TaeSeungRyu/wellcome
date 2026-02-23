## 📌 preload vs prefetch

웹 성능 최적화를 위해 브라우저가 **리소스를 언제 로드할지 힌트를 주는 기술**입니다.
주로 `<link>` 태그의 `rel` 속성으로 설정합니다.

---

## 1️⃣ preload

### 개념

- **현재 페이지 렌더링에 반드시 필요한 리소스를 미리 다운로드**
- 브라우저에게 **"이 리소스는 중요하니 우선 다운로드하라"** 라고 알려줌
- 높은 우선순위로 즉시 로드됨

### 특징

- 현재 페이지 성능 개선 목적
- 렌더링 속도 향상
- 높은 네트워크 우선순위
- 즉시 다운로드

### 사용 예

```html
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin />
<link rel="preload" href="/css/style.css" as="style" />
<link rel="preload" href="/js/main.js" as="script" />
```

### 동작 과정

```
HTML 파싱
   ↓
preload 발견
   ↓
즉시 다운로드 시작
   ↓
렌더링 시 바로 사용
```

### 사용 대상

- 주요 CSS
- 핵심 JS
- 웹폰트
- Hero 이미지

예:

- 메인 스타일 CSS
- 초기 JS 번들
- 첫 화면 이미지

---

## 2️⃣ prefetch

### 개념

- **미래에 사용할 가능성이 높은 리소스를 미리 다운로드**
- 브라우저에게 **"나중에 쓸 수도 있으니 여유 있을 때 받아라"**

### 특징

- 다음 페이지 성능 개선 목적
- 낮은 우선순위
- Idle 상태에서 다운로드
- 현재 렌더링 영향 없음

### 사용 예

```html
<link rel="prefetch" href="/next-page.js" />
<link rel="prefetch" href="/detail-data.json" />
```

### 동작 과정

```
현재 페이지 렌더 완료
   ↓
네트워크 여유 발생
   ↓
prefetch 다운로드
   ↓
캐시에 저장
   ↓
다음 페이지에서 사용
```

---

## 3️⃣ preload vs prefetch 비교

| 구분          | preload     | prefetch    |
| ------------- | ----------- | ----------- |
| 목적          | 현재 페이지 | 다음 페이지 |
| 우선순위      | 높음        | 낮음        |
| 다운로드 시점 | 즉시        | Idle        |
| 렌더링 영향   | 있음        | 없음        |
| 사용 시점     | 지금        | 나중        |
| 캐시          | 사용됨      | 사용됨      |

---

## 4️⃣ preload 사용 시 주의사항

### 과도한 preload는 성능 저하

```
❌ preload 너무 많음
→ 네트워크 경쟁 발생
→ 느려짐
```

권장:

```
핵심 리소스만 preload
```

예:

- main.css
- main.js
- font

---

## 5️⃣ preload의 as 속성

리소스 타입 지정이 중요합니다.

```html
<link rel="preload" href="/app.js" as="script" />
```

### 이유

브라우저가:

- 우선순위 결정
- 캐시 정책 적용
- 보안 정책 적용

---

## 6️⃣ preload와 Critical Rendering Path

preload는 **Critical Rendering Path 최적화**에 사용됩니다.

예:

```
HTML
 ↓
CSS 다운로드 지연
 ↓
렌더링 지연
```

preload 적용:

```
HTML
 ↓
CSS preload 발견
 ↓
즉시 다운로드
 ↓
빠른 렌더링
```

결과:

- FCP 개선
- LCP 개선

---

## 7️⃣ prefetch 활용 사례

### SPA에서 유용

예:

- 상품 목록 → 상품 상세

```
목록 페이지
 ↓
detail.js prefetch
 ↓
상세 페이지 이동
 ↓
즉시 표시
```

---

## 8️⃣ preload vs script async/defer 차이

### preload

```
다운로드만 미리
실행은 나중
```

### async

```
다운로드 병렬
다운로드 완료 즉시 실행
```

### defer

```
다운로드 병렬
HTML 완료 후 실행
```

---

## 9️⃣ 프레임워크에서 활용

### Vue / React / Next

자동 적용되는 경우 많음

예:

- 코드 스플리팅 chunk prefetch
- route prefetch

예:

- Next.js Link hover → prefetch

---

## 10️⃣ preload vs prefetch vs preconnect

| 기술       | 목적        |
| ---------- | ----------- |
| preload    | 현재 리소스 |
| prefetch   | 미래 리소스 |
| preconnect | 서버 연결   |

예:

```html
<link rel="preconnect" href="https://cdn.com" />
```

효과:

- DNS lookup
- TCP handshake
- TLS handshake

미리 수행

---

## ✅ 정리

### preload

```
지금 필요한 리소스
→ 빨리 받아라
```

### prefetch

```
나중에 필요한 리소스
→ 여유 있을 때 받아라
```

---

## ✅ 핵심 한줄 정리

```
preload = 현재 페이지 성능 최적화
prefetch = 다음 페이지 성능 최적화
```
