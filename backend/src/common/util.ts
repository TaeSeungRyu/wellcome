import * as bcrypt from 'bcrypt';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export class FileHelper {
  static async deleteFile(imageUrl: string | undefined): Promise<void> {
    console.log('FileHelper.deleteFile called with imageUrl:', imageUrl);
    if (!imageUrl || imageUrl === '/uploads') return;
    try {
      const fileName = imageUrl.split('/').pop() || Math.random().toString();
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      if (existsSync(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (err) {
      console.error('File delete error:', err);
    }
  }
}
