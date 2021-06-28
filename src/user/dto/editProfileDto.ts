import { IsString } from 'class-validator';

export class editProfileDto {
  @IsString()
  name?: string;
  @IsString()
  avatar?: string;
}
