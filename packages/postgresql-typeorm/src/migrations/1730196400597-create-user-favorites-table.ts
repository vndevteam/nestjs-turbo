import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserFavoritesTable1730196400597
  implements MigrationInterface
{
  name = 'CreateUserFavoritesTable1730196400597';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_favorites" (
                "user_id" integer NOT NULL,
                "article_id" integer NOT NULL,
                CONSTRAINT "PK_844adcf6e9231c9afb76fe2e4ce" PRIMARY KEY ("user_id", "article_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_5238ce0a21cc77dc16c8efe3d3" ON "user_favorites" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_57c7c9e22aad40815268f28b5f" ON "user_favorites" ("article_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_favorites"
            ADD CONSTRAINT "FK_user_favorites_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_favorites"
            ADD CONSTRAINT "FK_user_favorites_article" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_user_favorites_article"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_user_favorites_user"
        `);
    await queryRunner.query(`
            DROP INDEX "IDX_57c7c9e22aad40815268f28b5f"
        `);
    await queryRunner.query(`
            DROP INDEX "IDX_5238ce0a21cc77dc16c8efe3d3"
        `);
    await queryRunner.query(`
            DROP TABLE "user_favorites"
        `);
  }
}
