import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from '@repo/mysql-typeorm';
import { Repository } from 'typeorm';
import { TagListResDto } from './dto/tag-list.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async list(): Promise<TagListResDto> {
    const tagEntities = await this.tagRepository.find();
    const tags = tagEntities.map((tag) => tag.name);

    return { tags };
  }
}
