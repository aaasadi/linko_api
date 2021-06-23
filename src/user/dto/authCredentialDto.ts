import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  password: string;
}
