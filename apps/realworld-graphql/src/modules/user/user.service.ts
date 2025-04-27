import { Injectable, Logger } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async updateUser(user: UpdateUserInput) {
    this.logger.log(`Updating user: ${user.email}`);
    return user;
  }

  async createUser(user: CreateUserInput) {
    this.logger.log(`Creating user: ${user.email}`);
    return user;
  }
}
