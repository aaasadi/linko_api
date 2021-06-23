import { LinkEntity } from 'src/link/link.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('groups')
@Unique(['name'])
export class GroupEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => UserEntity, (owner) => owner.groups, { cascade: true })
  @JoinTable()
  owner: UserEntity;

  @OneToMany((type) => LinkEntity, (links) => links.group)
  links: LinkEntity[];

  /** transform response object */
  transform(
    option: { owner?: boolean; links?: boolean } = {
      owner: true,
      links: false,
    },
  ) {
    const { id, name, owner, links, created_at, updated_at } = this;
    const result: any = { id, name, owner, links, created_at, updated_at };
    if (option.owner) {
      result.owner = { id: owner.id, email: owner.email };
    } else delete result.owner;
    if (option.links) {
      result.links = links.map((link) => link.transform());
    } else delete result.owner;
    return result;
  }
}
