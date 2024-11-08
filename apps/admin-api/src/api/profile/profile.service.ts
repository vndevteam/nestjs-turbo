import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@repo/database-typeorm';
import { Repository } from 'typeorm';
import { ProfileDto, ProfileResDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(userId: number, username: string): Promise<ProfileResDto> {
    // Get the profile of the target user
    const targetProfile = await this.userRepository.findOneBy({ username });

    if (!targetProfile) {
      throw new BadRequestException('Profile not found');
    }

    const profile: ProfileDto = {
      username: targetProfile.username,
      bio: targetProfile.bio,
      image: targetProfile.image,
      following: false,
    };

    // Check if the user is following the target user
    if (userId && userId !== targetProfile.id) {
      const follows = await this.userRepository.findOne({
        where: { id: userId, following: { id: targetProfile.id } },
        relations: ['following'],
      });

      profile.following = !!follows;
    }

    return {
      profile,
    };
  }

  async follow(userId: number, username: string): Promise<ProfileResDto> {
    // Find the user who wants to follow
    const user = await this.userRepository.findOne({
      select: ['id', 'username'],
      where: { id: userId },
      relations: ['following'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if the user is already following the target user
    const isAlreadyFollowing = user.following.some(
      (followingUser) => followingUser.username === username,
    );

    if (isAlreadyFollowing) {
      throw new BadRequestException('Already following this user');
    }

    // Find the user to follow
    const followUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!followUser) {
      throw new BadRequestException('User to follow not found');
    }

    // Add the user to follow to the following list
    user.following.push(followUser);
    await this.userRepository.save(user);

    const profile: ProfileDto = {
      username: followUser.username,
      bio: followUser.bio,
      image: followUser.image,
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
      relations: ['following'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Find the user to unfollow
    const followUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!followUser) {
      throw new BadRequestException('User to unfollow not found');
    }

    // Remove the user to unfollow from the following list
    user.following = user.following.filter(
      (followingUser) => followingUser.id !== followUser.id,
    );

    await this.userRepository.save(user);

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