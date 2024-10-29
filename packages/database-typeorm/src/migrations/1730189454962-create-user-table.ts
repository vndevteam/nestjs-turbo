import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1730189454962 implements MigrationInterface {
  name = 'CreateUserTable1730189454962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "image" character varying NOT NULL DEFAULT '',
                "bio" character varying NOT NULL DEFAULT '',
                CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}