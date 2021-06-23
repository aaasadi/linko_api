import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkRepository } from './link/link.repository';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(LinkRepository)
    private linkRepository: LinkRepository,
  ) {}
  /** Test */
  getHello() {
    return { message: 'hello word!' };
  }
  async redirect(slug: string) {
    return await this.linkRepository.viewLink(slug);
  }
}
