import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';

export class FileHelper {
  static async deleteFile(imageUrl: string | undefined): Promise<void> {
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
