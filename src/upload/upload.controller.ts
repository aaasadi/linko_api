import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('upload')
export class UploadController {
  /** Upload avatar */
  @Post('/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadAvatar(@UploadedFile() avatar: Express.Multer.File) {
    console.log(avatar);
    return {
      url: `http://localhost:8000/${avatar.filename}`,
    };
  }
}
