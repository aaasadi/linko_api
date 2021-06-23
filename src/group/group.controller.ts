import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GroupEntity as Group } from './group.entity';
import { GroupService } from './group.service';
import { GroupDto } from './dto/groupDto';

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  @UseGuards(AuthGuard)
  showGroups(@User('id') userId: string): Promise<Group[]> {
    return this.groupService.showAll(userId);
  }

  @Get('/:name')
  @UseGuards(AuthGuard)
  showOneGroup(
    @Param('name') name: string,
    @User('id') userId: string,
  ): Promise<Group> {
    return this.groupService.showOne(name, userId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  createGroup(
    @Body() data: GroupDto,
    @User('id') userId: string,
  ): Promise<Group> {
    return this.groupService.create(data, userId);
  }

  @Delete('/:name')
  @UseGuards(AuthGuard)
  deleteGroup(
    @Param('name') name: string,
    @User('id') userId: string,
  ): Promise<Group> {
    return this.groupService.remove(name, userId);
  }
}
