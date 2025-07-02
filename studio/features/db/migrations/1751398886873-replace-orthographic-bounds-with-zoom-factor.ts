import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceOrthographicBoundsWithZoomFactor1751398886873 implements MigrationInterface {
    name = 'ReplaceOrthographicBoundsWithZoomFactor1751398886873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "orthographic_left"`);
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "orthographic_right"`);
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "orthographic_bottom"`);
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "orthographic_top"`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "orthographic_zoom_factor" double precision NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "orthographic_zoom_factor"`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "orthographic_top" double precision NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "orthographic_bottom" double precision NOT NULL DEFAULT '-1'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "orthographic_right" double precision NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "orthographic_left" double precision NOT NULL DEFAULT '-1'`);
    }

}
