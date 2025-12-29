module.exports = {
  apps: [
    {
      // PM2에서 보이는 애플리케이션 이름
      // pm2 list / pm2 logs nest-api
      name: 'nest-api',
      // PM2가 실행할 엔트리 파일
      // NestJS 빌드 결과물 (ts가 아니라 js)
      script: 'dist/main.js',
      // 실행할 인스턴스 개수
      // '2' = 2개의 Node 프로세스
      // ⚠️ @nestjs/schedule 사용 시 크론이 2번 실행됨
      instances: '2',
      // 실행 모드
      // cluster = Node.js cluster 사용 (CPU 코어 활용)
      // fork = 단일 프로세스
      exec_mode: 'cluster',
      // 파일 변경 감지 시 자동 재시작
      // ⚠️ Docker / 운영 환경에서는 거의 항상 false 권장
      watch: true,
      // watch가 켜져 있을 때, 감시하지 않을 경로
      // node_modules, src 등 변경이 잦은 디렉토리 제외
      ignore_watch: ['node_modules', 'src', 'test', 'docs'],
      // 프로세스가 지정 메모리를 초과하면 자동 재시작
      // 메모리 누수 방지용
      max_memory_restart: '512M',
      // 여러 인스턴스 로그를 하나로 합침
      merge_logs: true,
      // 프로세스가 죽으면 자동 재시작
      autorestart: true,
      // 실행 환경 변수 (process.env)
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
