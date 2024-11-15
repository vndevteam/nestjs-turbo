import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public } from '@repo/api';
import { CreateUserReqDto } from './dto/create-user.dto';
import { UpdateUserReqDto } from './dto/update-user.dto';
import { UserResDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @SerializeOptions({ type: UserResDto })
  getCurrent(
    @CurrentUser() currentUser: { id: number; token: string },
  ): Promise<UserResDto> {
    return this.userService.get(currentUser);
  }

  @Post('users')
  @Public()
  @SerializeOptions({ type: UserResDto })
  async create(@Body('user') userData: CreateUserReqDto): Promise<UserResDto> {
    return this.userService.create(userData);
  }

  @Put('user')
  @SerializeOptions({ type: UserResDto })
  async update(
    @CurrentUser('id') userId: number,
    @Body('user') userData: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return this.userService.update(userId, userData);
  }
}
