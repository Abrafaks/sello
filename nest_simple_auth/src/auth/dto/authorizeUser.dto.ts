import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';

export class AuthorizeUserDto {
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
}
