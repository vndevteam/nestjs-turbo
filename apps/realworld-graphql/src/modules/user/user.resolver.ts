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

  @Query(() => User)
  async currentUser(
    @CurrentUser() user: { id: number; token: string },
  ): Promise<User> {
    return this.userService.get(user);
  }

  @Public()
  @Mutation(() => User)
  async createUser(@Args('user') userInput: CreateUserInput): Promise<User> {
    return await this.userService.create(userInput);
  }

  @Mutation(() => User)
  async updateUser(
    @CurrentUser('id') userId: number,
    @Args('user') userInput: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.update(userId, userInput);
  }

  @ResolveField()
  async token(@Parent() user: User) {
    return await this.authService.createToken({ id: user.id });
  }
}
