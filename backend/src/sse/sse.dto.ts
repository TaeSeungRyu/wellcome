import { Observable, ReplaySubject } from 'rxjs';
import { Response } from 'express';

export interface SseMessageEvent {
  data: string | object;
  id?: string;
}

export type SseEvent = {
  event: string;
  data: string | object;
  id?: string;
};

export type SseClient = {
  id: string;
  subject: ReplaySubject<unknown>;
  observer: Observable<unknown>;
  response?: Response | null;
};
