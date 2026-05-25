import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Auth } from './schemas/auth.schema';
import { LoginUser } from './schemas/login-user.schema';
import { REDIS_CLIENT } from '../redis/redis.constants';
import { SseService } from '../sse/sse.service';
import { ConstService } from '../const/const.service';

// Mongoose Model.method().exec() 패턴을 위한 chainable mock 생성기
const buildChain = (value: unknown) => ({
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(value),
});

describe('AuthService', () => {
  let service: AuthService;
  const authModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  };
  const loginModel = {
    updateMany: jest.fn(),
  };
  const ssePublishEvent = jest.fn();
  const constGetConstList = jest
    .fn()
    .mockReturnValue({
      SSE_AUTH_CODE_UPDATE: 'SSE_AUTH_CODE_UPDATE',
      SSE_AUTH_CODE_DELETE: 'SSE_AUTH_CODE_DELETE',
    });

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: REDIS_CLIENT, useValue: {} },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
        { provide: getModelToken(LoginUser.name), useValue: loginModel },
        { provide: getModelToken(Auth.name), useValue: authModel },
        { provide: SseService, useValue: { publishEvent: ssePublishEvent } },
        { provide: ConstService, useValue: { getConstList: constGetConstList } },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  describe('findAuthAll', () => {
    it('페이징 응답을 표준 형태로 반환한다', async () => {
      authModel.find.mockReturnValue(
        buildChain([{ code: 'ADMIN', name: '관리자', desc: '' }]),
      );
      authModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const res = await service.findAuthAll(2, 5);

      expect(res.result?.success).toBe(true);
      expect(res.result?.data).toMatchObject({
        total: 1,
        page: 2,
        limit: 5,
      });
      expect(Array.isArray((res.result?.data as { auths: unknown[] }).auths)).toBe(
        true,
      );
    });
  });

  describe('isCodeInUse', () => {
    it('코드가 존재하면 success=false, data.isInUse=true', async () => {
      authModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ code: 'ADMIN' }),
      });

      const res = await service.isCodeInUse('ADMIN');

      expect(res.result?.success).toBe(false);
      expect(res.result?.data).toEqual({ isInUse: true });
    });

    it('코드가 없으면 success=true, data.isInUse=false', async () => {
      authModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const res = await service.isCodeInUse('NEW_CODE');

      expect(res.result?.success).toBe(true);
      expect(res.result?.data).toEqual({ isInUse: false });
    });
  });

  describe('deleteCode', () => {
    it('성공 시 사용자 role에서 코드 제거하고 SSE publish 한다', async () => {
      authModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'a1', code: 'OLD' }),
      });
      authModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });
      loginModel.updateMany.mockResolvedValue({ acknowledged: true });

      const res = await service.deleteCode('a1');

      expect(res.result?.success).toBe(true);
      expect(loginModel.updateMany).toHaveBeenCalledWith(
        { role: 'OLD' },
        { $pull: { role: 'OLD' } },
      );
      expect(ssePublishEvent).toHaveBeenCalledTimes(1);
      const event = ssePublishEvent.mock.calls[0][0];
      expect(event.topic).toBe('SSE_AUTH_CODE_DELETE');
      expect(event.data.event).toBe('SSE_AUTH_CODE_DELETE');
      expect(event.data.code).toBe('OLD');
    });

    it('존재하지 않는 코드면 throw', async () => {
      authModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.deleteCode('missing')).rejects.toThrow();
      expect(ssePublishEvent).not.toHaveBeenCalled();
    });
  });
});
