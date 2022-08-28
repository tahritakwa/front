import { IAppConfigGenericConfigs } from './app-config.generic-configs';

export interface IAppConfig {
  env: {
    name: string;
    production: boolean;
  };
  logging: {
    console: boolean;
  };
  apiServer: string;
  genericConfigs: IAppConfigGenericConfigs;
}

