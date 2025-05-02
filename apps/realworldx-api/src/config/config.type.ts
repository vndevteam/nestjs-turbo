import { AuthConfig } from '@/api/auth/config/auth-config.type';
import { AppConfig } from '@repo/api';
import { DatabaseConfig } from '@repo/postgresql-typeorm';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
};
