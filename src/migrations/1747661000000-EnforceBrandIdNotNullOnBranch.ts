import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class EnforceBrandIdNotNullOnBranch1747661000000
  implements MigrationInterface
{
  name = "EnforceBrandIdNotNullOnBranch1747661000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Remove any orphaned entries that violate constraints
    await queryRunner.query(`DELETE FROM "brands" WHERE "companyId" IS NULL;`);
    await queryRunner.query(`DELETE FROM "branches" WHERE "brandId" IS NULL;`);

    // 2. Make brandId on branches table NOT NULL
    const branchesTable = await queryRunner.getTable("branches");
    if (branchesTable) {
      const brandIdCol = branchesTable.findColumnByName("brandId");
      if (brandIdCol) {
        await queryRunner.changeColumn(
          "branches",
          brandIdCol,
          new TableColumn({
            name: "brandId",
            type: "uuid",
            isNullable: false,
          })
        );
      }
      
      // 3. Create foreign key constraint from branches(brandId) to brands(id)
      const brandIdFk = branchesTable.foreignKeys.find((fk) =>
        fk.columnNames.includes("brandId")
      );
      if (!brandIdFk) {
        await queryRunner.createForeignKey(
          "branches",
          new TableForeignKey({
            columnNames: ["brandId"],
            referencedTableName: "brands",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          })
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const branchesTable = await queryRunner.getTable("branches");
    if (branchesTable) {
      // 1. Drop foreign key constraint
      const brandIdFk = branchesTable.foreignKeys.find((fk) =>
        fk.columnNames.includes("brandId")
      );
      if (brandIdFk) {
        await queryRunner.dropForeignKey("branches", brandIdFk);
      }

      // 2. Make brandId nullable again
      const brandIdCol = branchesTable.findColumnByName("brandId");
      if (brandIdCol) {
        await queryRunner.changeColumn(
          "branches",
          brandIdCol,
          new TableColumn({
            name: "brandId",
            type: "uuid",
            isNullable: true,
          })
        );
      }
    }
  }
}
