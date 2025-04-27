import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, ProfileModule, ArticleModule, TagModule],
})
export class ApiModule {}
