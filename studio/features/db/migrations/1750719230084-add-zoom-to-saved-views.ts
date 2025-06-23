import { MigrationInterface, QueryRunner } from "typeorm";

export class AddZoomToSavedViews1750719230084 implements MigrationInterface {
  name = "AddZoomToSavedViews1750719230084";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "saved_views" ADD "projection_type" character varying NOT NULL DEFAULT 'ORTHOGRAPHIC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "saved_views" ADD "fov_y_radian" double precision NOT NULL DEFAULT 0.7853981633974483`,
    );
    await queryRunner.query(`ALTER TABLE "saved_views" ADD "orthographic_left" double precision NOT NULL DEFAULT -1`);
    await queryRunner.query(`ALTER TABLE "saved_views" ADD "orthographic_right" double precision NOT NULL DEFAULT 1`);
    await queryRunner.query(`ALTER TABLE "saved_views" ADD "orthographic_bottom" double precision NOT NULL DEFAULT -1`);
    await queryRunner.query(`ALTER TABLE "saved_views" ADD "orthographic_top" double precision NOT NULL DEFAULT 1`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "orthographic_top"`);
    await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "orthographic_bottom"`);
    await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "orthographic_right"`);
    await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "orthographic_left"`);
    await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "fov_y_radian"`);
    await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "projection_type"`);
  }
}
