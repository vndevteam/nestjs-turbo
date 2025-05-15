import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from '@repo/nest-common';
import { User } from '../user/model/user.model';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => User, { name: 'login', description: 'Sign in' })
  async login(@Args('input') input: LoginInput): Promise<User> {
    return this.authService.login(input);
  }
}
