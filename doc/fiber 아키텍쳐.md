# React 렌더링 아키텍처

React 16부터 기존 Stack Reconciler를 대체하기 위해 **Fiber 아키텍처**가 도입되었습니다.  
이를 기반으로 React 18에서는 **Concurrent Rendering**이 가능해졌습니다.

---

# 1️⃣ Fiber 아키텍처

## 개념

Fiber는 React의 **Reconciliation(가상 DOM 비교) 알고리즘을 재구성한 아키텍처**입니다.  
기존에는 렌더링 작업이 **동기적으로 한 번에 처리**되었지만, Fiber는 이를 **작은 단위의 작업으로 분할**합니다.

## 특징

### 작업을 작은 단위로 분할

렌더링 작업을 여러 개의 **Fiber Node 단위**로 나누어 처리합니다.

```text
Component Tree
    ↓
Fiber Node Tree
    ↓
작업을 작은 단위로 분할하여 처리
```

### interruptible rendering

렌더링 작업 도중에도 **중단(interrupt)** 할 수 있습니다.

예시

1. 큰 컴포넌트 트리를 렌더링 중
2. 사용자가 버튼 클릭
3. React는 렌더링을 잠시 멈추고 이벤트 처리
4. 이후 다시 렌더링 재개

이 구조 덕분에 **UI가 멈추는 현상이 줄어듭니다.**

---

# 2️⃣ Concurrent Rendering

## 개념

Concurrent Rendering은 React가 **렌더링 작업을 동시에 관리하면서 더 중요한 작업을 먼저 처리하는 방식**입니다.

즉,

> 렌더링을 "한 번에 끝내는 것"이 아니라
> **우선순위 기반으로 나누어 처리하는 방식**

---

## 특징

### UI 응답성 개선

사용자의 입력 이벤트를 **렌더링보다 우선 처리**할 수 있습니다.

예시

```text
1. 긴 리스트 렌더링 진행 중
2. 사용자가 검색 입력
3. React는 입력 이벤트를 먼저 처리
4. 이후 리스트 렌더링 계속 진행
```

이로 인해 **UI가 버벅이지 않고 자연스럽게 반응합니다.**

---

### 우선순위 기반 렌더링

React는 작업에 **priority**를 부여합니다.

예시 우선순위

| 작업                | 우선순위 |
| ------------------- | -------- |
| 사용자 입력         | 높음     |
| 애니메이션          | 높음     |
| 데이터 렌더링       | 보통     |
| 백그라운드 업데이트 | 낮음     |

---

# 3️⃣ Fiber + Concurrent Rendering 관계

```text
Fiber Architecture
        ↓
작업을 분할하고 중단 가능하게 만듦
        ↓
Concurrent Rendering 구현 가능
        ↓
우선순위 기반 렌더링
```

즉,

> **Fiber는 구조이고
> Concurrent Rendering은 그 구조 위에서 동작하는 렌더링 전략입니다.**

---

# 4️⃣ React에서 사용하는 대표 기능

Concurrent Rendering 기반 기능들

### startTransition

```javascript
import { startTransition } from "react";

startTransition(() => {
  setList(data);
});
```

**덜 중요한 업데이트**로 처리됩니다.

---

### useTransition

```javascript
const [isPending, startTransition] = useTransition();
```

- UI 응답성을 유지하면서 상태 업데이트 가능

---

### Suspense

```jsx
<Suspense fallback={<Loading />}>
  <UserList />
</Suspense>
```

- 데이터 로딩과 렌더링을 자연스럽게 연결

---

# 정리

| 개념                    | 설명                                   |
| ----------------------- | -------------------------------------- |
| Fiber                   | React의 새로운 reconciliation 아키텍처 |
| interruptible rendering | 렌더링 중단 가능                       |
| Concurrent Rendering    | 우선순위 기반 렌더링 전략              |
| 효과                    | UI 응답성 개선                         |

---

# 핵심 한 줄 정리

> **Fiber는 렌더링을 잘게 쪼개고
> Concurrent Rendering은 그 작업을 똑똑하게 처리한다.**
