import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';

/**
 * 이미지 업로드용 Multer 설정.
 * - uploads/ 디렉토리에 `원본이름-timestamp.확장자` 형태로 저장
 * - jpg / jpeg / png / gif 만 허용
 */
export const multerImageOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, callback) => {
      const originalName = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );
      const ext = path.extname(originalName);
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
};
