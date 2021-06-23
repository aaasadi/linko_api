import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/authCredentialDto';
import { UserRO } from './ro/user.ro';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}
  /** Register User */
  // async register(verifyId: string, password: string): Promise<UserRO> {
  //   const verify = await this.verifyRepository.findVerify(verifyId);
  //   return await this.userRepository.register(verify, password);
  // }
  /** Login User */
  async login(authCredentialDto: AuthCredentialDto): Promise<UserRO> {
    return await this.userRepository.login(authCredentialDto);
  }
}
