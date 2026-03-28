# 1. CDN 전략의 기반 이론

## ① 분산 시스템 (Distributed Systems)

* 여러 서버를 전 세계에 분산 배치
* 사용자 요청을 **가장 가까운 서버로 라우팅**
* 핵심 개념:

  * 지연(latency) 최소화
  * 장애 허용성(fault tolerance)
  * 수평 확장(horizontal scaling)

👉 CDN은 전형적인 “지리적 분산 시스템”입니다.

---

## ② CAP 정리 (CAP Theorem)

* Consistency (일관성)
* Availability (가용성)
* Partition Tolerance (네트워크 분할 허용)

CDN은 보통:

* **AP (가용성 + 분할 허용)** 선택
* 약한 일관성(Eventual Consistency) 사용

👉 캐시가 약간 오래된 데이터라도 빠르게 응답하는 것이 더 중요

---

## ③ 지연 최소화 이론 (Latency Optimization)

* 물리적으로 가까운 서버가 빠름 (빛의 속도 한계)
* RTT (Round Trip Time) 감소가 핵심

👉 Edge 서버를 쓰는 이유 자체가 이 이론 때문

---

# 2. Edge 캐싱 관련 이론

## ① 캐시 이론 (Caching Theory)

핵심 개념:

* Temporal Locality (시간 지역성)
* Spatial Locality (공간 지역성)

👉 “최근 요청된 콘텐츠는 다시 요청될 확률이 높다”

---

## ② 캐시 교체 알고리즘

대표 알고리즘:

* LRU (Least Recently Used)
* LFU (Least Frequently Used)
* FIFO

👉 CDN Edge 서버는 대부분 LRU 기반

---

## ③ TTL (Time To Live)

* 캐시 유지 시간
* 너무 길면:

  * stale data 문제
* 너무 짧으면:

  * 캐시 효과 감소

👉 TTL은 성능 vs 정확성 trade-off

---

## ④ Cache Invalidation (캐시 무효화)

* “컴퓨터 공학에서 가장 어려운 문제 중 하나”
* 전략:

  * TTL 기반 만료
  * Versioning (파일명 변경)
  * Purge API

---

## ⑤ Cache Hit Ratio

* Hit: 캐시에 있음
* Miss: 원 서버로 감

👉 CDN 성능 핵심 지표:

* Hit Ratio ↑ → 비용 ↓ + 속도 ↑

---

# 3. 지역별 응답 최적화 이론

## ① Anycast 라우팅

* 동일한 IP를 여러 서버가 공유
* 네트워크가 자동으로 **가장 가까운 서버로 라우팅**

👉 CDN의 핵심 기술

---

## ② GeoDNS (지리 기반 DNS)

* 사용자 위치 기반으로 다른 IP 반환

예:

* 한국 → 서울 서버
* 미국 → LA 서버

---

## ③ Load Balancing (부하 분산)

* 서버 간 트래픽 분산

알고리즘:

* Round Robin
* Least Connections
* Latency-based routing

---

## ④ 네트워크 최적화

* TCP 최적화 (Slow Start 개선)
* HTTP/2, HTTP/3 (QUIC)
* Connection reuse

---

## ⑤ 콘텐츠 최적화

* 이미지 압축
* WebP / AVIF 변환
* Gzip / Brotli 압축

👉 전송 데이터 자체를 줄이는 접근

---

# 4. 성능 모델 & 이론

## ① 큐잉 이론 (Queueing Theory)

* 요청 대기 시간 분석
* CDN은 대기열을 분산시켜 지연 감소

---

## ② Amdahl’s Law

* 전체 성능은 가장 느린 부분에 의해 제한됨

👉 CDN으로 “네트워크 병목”을 제거

---

## ③ Zipf’s Law (트래픽 분포)

* 일부 인기 콘텐츠가 대부분 요청을 차지

👉 CDN 캐싱이 효과적인 이유:

* 상위 10% 콘텐츠가 트래픽 90% 차지

---

# 5. 실무적으로 묶으면

이 3개 개념은 이렇게 연결됩니다:

* CDN 전략
  → 분산 시스템 + 네트워크 최적화

* Edge 캐싱
  → 캐시 이론 + 지역성 + TTL 전략

* 지역별 응답 최적화
  → Anycast + GeoDNS + Load Balancing

---

# 핵심 한 줄 요약

👉 **“사용자와 데이터를 최대한 가깝게 배치하고, 반복 요청은 캐싱하여, 네트워크 지연을 최소화하는 것이 CDN의 본질”**

---
