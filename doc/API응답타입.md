# API 응답 타입 안정성과 공통 타입 설계 전략

## 1. API 응답 타입 안정성

프론트엔드에서 API를 호출할 때 가장 자주 발생하는 문제 중 하나는 **응답 데이터의 형태를 코드가 정확히 보장하지 못하는 것**입니다.  
이 문제를 줄이기 위해서는 **호출 시점의 타입 지정**과 **서버/클라이언트 간 DTO 분리**가 중요합니다.

---

### 1-1. Axios/Fetch 제네릭 사용

TypeScript에서는 Axios나 Fetch를 사용할 때 제네릭을 활용해 응답 타입을 명시할 수 있습니다.

#### 목적

- 응답 데이터 구조를 컴파일 시점에 검증
- 자동완성 및 타입 추론 강화
- 잘못된 프로퍼티 접근 방지

#### 예시

````ts
type UserResponseDto = {
  id: number;
  name: string;
  email: string;
};

const response = await axios.get<UserResponseDto>("/api/user/1");
console.log(response.data.name);


또는 Fetch를 래핑한 경우:

```ts
async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

const user = await request<UserResponseDto>("/api/user/1");
console.log(user.email);
````

#### 장점

- API 응답 구조를 사용하는 쪽에서 명확하게 드러낼 수 있음
- 협업 시 어떤 데이터가 내려오는지 빠르게 이해 가능
- 리팩토링 시 오류를 조기에 발견 가능

#### 주의할 점

- 제네릭은 **실제 런타임 검증**을 해주지는 않음
- 서버 응답이 타입 선언과 다르면 컴파일은 통과해도 런타임 오류가 날 수 있음
- 필요 시 zod, valibot 같은 런타임 스키마 검증 도구와 함께 사용하는 것이 좋음

---

### 1-2. DTO 분리

DTO(Data Transfer Object)는 **외부와 데이터를 주고받기 위한 전송 전용 구조**입니다.
프론트엔드 내부에서 사용하는 모델과 API 응답 구조를 동일하게 두면, 서버 스펙 변경이 내부 로직 전체에 영향을 주기 쉬워집니다.

#### DTO를 분리해야 하는 이유

- 서버 응답 구조와 UI/도메인 모델의 관심사를 분리할 수 있음
- 응답 필드명이 바뀌어도 변환 레이어에서 흡수 가능
- API 의존성을 줄이고 내부 코드의 안정성을 높일 수 있음

#### 예시

```ts
// 서버 응답 DTO
type UserResponseDto = {
  user_id: number;
  user_name: string;
  created_at: string;
};

// 프론트 내부 도메인 타입
type User = {
  id: number;
  name: string;
  createdAt: Date;
};

// DTO -> Domain 변환
function toUser(dto: UserResponseDto): User {
  return {
    id: dto.user_id,
    name: dto.user_name,
    createdAt: new Date(dto.created_at),
  };
}
```

#### 핵심 포인트

- **DTO는 외부 계약**
- **Domain 타입은 내부 비즈니스 모델**
- 둘을 분리하면 변경에 강한 구조를 만들 수 있음

---

## 2. 공통 타입 설계 전략

타입 설계를 할 때 중요한 것은 “재사용”보다 먼저 **책임 분리와 변경 대응력**입니다.
무조건 공통 타입으로 묶기보다, **어떤 레이어에서 어떤 의미로 쓰이는 타입인지**를 먼저 구분해야 합니다.

---

### 2-1. Domain 중심 타입 정의

타입을 API 응답 기준으로만 설계하면 서버 스펙에 프론트 구조가 끌려가기 쉽습니다.
그래서 실제 애플리케이션에서 다루는 핵심 개념, 즉 **Domain 중심으로 타입을 정의**하는 것이 좋습니다.

#### Domain 중심 설계란?

예를 들어 “회원”, “주문”, “정산”, “프로젝트” 같은 비즈니스 개념을 중심으로 타입을 정의하는 방식입니다.

```ts
type Project = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
};
```

이렇게 정의한 Domain 타입은 다음과 같은 특징을 가집니다.

#### 특징

- UI, 상태관리, 비즈니스 로직에서 공통으로 이해되는 개념
- 서버 응답 구조와 독립적으로 유지 가능
- 변경 영향 범위를 줄일 수 있음

#### 장점

- 비즈니스 로직이 API 명세에 덜 종속됨
- 코드 가독성이 좋아짐
- 여러 API 응답을 하나의 도메인 모델로 통합 가능

#### 안 좋은 예

```ts
type Project = {
  project_id: string;
  project_name: string;
  reg_dt: string;
};
```

이런 형태는 사실상 Domain 타입이 아니라 DTO에 가까우며,
프론트 내부 전반에 서버 명세가 퍼질 가능성이 큽니다.

---

### 2-2. Feature 단위 타입 모듈화

공통 타입을 한 파일에 전부 몰아넣으면 처음엔 편해 보여도 점점 관리가 어려워집니다.
특히 프로젝트 규모가 커질수록 “global type dump” 형태가 되기 쉽습니다.

그래서 타입은 가능한 한 **기능 단위(feature)로 모듈화**하는 것이 좋습니다.

#### 예시 구조

```bash
src/
  features/
    user/
      types/
        user.domain.ts
        user.dto.ts
        user.request.ts
    project/
      types/
        project.domain.ts
        project.dto.ts
        project.request.ts
```

#### 분리 기준

- `*.domain.ts`: 내부 비즈니스 모델
- `*.dto.ts`: API 요청/응답 전송 타입
- `*.request.ts`: 검색 조건, 쿼리 파라미터, 폼 요청 타입
- `*.mapper.ts`: DTO와 Domain 간 변환 함수

#### 장점

- 관련 타입을 한 기능 단위에서 찾기 쉬움
- 변경이 생겨도 영향 범위가 명확함
- 도메인 지식이 파일 구조에 자연스럽게 드러남

---

## 3. 실무에서 권장하는 설계 방향

실무에서는 아래 흐름으로 설계하면 비교적 안정적입니다.

### 권장 흐름

1. **API 요청/응답은 DTO로 정의**
2. **화면/비즈니스 로직에서 사용할 타입은 Domain으로 정의**
3. **DTO -> Domain 변환 레이어를 둠**
4. **Feature 단위로 타입 파일을 분리**
5. **공통화는 정말 공통인 경우에만 수행**

---

## 4. 공통 타입 설계 시 주의사항

### 4-1. 너무 이른 공통화 지양

비슷해 보인다고 바로 공통 타입으로 합치면
나중에 요구사항이 달라졌을 때 오히려 분리가 더 어려워질 수 있습니다.

### 4-2. API 타입과 UI 타입을 섞지 않기

응답 그대로를 화면 전역에서 사용하면
서버 필드 변경이 화면 코드 전체에 전파될 수 있습니다.

### 4-3. 범용 이름 남발 주의

`Data`, `Item`, `Info`, `Result` 같은 이름은 의미가 약합니다.
가능하면 `User`, `ProjectSummary`, `SettlementDetail`처럼 구체적으로 정의하는 것이 좋습니다.

### 4-4. Optional 남용 주의

편하다고 모든 필드를 `?` 처리하면
실제로 어떤 값이 반드시 필요한지 알기 어려워지고 안정성이 떨어집니다.

---

## 5. 정리

API 응답 타입 안정성과 공통 타입 설계는 단순히 TypeScript 문법의 문제가 아니라
**변경에 강한 구조를 만들기 위한 설계 문제**에 가깝습니다.

핵심은 다음과 같습니다.

- Axios/Fetch 제네릭으로 응답 타입을 명시한다.
- API 스펙 전용 타입인 DTO를 분리한다.
- 내부 로직은 Domain 중심 타입으로 다룬다.
- 타입은 전역 공통 파일보다 Feature 단위로 모듈화한다.
- DTO와 Domain 사이에는 변환 레이어를 둔다.

이 원칙을 지키면 코드 자동완성 수준을 넘어,
프로젝트 전체의 유지보수성과 확장성을 크게 높일 수 있습니다.
