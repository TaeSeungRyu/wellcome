import { BadRequestException, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // 저장 경로
        filename: (_req, file, callback) => {
          const originalName = Buffer.from(
            file.originalname,
            'latin1',
          ).toString('utf8');
          const ext = extname(originalName);
          const name = path.basename(originalName, ext);
          callback(null, `${name}-${Date.now()}${ext}`);
        },
      }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('이미지 파일만 업로드 가능합니다!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
