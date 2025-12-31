module.exports = {
  apps: [
    {
      name: 'nest-api',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules', 'src', 'test', 'docs'],
      max_memory_restart: '512M',
      merge_logs: true,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'nest-scheduler',
      instances: 1,
      script: 'dist/main.js',
      exec_mode: 'fork',
      watch: false,
      ignore_watch: ['node_modules', 'src', 'test', 'docs'],
      max_memory_restart: '512M',
      merge_logs: true,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        SCHEDULER_ONLY: 'true',
      },
    },
  ],
};
