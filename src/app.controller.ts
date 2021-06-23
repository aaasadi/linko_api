import { Controller, Get, Param, Redirect, Render } from '@nestjs/common';
import { version } from 'prettier';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('home')
  home() {
    return { message: 'hello world' };
  }

  @Get('/help')
  @Render('help')
  about() {
    return { title: 'help page' };
  }

  @Get('/version')
  version(): string {
    return 'liko app _ verion: 0.0.1';
  }

  @Get('redirect/:group/:link')
  @Redirect()
  async redirect(@Param() param) {
    const { group, link } = param;
    const url = await this.appService.redirect(`${group}/${link}`);
    return { url };
  }
}
