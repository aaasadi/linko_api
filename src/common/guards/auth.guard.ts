import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthConfigService } from 'src/config/auth.config';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization) return false;
    request.user = await this.validToken(authorization);
    return true;
  }

  async validToken(auth: string) {
    const bearer = auth.split(' ')[0];
    if (bearer !== 'Bearer') throw new UnauthorizedException('Token error');
    const token = auth.split(' ')[1];
    const secretKey = AuthConfigService.secretKey;
    try {
      return await jwt.verify(token, secretKey);
    } catch (error) {
      throw new UnauthorizedException('Token error');
    }
  }
}
