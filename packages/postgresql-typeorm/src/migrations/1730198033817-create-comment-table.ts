import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentTable1730198033817 implements MigrationInterface {
  name = 'CreateCommentTable1730198033817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "comment" (
                "id" SERIAL NOT NULL,
                "body" character varying NOT NULL,
                "article_id" integer NOT NULL,
                "author_id" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_comment_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_comment_article" FOREIGN KEY ("article_id") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_comment_user" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_comment_user"
        `);
    await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_comment_article"
        `);
    await queryRunner.query(`
            DROP TABLE "comment"
        `);
  }
}
