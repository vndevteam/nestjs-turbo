import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@repo/postgresql-typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
