import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticleToTagTable1730195822280
  implements MigrationInterface
{
  name = 'CreateArticleToTagTable1730195822280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "article_to_tag" (
                "article_id" integer NOT NULL,
                "tag_id" integer NOT NULL,
                CONSTRAINT "PK_4c89558cd6aba7068f591dfafb5" PRIMARY KEY ("article_id", "tag_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_fd50220e818ef33364f75af495" ON "article_to_tag" ("article_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_991d528d94da3e1b66444208ed" ON "article_to_tag" ("tag_id")
        `);

    await queryRunner.query(`
            ALTER TABLE "article_to_tag"
            ADD CONSTRAINT "FK_article_to_tag_article" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "article_to_tag"
            ADD CONSTRAINT "FK_article_to_tag_tag" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "article_to_tag" DROP CONSTRAINT "FK_article_to_tag_tag"
        `);
    await queryRunner.query(`
            ALTER TABLE "article_to_tag" DROP CONSTRAINT "FK_article_to_tag_article"
        `);
    await queryRunner.query(`
            DROP INDEX "IDX_991d528d94da3e1b66444208ed"
        `);
    await queryRunner.query(`
            DROP INDEX "IDX_fd50220e818ef33364f75af495"
        `);
    await queryRunner.query(`
            DROP TABLE "article_to_tag"
        `);
  }
}
