import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomStatusAndHistory1779742777661 implements MigrationInterface {
    name = 'AddRoomStatusAndHistory1779742777661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."rooms_status_enum" AS ENUM('AVAILABLE', 'OCCUPIED', 'HOUSEKEEPING', 'MAINTENANCE')`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "status" "public"."rooms_status_enum" NOT NULL DEFAULT 'AVAILABLE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
    }

}
