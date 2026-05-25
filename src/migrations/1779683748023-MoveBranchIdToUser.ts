import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveBranchIdToUser1779683748023 implements MigrationInterface {
    name = 'MoveBranchIdToUser1779683748023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_973364520f149569e9041986bd7"`);
        await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "branchId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "branchId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_246426dfd001466a1d5e47322f4" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_246426dfd001466a1d5e47322f4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "branchId"`);
        await queryRunner.query(`ALTER TABLE "staff" ADD "branchId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_973364520f149569e9041986bd7" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
