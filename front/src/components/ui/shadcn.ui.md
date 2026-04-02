# shadcn/ui 이론 및 원리 정리

## 1. 개요

shadcn/ui는 전통적인 UI 라이브러리와 다르게 "설치해서 사용하는 컴포넌트 라이브러리"가 아니라,
**코드를 직접 프로젝트에 복사하여 사용하는 방식**의 UI 시스템이다.

즉, 라이브러리에 의존하는 것이 아니라,
👉 "내 프로젝트의 일부로 UI를 소유"하는 철학을 가진다.

---

## 2. 핵심 철학 (Philosophy)

### 2.1 Copy & Own

- 컴포넌트를 npm으로 import 하지 않음
- CLI를 통해 코드 파일을 직접 생성
- 이후 완전히 내 코드처럼 수정 가능

➡️ 장점

- 커스터마이징 자유도 ↑
- 라이브러리 버전 충돌 없음
- 디버깅 쉬움

➡️ 단점

- 업데이트 자동 반영 안됨
- 유지보수는 개발자 책임

---

### 2.2 Headless + Styled

shadcn/ui는 내부적으로 다음을 조합한다:

- Radix UI → 접근성과 동작
- Tailwind CSS → 스타일링

즉,
👉 "동작은 Radix, 스타일은 Tailwind"

---

### 2.3 Composition 중심 설계

컴포넌트는 작은 단위로 쪼개져 있음

예:

```
<Button>
<Card>
<Dialog>
```

하지만 내부적으로는

```
Dialog
 ├── DialogTrigger
 ├── DialogContent
 ├── DialogHeader
 └── DialogFooter
```

➡️ 필요한 구조만 선택적으로 조합 가능

---

## 3. 구조 및 동작 원리

### 3.1 CLI 기반 코드 생성

```bash
npx shadcn-ui@latest add button
```

동작 방식:

1. 컴포넌트 템플릿 다운로드
2. 프로젝트 내부에 파일 생성
3. Tailwind + Radix 기반 코드 포함

➡️ 결과: `/components/ui/button.tsx` 생성

---

### 3.2 의존성 구조

| 구성 요소                      | 역할              |
| ------------------------------ | ----------------- |
| Radix UI                       | 접근성, 상태 관리 |
| Tailwind                       | 스타일            |
| class-variance-authority (cva) | variant 관리      |
| clsx / cn                      | 클래스 병합       |

---

### 3.3 cn 유틸 함수

```ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

역할:

- 조건부 클래스 처리
- Tailwind 충돌 해결

➡️ 예:

```
p-2 p-4 → p-4만 적용
```

---

## 4. Variant 시스템 (cva)

shadcn/ui는 `cva`를 사용해 variant를 관리한다.

```ts
const buttonVariants = cva("base-style", {
  variants: {
    variant: {
      default: "bg-primary",
      outline: "border",
    },
    size: {
      sm: "h-8",
      lg: "h-12",
    },
  },
});
```

➡️ 사용

```tsx
<Button variant="outline" size="sm" />
```

➡️ 장점

- 디자인 시스템 일관성 유지
- props 기반 스타일 제어

---

## 5. 스타일링 원리 (Tailwind)

shadcn/ui는 CSS-in-JS를 사용하지 않고
👉 **Utility First (Tailwind)** 방식 사용

특징:

- 클래스 조합으로 UI 구성
- 런타임 스타일 없음
- 빌드 시 최적화

➡️ 결과

- 성능 우수
- 스타일 추적 쉬움

---

## 6. 접근성 (Accessibility)

Radix UI 기반으로 다음을 자동 지원:

- 키보드 네비게이션
- ARIA 속성
- Focus 관리

➡️ 개발자는 스타일과 구조에 집중 가능

---

## 7. 장점 정리

- 완전한 커스터마이징 가능
- 디자인 시스템 구축에 유리
- 의존성 최소화
- 타입 안정성 (TypeScript 기반)

---

## 8. 단점 및 고려사항

- 자동 업데이트 없음
- 초기 세팅 필요 (Tailwind, config 등)
- 코드 중복 가능성

---

## 9. 기존 UI 라이브러리와 비교

| 항목         | shadcn/ui        | 기존 UI 라이브러리 |
| ------------ | ---------------- | ------------------ |
| 사용 방식    | 코드 복사        | npm import         |
| 커스터마이징 | 매우 자유로움    | 제한적             |
| 업데이트     | 수동             | 자동               |
| 번들 크기    | 필요 코드만 포함 | 전체 포함 가능     |

---

## 10. 언제 사용하면 좋은가?

✔ 디자인 시스템 구축할 때
✔ 커스터마이징이 중요한 프로젝트
✔ Tailwind 기반 프로젝트

❌ 빠르게 MVP만 만들 때 (오버엔지니어링 가능)

---

## 11. 실무 적용 전략

### 11.1 공통 UI 레이어 분리

```
/components/ui
```

### 11.2 variant 기준 설계

- size
- variant
- state

### 11.3 디자인 토큰 관리

- colors
- spacing
- radius

---

## 12. 결론

shadcn/ui는 단순한 UI 라이브러리가 아니라,
👉 "UI를 코드로 소유하는 방식"이다.

즉,

- 라이브러리를 사용하는 것이 아니라
- 디자인 시스템을 직접 구축하는 접근이다.

---

## 13. 추가 학습 키워드

- Radix UI
- Tailwind CSS
- cva (class-variance-authority)
- design system
- headless UI

---

## 14. 개인 정리 (메모)

- cn 에러 발생 시 → utils 파일 확인
- Tailwind config 경로 중요
- alias (@/) 설정 필수

---
