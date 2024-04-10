import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Field firstName must be added' })
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
  })
  @Length(1, 80)
  firstName: string;

  @IsNotEmpty({ message: 'Field secondName must be added' })
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
  })
  @Length(1, 80)
  lastName: string;

  @IsNotEmpty({ message: 'Field email must be added' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
  })
  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsNotEmpty({ message: 'Field password must be added' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: `Password must be between 8 and 255 characters, including 1 of each: lowercase character, uppercase character, number and symbol`,
    },
  )
  @Length(8, 255)
  password: string;

  @IsNotEmpty({ message: 'Field phoneNumber must be added' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
  })
  @IsPhoneNumber(undefined, {
    message: 'Please make sure phoneNumber is valid and include country code',
  })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Field shirtSize must be added' })
  @IsInt()
  @Min(30)
  @Max(60)
  shirtSize: number;

  @IsNotEmpty({ message: 'Field preferredTechnology must be added' })
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
  })
  @Length(1, 80)
  preferredTechnology: string;
}
