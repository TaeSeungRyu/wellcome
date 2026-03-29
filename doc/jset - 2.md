# 🔥 1. AAA 패턴 (가장 기본)

**Arrange → Act → Assert**

```js
test('유저 생성', () => {
  // Arrange
  const userData = { name: 'kim' };

  // Act
  const result = createUser(userData);

  // Assert
  expect(result.name).toBe('kim');
});
```

👉 테스트를 읽기 쉽게 만드는 핵심 패턴 (거의 필수)

---

# 🔥 2. describe로 도메인 단위 구조화

기능 단위로 테스트를 묶음

```js
describe('User Service', () => {
  describe('createUser', () => {
    test('정상 생성', () => {});
    test('이름 없으면 에러', () => {});
  });
});
```

👉 실무에서는 **파일 구조 = 서비스 구조**로 맞추는 경우 많음

---

# 🔥 3. Mocking (외부 의존성 분리)

DB, API 같은 외부 의존성 제거

```js
const mockRepo = {
  save: jest.fn(),
};

test('유저 저장', async () => {
  mockRepo.save.mockResolvedValue({ id: 1 });

  const result = await createUser(mockRepo, { name: 'kim' });

  expect(mockRepo.save).toHaveBeenCalled();
  expect(result.id).toBe(1);
});
```

👉 핵심:
**"내 코드만 검증하고, 외부는 가짜로"**

---

# 🔥 4. spyOn (기존 함수 감시)

실제 함수는 유지하면서 호출만 확인

```js
const spy = jest.spyOn(console, 'log');

test('로그 호출', () => {
  console.log('hello');

  expect(spy).toHaveBeenCalledWith('hello');
});
```

---

# 🔥 5. beforeEach / afterEach (공통 설정)

```js
let user;

beforeEach(() => {
  user = { name: 'kim' };
});

test('유저 이름', () => {
  expect(user.name).toBe('kim');
});
```

👉 테스트마다 초기 상태 보장 (중요)

---

# 🔥 6. 에러 테스트 패턴

```js
test('에러 발생', () => {
  expect(() => throwError()).toThrow('error');
});
```

비동기:

```js
test('async 에러', async () => {
  await expect(asyncFn()).rejects.toThrow();
});
```

---

# 🔥 7. 테스트 데이터 팩토리 (실무 핵심)

```js
function createUser(overrides = {}) {
  return {
    name: 'default',
    age: 20,
    ...overrides,
  };
}

test('나이 변경', () => {
  const user = createUser({ age: 30 });
  expect(user.age).toBe(30);
});
```

👉 테스트 유지보수성 폭발적으로 좋아짐

---

# 🔥 8. Parameterized Test (데이터 기반 테스트)

```js
test.each([
  [1, 2, 3],
  [2, 3, 5],
])('%i + %i = %i', (a, b, expected) => {
  expect(a + b).toBe(expected);
});
```

👉 반복 테스트 줄이기

---

# 🔥 9. Mock Module (API / 라이브러리)

```js
jest.mock('./api');

const api = require('./api');

api.getUser.mockResolvedValue({ name: 'kim' });
```

👉 네트워크 호출 제거 (CI 안정성 핵심)

---

# 🔥 10. Snapshot 테스트 (UI)

(특히 **React**에서)

```js
import renderer from 'react-test-renderer';

test('UI snapshot', () => {
  const tree = renderer.create(<Button />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

👉 UI 변경 감지 (하지만 남용하면 유지보수 지옥 ⚠️)

---

# 🔥 11. 테스트 레벨 구분 (실무 매우 중요)

### ✅ Unit Test

* 함수 단위
* Mock 적극 사용

### ✅ Integration Test

* 여러 모듈 연결
* DB/서비스 일부 포함

### ✅ E2E Test

* 실제 사용자 흐름
* 도구: **Cypress**, **Playwright**

---

# 🔥 12. 좋은 테스트 기준 (실무 감각)

✔ 빠르게 실행
✔ 독립적 (순서 영향 없음)
✔ 읽기 쉬움
✔ 실패 원인 명확
✔ 외부 의존성 최소화

---

# 💡 실무 핵심 요약

👉 가장 많이 쓰는 조합:

* AAA 패턴
* describe 구조화
* Mock / spyOn
* beforeEach
* factory 함수
* test.each

---
다음 단계
- 👉 “Jest + React Testing Library 실무 패턴”
- 👉 “NestJS에서 Jest 구조 (DI + mock)”
- 👉 “테스트 코드 안티패턴 (실무에서 많이 망하는 것)”
