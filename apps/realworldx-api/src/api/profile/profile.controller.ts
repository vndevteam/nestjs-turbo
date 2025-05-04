import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@repo/api';
import { ApiAuth } from '@repo/api/decorators/http.decorators';
import { ProfileResDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profiles')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @SerializeOptions({ type: ProfileResDto })
  @ApiAuth({
    summary: 'Get Profile',
    type: ProfileResDto,
    isAuthOptional: true,
  })
  getProfile(
    @CurrentUser('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResDto> {
    return this.profileService.getProfile(userId, username);
  }

  @Post(':username/follow')
  @SerializeOptions({ type: ProfileResDto })
  @ApiAuth({
    summary: 'Follow User',
    type: ProfileResDto,
  })
  follow(
    @CurrentUser('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResDto> {
    return this.profileService.follow(userId, username);
  }

  @Delete(':username/follow')
  @SerializeOptions({ type: ProfileResDto })
  @ApiAuth({
    summary: 'Unfollow User',
    type: ProfileResDto,
  })
  unfollow(
    @CurrentUser('id') userId: number,
    @Param('username') username: string,
  ): Promise<ProfileResDto> {
    return this.profileService.unfollow(userId, username);
  }
}
