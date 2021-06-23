import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetUrlDto } from './dto/getUrlDto';
import { LinkDto } from './dto/linkDto';
import { LinkService } from './link.service';

@Controller('links')
export class LinkController {
  constructor(private linkService: LinkService) {}

  @Get()
  @UseGuards(AuthGuard)
  showAll(@User('id') userId: string) {
    return this.linkService.showAll(userId);
  }

  @Post('/slug')
  @UseGuards(AuthGuard)
  getLink(@Body() data: GetUrlDto, @User('id') userId: string) {
    return this.linkService.getLink(data, userId);
  }

  @Post('/check')
  @UseGuards(AuthGuard)
  checkLink(@Body('link') link: string) {
    return this.linkService.checkLink(link);
  }

  @Post('/:domain')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  createLink(
    @Param('domain') domain: string,
    @Body() link: LinkDto,
    @User('id') userId: string,
  ) {
    return this.linkService.create(domain, link, userId);
  }

  @Put('/')
  @UseGuards(AuthGuard)
  updateUrl(@Body() data, @User('id') userId: string) {
    return this.linkService.updateUrl(data, userId);
  }
}
