import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity, UserEntity } from '@repo/postgresql-typeorm';
import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ArticleDataLoader {
  private authorLoader: DataLoader<number, UserEntity>;
  private favoritesLoader: DataLoader<
    number,
    { favorited: boolean; count: number }
  >;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  getAuthorLoader() {
    if (!this.authorLoader) {
      this.authorLoader = new DataLoader<number, UserEntity>(
        async (authorIds: readonly number[]) => {
          const authors = await this.userRepository.find({
            where: { id: In([...authorIds]) },
            relations: ['followers'],
          });
          return authorIds.map((id) =>
            authors.find((author) => author.id === id),
          );
        },
      );
    }
    return this.authorLoader;
  }

  getFavoritesLoader(userId: number) {
    if (!this.favoritesLoader) {
      this.favoritesLoader = new DataLoader<
        number,
        { favorited: boolean; count: number }
      >(async (articleIds: readonly number[]) => {
        const articles = await this.articleRepository
          .createQueryBuilder('article')
          .select('article.id', 'id')
          .leftJoinAndSelect('article.favoritedBy', 'favoritedBy')
          .where('article.id IN (:...articleIds)', {
            articleIds: [...articleIds],
          })
          .getMany();

        return articleIds.map((id) => {
          const article = articles.find((a) => a.id === id);
          return {
            favorited:
              article?.favoritedBy?.some((u) => u.id === userId) || false,
            count: article?.favoritedBy?.length || 0,
          };
        });
      });
    }
    return this.favoritesLoader;
  }
}
