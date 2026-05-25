import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomStatusHistoryTable1779743145065 implements MigrationInterface {
    name = 'AddRoomStatusHistoryTable1779743145065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."room_status_history_status_enum" AS ENUM('AVAILABLE', 'OCCUPIED', 'HOUSEKEEPING', 'MAINTENANCE')`);
        await queryRunner.query(`CREATE TABLE "room_status_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roomId" uuid NOT NULL, "status" "public"."room_status_history_status_enum" NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f105d5a3a72e7792bb7db446ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "room_status_history" ADD CONSTRAINT "FK_ff0cfe4827759b2aef2e04f7dcb" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_status_history" DROP CONSTRAINT "FK_ff0cfe4827759b2aef2e04f7dcb"`);
        await queryRunner.query(`DROP TABLE "room_status_history"`);
        await queryRunner.query(`DROP TYPE "public"."room_status_history_status_enum"`);
    }

}
