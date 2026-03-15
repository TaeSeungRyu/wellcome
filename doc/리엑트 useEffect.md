# Hook 심화

React Hook은 함수형 컴포넌트에서 상태와 라이프사이클을 관리하기 위한 기능입니다.  
그중 **useEffect**는 컴포넌트의 **side effect(부수 효과)** 를 처리하는 핵심 Hook입니다.

---

# 📌 useEffect 동작 타이밍

## 1️⃣ Commit Phase 이후 실행

React 렌더링 과정은 크게 두 단계로 나뉩니다.

1. **Render Phase**
2. **Commit Phase**

`useEffect`는 **DOM 업데이트가 완료된 이후(Commit Phase 이후)** 실행됩니다.

```text
Render Phase
(가상 DOM 계산)

        ↓

Commit Phase
(DOM 실제 반영)

        ↓

useEffect 실행
```

즉,

> **화면이 실제로 업데이트된 이후 effect가 실행됩니다.**

---

## 2️⃣ cleanup 실행 시점

`useEffect`에서 반환하는 함수는 **cleanup 함수**입니다.

```javascript
useEffect(() => {
  console.log("effect 실행");

  return () => {
    console.log("cleanup 실행");
  };
}, [value]);
```

cleanup은 다음 시점에서 실행됩니다.

### 실행 순서

```text
1. 컴포넌트 렌더링
2. commit
3. effect 실행

다음 렌더링 발생

4. cleanup 실행
5. 새로운 effect 실행
```

---

## 3️⃣ 동작 흐름 예시

```javascript
useEffect(() => {
  console.log("effect");

  return () => {
    console.log("cleanup");
  };
}, [count]);
```

### 실행 순서

```text
초기 렌더링
effect

count 변경

cleanup
effect
```

---

## 4️⃣ 컴포넌트 unmount 시

컴포넌트가 제거될 때도 cleanup이 실행됩니다.

```text
effect 실행

컴포넌트 제거 (unmount)

cleanup 실행
```

---

# 📌 useEffect 실행 패턴

### 1️⃣ 매 렌더링마다 실행

```javascript
useEffect(() => {
  console.log("render마다 실행");
});
```

---

### 2️⃣ 최초 한번 실행

```javascript
useEffect(() => {
  console.log("mount 시 실행");
}, []);
```

---

### 3️⃣ 특정 값 변경 시 실행

```javascript
useEffect(() => {
  console.log("count 변경 시 실행");
}, [count]);
```

---

# 📌 핵심 정리

| 개념         | 설명                |
| ------------ | ------------------- |
| 실행 시점    | Commit phase 이후   |
| cleanup 실행 | 다음 effect 실행 전 |
| unmount      | cleanup 실행        |
| 목적         | side effect 처리    |

---

# 한 줄 정리

> **useEffect는 DOM 업데이트 이후 실행되며, 다음 effect 실행 전에 cleanup이 호출됩니다.**
