import { EntityRepository, Repository } from 'typeorm';
import { GroupEntity as Group } from './group.entity';
import { UserEntity as User } from 'src/user/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GroupDto } from './dto/groupDto';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  /** Find all Groups of User */
  async findAllGroup(user?: User): Promise<Group[]> {
    let groupsOfUser = await this.find({
      relations: ['owner', 'links'],
    });
    if (user) {
      groupsOfUser = groupsOfUser.filter((group) => {
        console.log(group);
        return group.owner.id === user.id;
      });
    }
    if (groupsOfUser.length < 1)
      throw new NotFoundException('No Group registerd for User');
    return groupsOfUser.map((group) =>
      group.transform({ owner: true, links: true }),
    );
  }
  /** Find one Group */
  async findGroup(name: string, user?: User): Promise<Group> {
    const group = await this.findOne({
      where: { name },
      relations: ['owner', 'links'],
    });
    if (!group) throw new NotFoundException('Group not found!');
    if (user && group.owner.id !== user.id) {
      throw new UnauthorizedException('Group information is not accessible');
    }
    return group.transform();
  }
  /** Create Group and save on database. */
  async createGroup(data: GroupDto, user: User): Promise<Group> {
    const group = await this.create({ name: data.name, owner: user });
    try {
      await this.save(group);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new ConflictException('Group already registered');
      throw new InternalServerErrorException();
    }
    return group;
  }
  /** Remove Group by name */
  async removeGroup(name: string, user: User): Promise<Group> {
    const group = await this.findGroup(name, user);
    await this.remove(group);
    return group;
  }
}
