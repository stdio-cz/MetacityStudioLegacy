import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSavedViews1750715800000 implements MigrationInterface {
  name = "AddSavedViews1750715800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "saved_views" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "camera_position" float array NOT NULL, "camera_target" float array NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "project_id" integer, CONSTRAINT "PK_saved_views_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_views" ADD CONSTRAINT "FK_saved_views_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "saved_views" DROP CONSTRAINT "FK_saved_views_project"`);
    await queryRunner.query(`DROP TABLE "saved_views"`);
  }
}
