import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnlyTooltipInfo1726147154131 implements MigrationInterface {
  name = "AddOnlyTooltipInfo1726147154131";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "embeds" ADD "only_tooltip_info" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "embeds" DROP COLUMN "only_tooltip_info"`);
  }
}
