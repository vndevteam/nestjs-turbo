import { ErrorCode } from '@/constants/error-code.constant';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationException } from '@repo/api';
import { UserEntity, UserFollowsEntity } from '@repo/mysql-typeorm';
import { Repository } from 'typeorm';
import { ProfileDto, ProfileResDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserFollowsEntity)
    private readonly userFollowRepository: Repository<UserFollowsEntity>,
  ) {}

  async getProfile(userId: number, username: string): Promise<ProfileResDto> {
    // Get the profile of the target user
    const targetProfile = await this.userRepository.findOneBy({ username });

    if (!targetProfile) {
      throw new ValidationException(ErrorCode.E101);
    }

    const profile: ProfileDto = {
      username: targetProfile.username,
      bio: targetProfile.bio,
      image: targetProfile.image,
      following: false,
    };

    // Check if the user is following the target user
    if (userId && userId !== targetProfile.id) {
      const follows = await this.userRepository.find({
        select: {
          id: true,
          following: {
            id: true,
            followeeId: true,
          },
        },
        where: {
          id: userId,
          following: { followeeId: targetProfile.id },
        },
        relations: ['following'],
      });

      profile.following = !!follows[0];
    }

    return {
      profile,
    };
  }

  async follow(userId: number, username: string): Promise<ProfileResDto> {
    // Find the user who wants to follow
    // And check if the user is already following the target user
    const [user] = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        following: {
          id: true,
          followee: {
            username: true,
          },
        },
      },
      where: { id: userId, following: { followee: { username: username } } },
      relations: {
        following: {
          followee: true,
        },
      },
    });

    if (user && user.following.length > 0) {
      throw new ValidationException(ErrorCode.E103);
    }

    // Find the user to follow
    const followingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!followingUser) {
      throw new ValidationException(ErrorCode.E101);
    }

    // Add the user to follow to the following list
    const userFollows = new UserFollowsEntity({
      followerId: userId,
      followeeId: followingUser.id,
    });

    await this.userFollowRepository.save(userFollows);

    const profile: ProfileDto = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: true,
    };

    return {
      profile,
    };
  }

  async unfollow(userId: number, username: string): Promise<ProfileResDto> {
    // Find the user who wants to unfollow
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new ValidationException(ErrorCode.E002);
    }

    // Find the user to unfollow
    const followUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!followUser) {
      throw new ValidationException(ErrorCode.E101);
    }

    // Find relationship between the user and the user to unfollow
    const userFollow = await this.userFollowRepository.findOne({
      where: { followerId: userId, followeeId: followUser.id },
    });

    if (!userFollow) {
      throw new ValidationException(ErrorCode.E104);
    }

    await this.userFollowRepository.delete(userFollow.id);

    const profile: ProfileDto = {
      username: followUser.username,
      bio: followUser.bio,
      image: followUser.image,
      following: false,
    };

    return {
      profile,
    };
  }
}
