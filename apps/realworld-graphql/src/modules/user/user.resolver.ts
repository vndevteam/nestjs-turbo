import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';
import { User } from './model/user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async currentUser(@Context() context: any) {
    return this.userService.get(context);
  }

  @Mutation(() => User)
  async createUser(@Args('user') userInput: CreateUserInput): Promise<User> {
    return await this.userService.create(userInput);
  }

  @Mutation(() => User)
  async updateUser(@Args('user') userInput: UpdateUserInput): Promise<User> {
    return await this.userService.update(userInput);
  }
}
