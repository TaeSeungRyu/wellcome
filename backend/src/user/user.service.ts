import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { ResponseDto } from 'src/common/common.dto';
import { UserDto } from './user.dto';

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
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              success: false,
            },
            'user_not_found',
            '해당 사용자를 찾을 수 없습니다.',
          ),
        );
      });
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
        ),
      );
    });
  }

  async createUser(userData: Partial<UserDto>): Promise<ResponseDto> {
    try {
      // 1. 중복 체크
      const check = await this.findByUsername(userData.username as string);
      if (check.result?.success) {
        return new ResponseDto(
          { success: false },
          'user_already_exists',
          '이미 존재하는 사용자 이름입니다.',
        );
      }

      const newUser = new this.userModel(userData);
      const result = await newUser.save();

      // 3. result 확인 (성공 시)
      if (result) {
        return new ResponseDto(
          { success: true, data: result },
          '',
          '사용자 생성에 성공했습니다.',
        );
      }
      throw new Error('Save failed');
    } catch (error) {
      return new ResponseDto(
        { success: false },
        'save_error',
        error instanceof Error
          ? error.message
          : '사용자 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async updateUser(
    username: string,
    updateData: Partial<UserDto>,
  ): Promise<ResponseDto> {
    try {
      const updateResult = await this.userModel
        .findOneAndUpdate({ username }, updateData, {
          new: true, // 업데이트 후의 문서를 반환
          runValidators: true, // 업데이트 시에도 스키마 유효성 검사 실행
        })
        .select('-password') // 비밀번호 필드 제외
        .exec();
      if (!updateResult) {
        return new ResponseDto(
          { success: false },
          'user_not_found',
          '해당 사용자를 찾을 수 없습니다.',
        );
      }
      return new ResponseDto(
        { success: true, data: updateResult },
        '',
        '사용자 정보가 성공적으로 업데이트되었습니다.',
      );
    } catch (error) {
      // DB 에러 또는 유효성 검사 실패 시
      return new ResponseDto(
        { success: false },
        'update_error',
        error instanceof Error
          ? error.message
          : '사용자 생성 중 오류가 발생했습니다.',
      );
    }
  }
}
