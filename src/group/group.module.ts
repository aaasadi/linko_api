import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository, UserRepository])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
