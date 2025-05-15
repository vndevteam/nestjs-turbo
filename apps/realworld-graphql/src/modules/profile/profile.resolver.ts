import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '@repo/graphql';
import { UsernameArgs } from './dto/profile.dto';
import { Profile } from './model/profile.model';
import { ProfileService } from './profile.service';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, {
    description: 'Get Profile',
    name: 'profile',
  })
  getProfile(
    @CurrentUser('id') userId: number,
    @Args() args: UsernameArgs,
  ): Promise<Profile> {
    return this.profileService.getProfile(userId, args.username);
  }

  @Mutation(() => Profile, {
    description: 'Follow User',
    name: 'followUser',
  })
  follow(
    @CurrentUser('id') userId: number,
    @Args() args: UsernameArgs,
  ): Promise<Profile> {
    return this.profileService.follow(userId, args.username);
  }

  @Mutation(() => Profile, {
    description: 'Unfollow User',
    name: 'unfollowUser',
  })
  unfollow(
    @CurrentUser('id') userId: number,
    @Args() args: UsernameArgs,
  ): Promise<Profile> {
    return this.profileService.unfollow(userId, args.username);
  }
}
