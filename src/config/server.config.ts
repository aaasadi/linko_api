import * as config from 'config';

const serverConfig = config.get('server');
export class ServerConfigService implements ConfigInterface {
  static port = process.env.PORT || serverConfig.port;
}

interface ConfigInterface {
  port?: string | number;
}
