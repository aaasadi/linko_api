import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkDto } from './dto/linkDto';
import { LinkEntity } from './link.entity';
import { LinkRepository } from './link.repository';
import { GroupRepository } from 'src/group/group.repository';
import { UserRepository } from 'src/user/user.repository';
import { GetUrlDto } from './dto/getUrlDto';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(LinkRepository)
    private linkRepository: LinkRepository,
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  /** Show all links of User */
  async showAll(userId: string): Promise<LinkEntity[]> {
    const user = await this.userRepository.findUser(userId);
    return await this.linkRepository.findAllLinks(user);
  }
  /** get URL of link */
  async getLink(data: GetUrlDto, userId: string): Promise<LinkEntity> {
    await this.userRepository.findUser(userId);
    const { slug } = data;
    if (slug.split('/').length > 2)
      throw new BadRequestException('Slug is false');
    return await this.linkRepository.findLink(slug);
  }
  /** Create link of user with group */
  async checkLink(slug: string): Promise<boolean> {
    const link = this.linkRepository.findOne({ where: { slug } });
    return !(await link);
  }
  async create(
    nameOfGroup: string,
    link: LinkDto,
    userId: string,
  ): Promise<LinkEntity> {
    const user = await this.userRepository.findUser(userId);
    const group = await this.groupRepository.findGroup(nameOfGroup, user);
    return await this.linkRepository.createLink(group, link, user);
  }

  async updateUrl(data, userId: string) {
    const user = await this.userRepository.findUser(userId);
    return await this.linkRepository.updateUrl(data, user);
  }
}
