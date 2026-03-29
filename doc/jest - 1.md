# 1️⃣ 설치

Node.js 프로젝트에서 먼저 설치:

```bash
npm install --save-dev jest
```

또는

```bash
yarn add --dev jest
```

---

# 2️⃣ 기본 설정

`package.json`에 테스트 스크립트 추가:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

---

# 3️⃣ 테스트 파일 만들기

보통 아래 규칙 중 하나로 파일 생성:

```
sum.test.js
sum.spec.js
```

---

# 4️⃣ 간단한 테스트 작성

### 📌 예제 코드 (sum.js)

```js
function sum(a, b) {
  return a + b;
}

module.exports = sum;
```

### 📌 테스트 코드 (sum.test.js)

```js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

---

# 5️⃣ 테스트 실행

```bash
npm test
```

또는

```bash
npx jest
```

---

# 6️⃣ 주요 문법

## ✔ test / it

```js
test('설명', () => {});
it('설명', () => {});
```

## ✔ expect (검증)

```js
expect(value).toBe(값);
expect(value).toEqual(객체);
expect(value).toBeNull();
expect(value).toBeTruthy();
```

---

# 7️⃣ 그룹 테스트 (describe)

```js
describe('sum 함수 테스트', () => {
  test('1 + 2 = 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

---

# 8️⃣ 비동기 테스트

## Promise

```js
test('async test', () => {
  return expect(Promise.resolve(10)).resolves.toBe(10);
});
```

## async/await

```js
test('async/await test', async () => {
  const data = await Promise.resolve(10);
  expect(data).toBe(10);
});
```

---

# 9️⃣ Mock 함수 (핵심 기능)

```js
const mockFn = jest.fn();

mockFn(1);
mockFn(2);

expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith(1);
```

---

# 🔟 자주 쓰는 기능

* 함수 호출 여부 확인
* API mocking
* snapshot 테스트 (React에서 많이 사용)
* coverage 리포트

```bash
npx jest --coverage
```

