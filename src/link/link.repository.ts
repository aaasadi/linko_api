import { EntityRepository, Repository } from 'typeorm';
import { LinkEntity as Link } from './link.entity';
import { GroupEntity as Group } from 'src/group/group.entity';
import { UserEntity as User } from 'src/user/user.entity';
import { LinkDto } from './dto/linkDto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(Link)
export class LinkRepository extends Repository<Link> {
  /** Find All links of user */
  async findAllLinks(user: User): Promise<Link[]> {
    const links = await this.find({
      relations: ['creator', 'group'],
      where: { creator: { id: user.id } },
    });
    // if (links.length < 1) throw new NotFoundException('Link not found');
    return links.map((link) => link.transform({ creator: true, group: true }));
  }
  /** Find Link by slug */
  async findLink(slug: string): Promise<Link> {
    const link = await this.findOne({ where: { slug } });
    if (!link) throw new NotFoundException('Link not found');
    return link.transform();
  }
  async viewLink(slug: string): Promise<string> {
    const link = await this.findLink(slug);
    link.views = link.views + 1;
    this.save(link);
    return link.url;
  }
  /** Create Link */
  async createLink(group: Group, data: LinkDto, user: User): Promise<Link> {
    const { slug, url } = data;
    const link = await this.create({
      url,
      slug: `${group.name}/${slug}`,
      creator: user,
      group,
    });
    try {
      await this.save(link);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new ConflictException('Link already registered');
      throw new InternalServerErrorException();
    }
    return link;
  }

  async updateUrl(data, user: User): Promise<Link> {
    const { slug, url } = data;
    const link = await this.findOne({
      relations: ['creator'],
      where: { slug, creator: { id: user.id } },
    });
    link.url = url;
    try {
      await this.save(link);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return link;
  }
}
