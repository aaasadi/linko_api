import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class changePasswordDto {
  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  current_password: string;

  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  new_password: string;
}
