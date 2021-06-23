import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get('/')
  @Render('admin/dashboard')
  dashboard() {
    return { title: 'admin page' };
  }

  @Get('/login')
  @Render('admin/login')
  login() {
    return { title: 'login page' };
  }
}
