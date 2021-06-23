import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from './user.service';
import { AuthCredentialDto } from './dto/authCredentialDto';
import { UserRO } from './ro/user.ro';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Post('/register')
  // register(@Body() body): Promise<UserRO> {
  //   const { verifyId, password } = body;
  //   return this.userService.register(verifyId, password);
  // }

  @Post('/login')
  login(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<UserRO> {
    return this.userService.login(authCredentialDto);
  }

  @Get('/info')
  @UseGuards(AuthGuard)
  info(@User() user) {
    return { user };
  }
}
