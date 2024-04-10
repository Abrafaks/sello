import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { AuthService, accessToken } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    return this.authService.logIn(req.user);
  }

  @Post('register')
  register(@Body() data: CreateUserDto): Promise<accessToken> {
    return this.authService.register(data);
  }
}
