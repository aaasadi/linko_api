import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { GroupEntity } from 'src/group/group.entity';
import { UserEntity } from 'src/user/user.entity';
import { group } from 'console';

@Entity('links')
@Unique(['slug'])
export class LinkEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  slug: string;

  @Column()
  url: string;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => GroupEntity, (group) => group.links)
  group: GroupEntity;

  @ManyToOne((type) => UserEntity, (creator) => creator.links)
  creator: UserEntity;

  transform(
    option: { group?: boolean; creator?: boolean } = {
      group: false,
      creator: false,
    },
  ) {
    const { id, slug, url, views, group, creator, created_at, updated_at } =
      this;
    const link = `https://linko.io/${slug}`;
    const result: any = {
      id,
      slug,
      url,
      views,
      link,
      group,
      creator,
      created_at,
      updated_at,
    };
    if (option.group) {
      result.group = { id: group.id, name: group.name };
    } else delete result.group;
    if (option.creator) {
      result.creator = { id: creator.id, email: creator.email };
    } else delete result.creator;
    return result;
  }
}
