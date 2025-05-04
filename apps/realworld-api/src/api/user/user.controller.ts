import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CurrentUser } from '@repo/api';
import { ApiAuth, ApiPublic } from '@repo/api/decorators/http.decorators';
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
  @ApiAuth({
    summary: 'Get Current User',
    type: UserResDto,
  })
  getCurrent(
    @CurrentUser() currentUser: { id: number; token: string },
  ): Promise<UserResDto> {
    return this.userService.get(currentUser);
  }

  @Post('users')
  @ApiPublic({
    type: UserResDto,
    summary: 'Registration',
  })
  @ApiBody({
    description: 'User register request',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          $ref: getSchemaPath(CreateUserReqDto),
        },
      },
      required: ['user'],
    },
  })
  @SerializeOptions({ type: UserResDto })
  async create(@Body('user') userData: CreateUserReqDto): Promise<UserResDto> {
    return this.userService.create(userData);
  }

  @Put('user')
  @SerializeOptions({ type: UserResDto })
  @ApiAuth({
    summary: 'Update User',
    type: UserResDto,
  })
  @ApiBody({
    description: 'User details to update. At least **one** field is required.',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          $ref: getSchemaPath(UpdateUserReqDto),
        },
      },
      required: ['user'],
    },
  })
  async update(
    @CurrentUser('id') userId: number,
    @Body('user') userData: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return this.userService.update(userId, userData);
  }
}
