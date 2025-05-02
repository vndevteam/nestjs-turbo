import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticleTable1730193570087 implements MigrationInterface {
  name = 'CreateArticleTable1730193570087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "article" (
                "id" SERIAL NOT NULL,
                "slug" character varying NOT NULL,
                "title" character varying NOT NULL,
                "description" character varying NOT NULL DEFAULT '',
                "body" character varying NOT NULL DEFAULT '',
                "author_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_article_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_article_slug" ON "article" ("slug")
        `);
    await queryRunner.query(`
            ALTER TABLE "article"
            ADD CONSTRAINT "FK_article_user" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."UQ_article_slug"
        `);
    await queryRunner.query(`
            ALTER TABLE "article" DROP CONSTRAINT "FK_article_user"
        `);
    await queryRunner.query(`
            DROP TABLE "article"
        `);
  }
}
