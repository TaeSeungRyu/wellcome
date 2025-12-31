import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly isScheduler: boolean;
  private readonly isProd: boolean;

  constructor() {
    this.isScheduler = process.env.SCHEDULER_ONLY === 'true';
    this.isProd = process.env.NODE_ENV === 'production';
    if (!process.env.NODE_ENV) {
      this.isProd = true;
      this.isScheduler = true;
    }
  }

  // 매일 자정
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    if (!this.isProd || !this.isScheduler) return;
    console.log('Midnight cron job executed');
  }
  // 매 1분
  @Cron('*/1 * * * *')
  handleEveryOneMinute() {
    if (!this.isProd || !this.isScheduler) return;
    console.log('1 minute cron');
  }
  @Interval(1000 * 10) // 10초
  handleInterval() {
    if (!this.isProd || !this.isScheduler) return;
    console.log('10 seconds interval');
  }
  @Timeout(5000) // 서버 시작 후 5초 뒤
  handleTimeout() {
    if (!this.isProd || !this.isScheduler) return;
    console.log('just one time after 5 seconds');
  }
}
