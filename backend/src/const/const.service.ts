import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstService {
  constructor() {}

  public getConstList(): Record<string, string> {
    return {
      SSE_AUTH_CODE_UPDATE: process.env.SSE_AUTH_CODE_UPDATE as string,
      SSE_AUTH_CODE_DELETE: process.env.SSE_AUTH_CODE_DELETE as string,
    };
  }
}
