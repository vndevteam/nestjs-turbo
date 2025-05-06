import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserFollowsEntity } from '@repo/postgresql-typeorm';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserFollowsEntity])],
  providers: [ProfileResolver, ProfileService],
})
export class ProfileModule {}
