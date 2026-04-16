import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseDto } from '../common/dto/response.dto';
import { FileHelper } from '../common/utils/file.util';
import { hashPassword } from '../common/utils/hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  private async findUserOrThrow(username: string): Promise<UserDocument> {
    const result = await this.userModel.aggregate<UserDocument>([
      { $match: { username } },
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
    if (data?.password) delete data.password;
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
              {
                $lookup: {
                  from: 'auth',
                  localField: 'role',
                  foreignField: 'code',
                  as: 'authList',
                  pipeline: [{ $project: { _id: 0, code: 1, name: 1 } }],
                },
              },
              { $set: { role: '$authList' } },
              { $project: { password: 0, profileImage: 0 } },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);
      const users = result.users;
      const total = result.totalCount[0]?.count ?? 0;
      return new ResponseDto(
        {
          success: true,
          data: { users, total, page, limit },
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
    const exists = !!user;
    return new ResponseDto(
      { success: true, data: { exists } },
      '',
      exists ? '사용자가 존재합니다.' : '사용자가 존재하지 않습니다.',
      200,
    );
  }

  async createUser(userData: CreateUserDto): Promise<ResponseDto> {
    try {
      const exists = await this.findByUsername(userData.username).catch(
        () => null,
      );
      if (exists?.result?.success) {
        throw new BadRequestException(
          new ResponseDto(
            { success: false },
            'user_already_exists',
            '이미 존재하는 사용자 이름입니다.',
            200,
          ),
        );
      }

      userData.password = await hashPassword(userData.password);
      const result = await new this.userModel(userData).save();
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
          new: true,
          runValidators: true,
        })
        .select('-password')
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
      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'update_error',
          error instanceof Error
            ? error.message
            : '사용자 수정 중 오류가 발생했습니다.',
        ),
      );
    }
  }

  async createUserWithFile(
    userData: CreateUserDto,
    file?: Express.Multer.File,
  ): Promise<ResponseDto> {
    const exists = await this.userModel.exists({ username: userData.username });
    if (exists) {
      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'user_already_exists',
          '이미 존재하는 사용자 이름입니다.',
        ),
      );
    }

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
      throw new BadRequestException(
        new ResponseDto(
          { success: false },
          'username_required',
          '사용자 이름이 필요합니다.',
        ),
      );
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
      updateData.profileImage = `/uploads/${file.filename}`;
    } else if (updateData.profileImage === '') {
      await FileHelper.deleteFile(user.profileImage);
      updateData.profileImage = '';
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
    await FileHelper.deleteFile(user.profileImage);
    await user.deleteOne();
    return new ResponseDto({ success: true }, '', '삭제 완료');
  }
}
