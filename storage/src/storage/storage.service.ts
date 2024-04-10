import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { RequestWithUser } from 'src/auth/auth.controller';

@Injectable()
export class StorageService {
  async listDirectory(
    req: RequestWithUser,
    directory: string,
  ): Promise<string[]> {
    const directoryPath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      req.user.id.toString(),
      directory,
    );

    try {
      const items = await fs.readdir(directoryPath);
      const filesAndDirectories: string[] = [];
      for (const item of items) {
        const itemPath = path.join(directoryPath, item);
        const stats = await fs.stat(itemPath);

        if (stats.isDirectory()) {
          filesAndDirectories.push(item + '/');
        } else {
          filesAndDirectories.push(item);
        }
      }

      return this.sortDirectoryList(filesAndDirectories);
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new BadRequestException('No such directory');
      }

      throw new Error(`Error listing directory ${directory}: ${e.message}`);
    }
  }

  async readFile(req: RequestWithUser, filePath: string): Promise<string> {
    try {
      const directory = path.join('uploads', req.user.id.toString(), filePath);

      const fileContent = await fs.readFile(directory, 'utf-8');
      return fileContent;
    } catch (e) {
      if (e.code === 'EISDIR') {
        throw new BadRequestException(
          'The requested resource is a directory. Try to read a file',
        );
      }

      if (e.code === 'ENOENT') {
        throw new BadRequestException('No such file or directory');
      }

      throw new InternalServerErrorException();
    }
  }

  async createDirectory(
    req: RequestWithUser,
    directoryPath: string,
  ): Promise<void> {
    const directory = path.join(
      'uploads',
      req.user.id.toString(),
      directoryPath,
    );
    await fs.mkdir(directory, { recursive: true });
  }

  async uploadFile(
    req: RequestWithUser,
    directory: string,
    file: Express.Multer.File,
  ): Promise<void> {
    const uploadsDir = path.join('uploads', req.user.id.toString(), directory);
    const filePath = path.join(uploadsDir, file.originalname);

    try {
      await fs.access(uploadsDir);
    } catch (e) {
      if (e.code === 'ENOENT') {
        await fs.mkdir(uploadsDir, { recursive: true });
      } else {
        throw e;
      }
    }

    await fs.writeFile(filePath, file.buffer);
  }

  private sortDirectoryList(list: string[]): string[] {
    list.sort((a, b) => {
      const endsWithSlashA = a.endsWith('/');
      const endsWithSlashB = b.endsWith('/');
      if (endsWithSlashA && !endsWithSlashB) {
        return -1;
      } else if (!endsWithSlashA && endsWithSlashB) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });

    return list;
  }
}
