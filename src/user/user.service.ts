import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/authCredentialDto';
import { changePasswordDto } from './dto/changePasswordDto';
import { editProfileDto } from './dto/editProfileDto';
import { UserRO } from './ro/user.ro';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  /** Register User */
  async register(authCredentialDto: AuthCredentialDto): Promise<UserRO> {
    return await this.userRepository.register(authCredentialDto);
  }
  /** Login User */
  async login(authCredentialDto: AuthCredentialDto): Promise<UserRO> {
    return await this.userRepository.login(authCredentialDto);
  }
  /** Verify Email */
  async verifyEmail(user_id: string, verify_id: string): Promise<UserRO> {
    const user = await this.userRepository.findUser(user_id);
    if (user.verified) return user;
    if (user.verifyID !== verify_id) {
      throw new BadRequestException('Email validation has expired');
    }
    await this.userRepository.verifyEmail(user);
    return user.transform();
  }
  /** Forget Password */
  async forgetPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User Not Found!');
    return user;
  }
  /** Recovery Account */
  async recovery(user_id, newPassword, verify_id) {
    return this.userRepository.recovery(user_id, newPassword, verify_id);
  }
  /** Edit Profile data */
  async editProfile(user_id, data: editProfileDto) {
    const user = await this.userRepository.findUser(user_id);
    return this.userRepository.editProfile(user, data);
  }
  /** get user info */
  getInfo(user_id: string) {
    return this.userRepository.findUser(user_id);
  }
  async changePassword(user_id: string, data: changePasswordDto) {
    const user = await this.userRepository.findUser(user_id);
    return await this.userRepository.changePassword(user, data);
  }
}
