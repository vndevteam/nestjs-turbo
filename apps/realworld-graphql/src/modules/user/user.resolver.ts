import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';
import { User } from './model/user.dto';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async currentUser(@Context() context: any) {
    const user = context.req.user;
    return user;
  }

  @Mutation(() => User)
  async createUser(@Args('user') user: CreateUserInput): Promise<User> {
    const createdUser = await this.userService.createUser(user);
    return createdUser;
  }

  @Mutation(() => User)
  async updateUser(@Args('user') user: UpdateUserInput): Promise<User> {
    const updatedUser = await this.userService.updateUser(user);
    return updatedUser;
  }
}
