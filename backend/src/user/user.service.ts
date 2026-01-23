import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { ResponseDto } from 'src/common/common.dto';
import { UserDto } from './user.dto';
import { hashPassword } from 'src/common/util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<ResponseDto> {
    const user = await this.userModel
      .findOne({ username })
      .select('-password')
      .exec();
    if (!user) {
      throw new BadRequestException(
        new ResponseDto(
          {
            success: false,
          },
          'user_not_found',
          '해당 사용자를 찾을 수 없습니다.',
        ),
      );
    }
    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            success: true,
            data: user,
          },
          '',
          '사용자 정보를 성공적으로 조회했습니다.',
          200,
        ),
      );
    });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ResponseDto> {
    try {
      // 1. skip 계산 (예: 2페이지이고 limit이 10이면 앞에 10개를 건너뜀)
      const skip = (page - 1) * limit;

      // 2. 데이터 조회와 전체 개수 파악을 동시에 실행 (성능 최적화)
      const [users, total] = await Promise.all([
        this.userModel
          .find()
          .select('-password') // 비밀번호 제외
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }) // 최신순 정렬
          .exec(),
        this.userModel.countDocuments().exec(), // 전체 사용자 수
      ]);

      // 3. 응답 데이터 구성 (현재 페이지, 전체 페이지 등 추가 정보 제공)
      const paginationData = {
        users,
        total,
        page,
        limit,
      };

      return new ResponseDto(
        {
          success: true,
          data: paginationData,
        },
        '',
        '사용자 목록을 성공적으로 조회했습니다.',
        200,
      );
    } catch (error) {
      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'save_error',
          error instanceof Error
            ? error.message
            : '사용자 조회 중 오류가 발생했습니다.',
        ),
      );
    }
  }

  async createUser(userData: UserDto): Promise<ResponseDto> {
    try {
      // 1. 중복 체크
      const check = await this.findByUsername(userData.username).catch(
        () => null,
      );
      if (check?.result?.success) {
        throw new BadRequestException(
          new ResponseDto(
            { success: false },
            'user_already_exists',
            '이미 존재하는 사용자 이름입니다.',
            200,
          ),
        );
      }

      // 2. 비밀번호 해싱
      userData.password = await hashPassword(userData.password);

      const newUser = new this.userModel(userData);
      const result = await newUser.save();

      // 3. result 확인 (성공 시)
      if (result) {
        return new ResponseDto(
          { success: true, data: result },
          '',
          '사용자 생성에 성공했습니다.',
          200,
        );
      }
      throw new Error('Save failed');
    } catch (error) {
      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'save_error',
          error instanceof Error
            ? error.message
            : '사용자 생성 중 오류가 발생했습니다.',
        ),
      );
    }
  }

  async updateUser(updateData: UserDto): Promise<ResponseDto> {
    try {
      const { username, password } = updateData;

      if (password) {
        updateData.password = await hashPassword(password);
      }

      const updateResult = await this.userModel
        .findOneAndUpdate({ username }, updateData, {
          new: true, // 업데이트 후의 문서를 반환
          runValidators: true, // 업데이트 시에도 스키마 유효성 검사 실행
        })
        .select('-password') // 비밀번호 필드 제외
        .exec();
      if (!updateResult) {
        throw new BadRequestException(
          new ResponseDto(
            { success: false },
            'user_not_found',
            '해당 사용자를 찾을 수 없습니다.',
          ),
        );
      }
      return new ResponseDto(
        { success: true, data: updateResult },
        '',
        '사용자 정보가 성공적으로 업데이트되었습니다.',
        200,
      );
    } catch (error) {
      // DB 에러 또는 유효성 검사 실패 시
      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'update_error',
          error instanceof Error
            ? error.message
            : '사용자 생성 중 오류가 발생했습니다.',
        ),
      );
    }
  }

  async deleteUser(username: string): Promise<ResponseDto> {
    try {
      // 1. 사용자 삭제 시도
      const deletedUser = await this.userModel
        .findOneAndDelete({ username })
        .exec();

      // 2. 삭제할 사용자가 없는 경우
      if (!deletedUser) {
        throw new BadRequestException(
          new ResponseDto(
            { success: false },
            'user_not_found',
            '삭제하려는 사용자를 찾을 수 없습니다.',
            400,
          ),
        );
      }

      // 3. 삭제 성공 응답
      return new ResponseDto(
        { success: true, data: deletedUser },
        '',
        '사용자가 성공적으로 삭제되었습니다.',
      );
    } catch (error) {
      // 이미 BadRequestException인 경우는 그대로 던지고, 그 외 DB 에러 등은 새로 정의
      if (error instanceof BadRequestException) throw error;

      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'delete_error',
          '사용자 삭제 중 오류가 발생했습니다.',
          400,
        ),
      );
    }
  }

  async getAuthList(): Promise<ResponseDto> {
    try {
      // 1. 사용자 권한 목록 조회 (중복 제거)
      const roles = await this.userModel.distinct('role').exec();

      // 2. 응답 반환
      return new ResponseDto(
        { success: true, data: roles },
        '',
        '사용자 권한 목록을 성공적으로 조회했습니다.',
        200,
      );
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'fetch_error',
          '사용자 권한 목록 조회 중 오류가 발생했습니다.',
        ),
      );
    }
  }
}
