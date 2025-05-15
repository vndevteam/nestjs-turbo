import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '@repo/graphql';
import { Public } from '@repo/nest-common';
import { AuthService } from '../auth/auth.service';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';
import { User } from './model/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => User, {
    name: 'currentUser',
    description: 'Get current user (from token)',
  })
  async currentUser(
    @CurrentUser() user: { id: number; token: string },
  ): Promise<User> {
    return this.userService.get(user);
  }

  @Public()
  @Mutation(() => User, {
    name: 'createUser',
    description: 'Register new user',
  })
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return await this.userService.create(input);
  }

  @Mutation(() => User, {
    name: 'updateUser',
    description: 'Update current user',
  })
  async updateUser(
    @CurrentUser('id') userId: number,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.update(userId, input);
  }

  @ResolveField()
  async token(@Parent() user: User) {
    return await this.authService.createToken({ id: user.id });
  }
}
