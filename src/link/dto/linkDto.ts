import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class LinkDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
