import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { UserService, UserWithoutPassword } from '../user/user.service';
import { AuthorizeUserDto } from './dto/authorizeUser.dto';

export interface JWT_Payload {
  id: number;
  email: string;
}
export interface accessToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: AuthorizeUserDto): Promise<User> {
    const { email, password } = payload;
    const user = await this.userService.findOneByEmail(email);
    const errorMessage = 'User not found or password incorrect';

    if (!user) {
      throw new BadRequestException(errorMessage);
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new BadRequestException(errorMessage);
    }

    return user;
  }

  async logIn(user: UserWithoutPassword): Promise<accessToken> {
    const payload: JWT_Payload = { email: user.email, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(payload: CreateUserDto): Promise<accessToken> {
    const existingUser = await this.userService.findOneByEmail(payload.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const createdUser = await this.userService.create({
      ...payload,
      password: hashedPassword,
    });

    return this.logIn(createdUser);
  }
}
