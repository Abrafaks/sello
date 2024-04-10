import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from 'src/auth/auth.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list/:directory(*)')
  async listDirectory(
    @Request() req: RequestWithUser,
    @Param('directory') directory: string,
  ): Promise<string[]> {
    return this.storageService.listDirectory(req, directory);
  }

  @UseGuards(JwtAuthGuard)
  @Get('file/:filepath(*)')
  async readFile(
    @Request() req: RequestWithUser,
    @Param('filepath') filepath: string,
  ): Promise<string> {
    return this.storageService.readFile(req, filepath);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-directory/:directory(*)')
  async createDirectory(
    @Request() req: RequestWithUser,
    @Param('directory') directory: string,
  ): Promise<void> {
    return this.storageService.createDirectory(req, directory);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/:directory(*)')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: RequestWithUser,
    @Param('directory') directory: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.storageService.uploadFile(req, directory, file);
  }
}
