import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserFollowsTable1730196525915 implements MigrationInterface {
  name = 'CreateUserFollowsTable1730196525915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user_follows" (
                "id" SERIAL NOT NULL,
                "follower_id" integer NOT NULL,
                "followee_id" integer NOT NULL,
                CONSTRAINT "PK_user_follows_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "UQ_user_follows_follower_id" ON "user_follows" ("follower_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "UQ_user_follows_followee_id" ON "user_follows" ("followee_id")
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_user_follows_follower_id_followee_id" ON "user_follows" ("follower_id", "followee_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "user_follows"
            ADD CONSTRAINT "FK_user_follows_follower_id" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_follows"
            ADD CONSTRAINT "FK_user_follows_followee_id" FOREIGN KEY ("followee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_follows" DROP CONSTRAINT "FK_user_follows_followee_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_follows" DROP CONSTRAINT "FK_user_follows_follower_id"
        `);
    await queryRunner.query(`
            DROP INDEX "UQ_user_follows_follower_id_followee_id"
        `);
    await queryRunner.query(`
            DROP INDEX "UQ_user_follows_followee_id"
        `);
    await queryRunner.query(`
            DROP INDEX "UQ_user_follows_follower_id"
        `);
    await queryRunner.query(`
            DROP TABLE "user_follows"
        `);
  }
}
