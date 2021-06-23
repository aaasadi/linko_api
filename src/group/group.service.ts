import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { GroupEntity } from './group.entity';
import { GroupRepository } from './group.repository';
import { GroupDto } from './dto/groupDto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  /** Show all group of user. */
  async showAll(userId: string): Promise<GroupEntity[]> {
    const user = await this.userRepository.findUser(userId);
    return await this.groupRepository.findAllGroup(user);
  }
  /** Show one group of user. */
  async showOne(name: string, userId: string): Promise<GroupEntity> {
    const user = await this.userRepository.findUser(userId);
    return await this.groupRepository.findGroup(name, user);
  }
  /** Create group and save on database. */
  async create(data: GroupDto, userId: string): Promise<GroupEntity> {
    const user = await this.userRepository.findUser(userId);
    const group = await this.groupRepository.createGroup(data, user);
    return group;
  }
  /** Remove group by name. */
  async remove(name: string, userId: string): Promise<GroupEntity> {
    const user = await this.userRepository.findUser(userId);
    return this.groupRepository.removeGroup(name, user);
  }
}
