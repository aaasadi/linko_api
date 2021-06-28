import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ValidationPipe,
  Redirect,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { User } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from './user.service';
import { EmailService } from 'src/email/email.service';
import { AuthCredentialDto } from './dto/authCredentialDto';
import { UserRO } from './ro/user.ro';
import { editProfileDto } from './dto/editProfileDto';
import { changePasswordDto } from './dto/changePasswordDto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  @Post('/register')
  async register(@Body() authCredentialDto: AuthCredentialDto) {
    const user = await this.userService.register(authCredentialDto);
    await this.emailService.verifyEmail(user.email, user.id, user.verifyID);
    return user;
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<UserRO> {
    return await this.userService.login(authCredentialDto);
  }

  @Get('/verify/:user_id/:verify_id')
  @Redirect('http://localhost:3000/panel/login')
  async verify(@Param() param) {
    const { user_id, verify_id } = param;
    await this.userService.verifyEmail(user_id, verify_id);
  }

  @Post('/forget_password')
  async forgetPassword(@Body('email') email: string) {
    const { id, verifyID } = await this.userService.forgetPassword(email);
    try {
      await this.emailService.recoveryEmail(email, id, verifyID);
    } catch (err) {
      console.log(err);
    }
    return { message: 'email send', success: true };
  }

  @Post('/recovery')
  async recovery(@Body() body) {
    const { user_id, newPassword, verify_id } = body;
    return await this.userService.recovery(user_id, newPassword, verify_id);
  }

  @Get('/info')
  @UseGuards(AuthGuard)
  async info(@User('id') user_id) {
    const user = await this.userService.getInfo(user_id);

    return { user: await user.transform() };
  }

  @Put('/edit')
  @UseGuards(AuthGuard)
  editProfile(@User('id') userId, @Body() data: editProfileDto) {
    return this.userService.editProfile(userId, data);
  }

  @Put('/change_password')
  @UseGuards(AuthGuard)
  changePassword(@User('id') userId, @Body() data: changePasswordDto) {
    return this.userService.changePassword(userId, data);
  }
}
