import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupRepository } from 'src/group/group.repository';
import { UserRepository } from 'src/user/user.repository';
import { LinkRepository } from './link.repository';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkRepository, GroupRepository, UserRepository]),
  ],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
