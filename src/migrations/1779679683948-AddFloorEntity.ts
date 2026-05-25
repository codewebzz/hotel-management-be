import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFloorEntity1779679683948 implements MigrationInterface {
    name = 'AddFloorEntity1779679683948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_85daa8c62993e1b343d339078a1"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_342dadb427f003ceec6d76bf8bf"`);
        await queryRunner.query(`ALTER TABLE "rooms" RENAME COLUMN "floor" TO "floorId"`);
        await queryRunner.query(`CREATE TABLE "floors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "floorNumber" integer NOT NULL, "name" character varying(100) NOT NULL, "companyId" uuid NOT NULL, "brandId" uuid NOT NULL, "branchId" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dae78234002afa84842d3a08ee0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "floorId"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "floorId" uuid`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_85daa8c62993e1b343d339078a1" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_342dadb427f003ceec6d76bf8bf" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "floors" ADD CONSTRAINT "FK_69975d5afaf9dc5b67b27d83ba8" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "floors" ADD CONSTRAINT "FK_37d0388ddcc0ae4e91dfc598f74" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "floors" ADD CONSTRAINT "FK_022d4004fe8e897258d53ace845" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_4d1c2078e85df4b86a6e80348e5" FOREIGN KEY ("floorId") REFERENCES "floors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_4d1c2078e85df4b86a6e80348e5"`);
        await queryRunner.query(`ALTER TABLE "floors" DROP CONSTRAINT "FK_022d4004fe8e897258d53ace845"`);
        await queryRunner.query(`ALTER TABLE "floors" DROP CONSTRAINT "FK_37d0388ddcc0ae4e91dfc598f74"`);
        await queryRunner.query(`ALTER TABLE "floors" DROP CONSTRAINT "FK_69975d5afaf9dc5b67b27d83ba8"`);
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_342dadb427f003ceec6d76bf8bf"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_85daa8c62993e1b343d339078a1"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "floorId"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "floorId" integer`);
        await queryRunner.query(`DROP TABLE "floors"`);
        await queryRunner.query(`ALTER TABLE "rooms" RENAME COLUMN "floorId" TO "floor"`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_342dadb427f003ceec6d76bf8bf" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_85daa8c62993e1b343d339078a1" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
