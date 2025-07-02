import { MigrationInterface, QueryRunner } from "typeorm";

export class AddViewStateToSavedViews1751412708042 implements MigrationInterface {
    name = 'AddViewStateToSavedViews1751412708042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "view_state" json`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "camera_position" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "camera_target" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "projection_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "projection_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "fov_y_radian" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "fov_y_radian" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "orthographic_zoom_factor" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "orthographic_zoom_factor" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "canvas_width" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "canvas_width" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "canvas_height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "canvas_height" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "canvas_height" SET DEFAULT '600'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "canvas_height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "canvas_width" SET DEFAULT '800'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "canvas_width" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "orthographic_zoom_factor" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "orthographic_zoom_factor" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "fov_y_radian" SET DEFAULT '0.7853981633974483'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "fov_y_radian" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "projection_type" SET DEFAULT 'ORTHOGRAPHIC'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "projection_type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "camera_target" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "camera_position" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "view_state"`);
    }

}
