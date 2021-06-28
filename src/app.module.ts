import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { LinkModule } from './link/link.module';
import { GroupModule } from './group/group.module';
import { LinkRepository } from './link/link.repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkRepository]),
    CoreModule,
    UserModule,
    LinkModule,
    GroupModule,
    AdminModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
