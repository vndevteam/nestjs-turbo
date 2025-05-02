import { AppConfig } from '@repo/graphql';
import { DatabaseConfig } from '@repo/postgresql-typeorm';
import { AuthConfig } from 'src/modules/auth/config/auth-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
};
