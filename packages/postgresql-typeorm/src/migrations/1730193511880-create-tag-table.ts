import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTagTable1730193511880 implements MigrationInterface {
  name = 'CreateTagTable1730193511880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "tag" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_tag_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_tag_name" ON "tag" ("name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."UQ_tag_name"
        `);
    await queryRunner.query(`
            DROP TABLE "tag"
        `);
  }
}
