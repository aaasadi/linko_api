import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/authCredentialDto';
import { UserEntity as User } from './user.entity';
import * as generator from 'generate-password';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
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
    return user;
  }
  /** Sing up User */
  async register(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { email, password } = authCredentialDto;
    const user = new User();
    user.email = email;
    user.password = await this.hashPassword(password);
    user.verifyID = await this.setVerifyID();
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY')
        throw new ConflictException('Email already registered');
      throw new InternalServerErrorException();
    }
    return user;
  }
  /** Sing in User */
  async login(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { email, password } = authCredentialDto;
    const user = await this.findOne({ email });
    if (!user) throw new BadRequestException('Username/Password is invalid');
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword)
      throw new BadRequestException('Username/Password is invalid');
    return user.transform({ token: true });
  }
  /** verify email address */
  async verifyEmail(user: User): Promise<void> {
    user.verified = true;
    try {
      await this.save(user);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
  /** user recovery */
  async recovery(user_id, newPassword, verify_id) {
    const user = await this.findUser(user_id);
    if (user.verifyID !== verify_id)
      throw new BadRequestException('Bad Request');
    user.password = await this.hashPassword(newPassword);
    user.verifyID = this.setVerifyID();
    try {
      await this.save(user);
    } catch (err) {
      throw new InternalServerErrorException();
    }
    return user.transform();
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  private setVerifyID(): string {
    return generator.generate({ length: 16, numbers: true });
  }
}
