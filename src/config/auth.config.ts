import * as config from 'config';

const jwtConfig = config.get('jwt');
export class AuthConfigService implements ConfigInterface {
  static secretKey = process.env.JWT_SECRET_KEY || jwtConfig.secretKey;
  static expiresIn = process.env.JWT_INSPIRES_IN || jwtConfig.expiresIn;
}

interface ConfigInterface {
  secretKey?: string;
  expectIn?: string | number;
}
