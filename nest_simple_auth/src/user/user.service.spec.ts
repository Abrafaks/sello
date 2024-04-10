import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

jest.mock('./user.entity');

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        phoneNumber: '123456789',
        shirtSize: 40,
        preferredTechnology: 'NestJS',
      };

      const expectedUser = new User();
      Object.assign(expectedUser, createUserDto);
      expectedUser.id = 1;

      userRepository.create = jest.fn().mockReturnValue(expectedUser);
      userRepository.save = jest.fn().mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        id: expectedUser.id,
        firstName: expectedUser.firstName,
        lastName: expectedUser.lastName,
        email: expectedUser.email,
        phoneNumber: expectedUser.phoneNumber,
        shirtSize: expectedUser.shirtSize,
        preferredTechnology: expectedUser.preferredTechnology,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        phoneNumber: '123456789',
        shirtSize: 40,
        preferredTechnology: 'NestJS',
      };

      userRepository.create = jest.fn().mockReturnValue(new User());
      userRepository.save = jest.fn().mockRejectedValue({ errno: 19 });

      await expect(service.create(createUserDto)).rejects.toThrowError(
        'Email already exists',
      );
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        phoneNumber: '123456789',
        shirtSize: 40,
        preferredTechnology: 'NestJS',
      };

      userRepository.create = jest.fn().mockReturnValue(new User());
      userRepository.save = jest
        .fn()
        .mockRejectedValue(new Error('Some database error'));

      await expect(service.create(createUserDto)).rejects.toThrowError(
        'Internal Server Error',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password',
          phoneNumber: '123456789',
          shirtSize: 40,
          preferredTechnology: 'NestJS',
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          password: 'password',
          phoneNumber: '987654321',
          shirtSize: 42,
          preferredTechnology: 'React',
        },
      ];

      userRepository.find = jest.fn().mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john@example.com';
      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email,
        password: 'password',
        phoneNumber: '123456789',
        shirtSize: 40,
        preferredTechnology: 'NestJS',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(user);

      const result = await service.findOneByEmail(email);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const email = 'unknown@example.com';

      userRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.findOneByEmail(email);

      expect(result).toBeNull();
    });
  });
});
