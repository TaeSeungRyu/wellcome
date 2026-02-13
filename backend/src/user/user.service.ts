import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { ResponseDto } from 'src/common/common.dto';
import { UpdateUserDto, UserDto } from './user.dto';
import { FileHelper, hashPassword } from 'src/common/util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  private async findUserOrThrow(username: string): Promise<UserDocument> {
    const result = await this.userModel.aggregate<UserDocument>([
      { $match: { username: username } },
      {
        $lookup: {
          from: 'auth',
          localField: 'role',
          foreignField: 'code',
          as: 'authList',
        },
      },
    ]);
    const user = result[0];
    if (!user) {
      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'user_not_found',
          '사용자를 찾을 수 없습니다.',
        ),
      );
    }
    return user;
  }

  async findByUsername(username: string): Promise<ResponseDto> {
    const user = await this.findUserOrThrow(username);
    const data = user as Partial<User>;
    if (data.profileImage) data.profileImage = `/user${data.profileImage}`;
    if (data?.password) {
      delete data.password;
    }
    if (data?.role) {
      data.role = data.authList?.map((tt: { code: string; name: string }) => ({
        value: tt.code,
        label: tt.name,
      }));
      delete data.authList;
    }
    return new ResponseDto({ success: true, data }, '', '성공', 200);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<ResponseDto> {
    try {
      const skip = (page - 1) * limit;

      const [result] = await this.userModel.aggregate<{
        users: any[];
        totalCount: Array<{ count: number }>;
      }>([
        {
          $facet: {
            users: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              // 🔥 auth 컬렉션과 조인
              {
                $lookup: {
                  from: 'auth', // auth 컬렉션 이름
                  localField: 'role', // 배열
                  foreignField: 'code',
                  as: 'authList',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        code: 1,
                        name: 1,
                      },
                    },
                  ],
                },
              },
              {
                $set: {
                  role: '$authList', // 🔥 role을 authList로 교체
                },
              },
              // 비밀번호 제거
              {
                $project: {
                  password: 0,
                  profileImage: 0,
                },
              },
            ],

            totalCount: [{ $count: 'count' }],
          },
        },
      ]);
      const users = result.users;
      const total = result.totalCount[0]?.count ?? 0;
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
          'find_error',
          error instanceof Error
            ? error.message
            : '사용자 조회 중 오류가 발생했습니다.',
        ),
      );
    }
  }

  async checkExistUser(username: string): Promise<ResponseDto> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user) {
      return new ResponseDto(
        { success: true, data: { exists: true } },
        '',
        '사용자가 존재합니다.',
        200,
      );
    } else {
      return new ResponseDto(
        { success: true, data: { exists: false } },
        '',
        '사용자가 존재하지 않습니다.',
        200,
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

  async updateUser(updateData: UpdateUserDto): Promise<ResponseDto> {
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

  async createUserWithFile(
    userData: UserDto,
    file?: Express.Multer.File,
  ): Promise<ResponseDto> {
    // 1. 중복 체크
    const exists = await this.userModel.exists({ username: userData.username });
    if (exists) throw new BadRequestException(/* 중복 에러 DTO */);

    // 2. 가공 및 저장
    userData.password = await hashPassword(userData.password);
    const profileImage = file ? `/uploads/${file.filename}` : '/uploads';

    const result = await new this.userModel({
      ...userData,
      profileImage,
    }).save();
    return new ResponseDto({ success: true, data: result }, '', '성공');
  }

  async updateUserWithFile(
    updateData: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<ResponseDto> {
    if (!updateData.username) {
      throw new BadRequestException(/* 사용자 이름 누락 에러 DTO */);
    }

    const user = await this.findUserOrThrow(updateData.username);

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    if (file) {
      if (user.profileImage) {
        const filePath = user.profileImage.replace(/^\/user/, '');
        await FileHelper.deleteFile(filePath);
      }
      updateData['profileImage'] = `/uploads/${file.filename}`;
    } else if (updateData.profileImage === '') {
      await FileHelper.deleteFile(user.profileImage); // 기존 파일 삭제 (추출된 헬퍼 사용)
      updateData['profileImage'] = '';
    } else {
      updateData.profileImage = user.profileImage;
    }
    const updated = await this.userModel
      .findOneAndUpdate({ username: updateData.username }, updateData, {
        new: true,
      })
      .select('-password')
      .exec();

    return new ResponseDto({ success: true, data: updated }, '', '수정 완료');
  }

  async deleteUser(username: string): Promise<ResponseDto> {
    const user = await this.findUserOrThrow(username);
    await FileHelper.deleteFile(user.profileImage); // 삭제 시 이미지도 함께 제거
    await user.deleteOne();

    return new ResponseDto({ success: true }, '', '삭제 완료');
  }
}
