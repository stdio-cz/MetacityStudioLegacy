import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmbedSavedViewsRelationship1750715800001 implements MigrationInterface {
  name = "AddEmbedSavedViewsRelationship1750715800001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "embeds_saved_views_saved_views" ("embedsId" integer NOT NULL, "savedViewsId" integer NOT NULL, CONSTRAINT "PK_embeds_saved_views_relationship" PRIMARY KEY ("embedsId", "savedViewsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_embeds_saved_views_embeds" ON "embeds_saved_views_saved_views" ("embedsId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_embeds_saved_views_saved_views" ON "embeds_saved_views_saved_views" ("savedViewsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "embeds_saved_views_saved_views" ADD CONSTRAINT "FK_embeds_saved_views_embeds" FOREIGN KEY ("embedsId") REFERENCES "embeds"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "embeds_saved_views_saved_views" ADD CONSTRAINT "FK_embeds_saved_views_saved_views" FOREIGN KEY ("savedViewsId") REFERENCES "saved_views"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "embeds_saved_views_saved_views" DROP CONSTRAINT "FK_embeds_saved_views_saved_views"`,
    );
    await queryRunner.query(
      `ALTER TABLE "embeds_saved_views_saved_views" DROP CONSTRAINT "FK_embeds_saved_views_embeds"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_embeds_saved_views_saved_views"`);
    await queryRunner.query(`DROP INDEX "IDX_embeds_saved_views_embeds"`);
    await queryRunner.query(`DROP TABLE "embeds_saved_views_saved_views"`);
  }
}
