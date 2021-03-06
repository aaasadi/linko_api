import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { GroupEntity } from 'src/group/group.entity';
import { AuthConfigService } from 'src/config/auth.config';
import { LinkEntity } from 'src/link/link.entity';
import { Roles } from './enum/roles';

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column({ default: false })
  verified: boolean;

  @Column()
  verifyID: string;

  @Column({ default: Roles.consumer })
  role: Roles;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @OneToMany((type) => GroupEntity, (groups) => groups.owner)
  @JoinTable()
  groups: GroupEntity[];

  @OneToMany((type) => LinkEntity, (link) => link.creator)
  links: LinkEntity[];

  private async getToken(): Promise<string> {
    const { id, email, created_at, update_at } = this;
    const user = { id, email, created_at, update_at };
    const secretKey = AuthConfigService.secretKey;
    const expiresIn = AuthConfigService.expiresIn;
    return await jwt.sign(user, secretKey, { expiresIn });
  }

  async transform(optoin: Option = { token: false }): Promise<UserEntity> {
    const { id, name, email, role, verified, avatar, created_at, update_at } =
      this;
    const token = await this.getToken();
    const result: any = {
      id,
      name,
      email,
      avatar,
      role,
      verified,
      token,
      created_at,
      update_at,
    };
    if (!optoin.token) delete result.token;
    return result;
  }
}

interface Option {
  token?: boolean;
}
