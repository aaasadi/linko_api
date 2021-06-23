import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class GroupDto {
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;
}
