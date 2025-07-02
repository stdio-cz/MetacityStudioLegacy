import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCanvasDimensionsToSavedViews1751397889559 implements MigrationInterface {
    name = 'AddCanvasDimensionsToSavedViews1751397889559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_views" DROP CONSTRAINT "FK_saved_views_project"`);
        await queryRunner.query(`ALTER TABLE "embeds_saved_views_saved_views" DROP CONSTRAINT "FK_embeds_saved_views_embeds"`);
        await queryRunner.query(`ALTER TABLE "embeds_saved_views_saved_views" DROP CONSTRAINT "FK_embeds_saved_views_saved_views"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_embeds_saved_views_embeds"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_embeds_saved_views_saved_views"`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "canvas_width" double precision NOT NULL DEFAULT '800'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "canvas_height" double precision NOT NULL DEFAULT '600'`);
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "projection_type"`);
        await queryRunner.query(`CREATE TYPE "public"."saved_views_projection_type_enum" AS ENUM('PERSPECTIVE', 'ORTHOGRAPHIC')`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "projection_type" "public"."saved_views_projection_type_enum" NOT NULL DEFAULT 'ORTHOGRAPHIC'`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "fov_y_radian" SET DEFAULT '0.7853981633974483'`);
        await queryRunner.query(`CREATE INDEX "IDX_10d43f9b2ee4c014293c42ce49" ON "embeds_saved_views_saved_views" ("embedsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_805f383a788188398ff08ffc92" ON "embeds_saved_views_saved_views" ("savedViewsId") `);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD CONSTRAINT "FK_4edea490db3f177fe99e5b8609a" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "embeds_saved_views_saved_views" ADD CONSTRAINT "FK_10d43f9b2ee4c014293c42ce499" FOREIGN KEY ("embedsId") REFERENCES "embeds"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "embeds_saved_views_saved_views" ADD CONSTRAINT "FK_805f383a788188398ff08ffc921" FOREIGN KEY ("savedViewsId") REFERENCES "saved_views"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "embeds_saved_views_saved_views" DROP CONSTRAINT "FK_805f383a788188398ff08ffc921"`);
        await queryRunner.query(`ALTER TABLE "embeds_saved_views_saved_views" DROP CONSTRAINT "FK_10d43f9b2ee4c014293c42ce499"`);
        await queryRunner.query(`ALTER TABLE "saved_views" DROP CONSTRAINT "FK_4edea490db3f177fe99e5b8609a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_805f383a788188398ff08ffc92"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_10d43f9b2ee4c014293c42ce49"`);
        await queryRunner.query(`ALTER TABLE "saved_views" ALTER COLUMN "fov_y_radian" SET DEFAULT 0.7853981633974483`);
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "projection_type"`);
        await queryRunner.query(`DROP TYPE "public"."saved_views_projection_type_enum"`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD "projection_type" character varying NOT NULL DEFAULT 'ORTHOGRAPHIC'`);
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "canvas_height"`);
        await queryRunner.query(`ALTER TABLE "saved_views" DROP COLUMN "canvas_width"`);
        await queryRunner.query(`CREATE INDEX "IDX_embeds_saved_views_saved_views" ON "embeds_saved_views_saved_views" ("savedViewsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_embeds_saved_views_embeds" ON "embeds_saved_views_saved_views" ("embedsId") `);
        await queryRunner.query(`ALTER TABLE "embeds_saved_views_saved_views" ADD CONSTRAINT "FK_embeds_saved_views_saved_views" FOREIGN KEY ("savedViewsId") REFERENCES "saved_views"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "embeds_saved_views_saved_views" ADD CONSTRAINT "FK_embeds_saved_views_embeds" FOREIGN KEY ("embedsId") REFERENCES "embeds"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "saved_views" ADD CONSTRAINT "FK_saved_views_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
