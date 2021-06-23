import { IsNotEmpty, IsString } from 'class-validator';

export class GetUrlDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}
