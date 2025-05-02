import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserFollowsEntity } from '@repo/postgresql-typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserFollowsEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
