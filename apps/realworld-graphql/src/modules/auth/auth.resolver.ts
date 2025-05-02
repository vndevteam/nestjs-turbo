import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../user/model/user.model';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => User, { name: 'login', description: 'Sign in' })
  async login(@Args('loginInput') loginInput: LoginInput): Promise<User> {
    return this.authService.login(loginInput);
  }
}
