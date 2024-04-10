import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

export type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    try {
      const user = this.userRepository.create(createUserDto);
      const {
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        shirtSize,
        preferredTechnology,
      } = await this.userRepository.save(user);

      return {
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        shirtSize,
        preferredTechnology,
      };
    } catch (e) {
      if (e.errno === 19) {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException();
    }
  }
}
