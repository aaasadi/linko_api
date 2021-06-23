import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/authCredentialDto';
import { UserEntity as User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /** Find User */
  async findUser(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user.transform();
  }
  /** Sing up User */
  // async register(password: string): Promise<User> {
  //   // let user = await this.findOne({ where: { email: await verify.email } });
  //   // if (!user) {
  //   //   user = this.create({ email: await verify.email });
  //   // }
  //   user.password = await this.hashPassword(password);
  //   try {
  //     await this.save(user);
  //   } catch (error) {
  //     if (error.code === 'ER_DUP_ENTRY')
  //       throw new ConflictException('Email already registered');
  //     throw new InternalServerErrorException();
  //   }
  //   return user.transform();
  // }
  /** Sing in User */
  async login(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { email, password } = authCredentialDto;
    const user = await this.findOne({ email });
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!user || !isValidPassword)
      throw new BadRequestException('Username/Password is invalid');
    return user.transform({ token: true });
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  private async comparePassword(password, hash): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
