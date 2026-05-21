import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class InvertBrandBranchRelation1747660800000
  implements MigrationInterface
{
  name = "InvertBrandBranchRelation1747660800000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const brandsTable = await queryRunner.getTable("brands");
    const branchesTable = await queryRunner.getTable("branches");

    if (!brandsTable || !branchesTable) {
      return;
    }

    const branchIdOnBrand = brandsTable.findColumnByName("branchId");
    const brandIdOnBranch = branchesTable.findColumnByName("brandId");

    if (branchIdOnBrand && !brandIdOnBranch) {
      await queryRunner.addColumn(
        "branches",
        new TableColumn({
          name: "brandId",
          type: "uuid",
          isNullable: true,
        })
      );

      // Map each branch to a brand that previously pointed at it
      await queryRunner.query(`
        UPDATE "branches" b
        SET "brandId" = sub."brandId"
        FROM (
          SELECT DISTINCT ON (br."branchId") br."branchId" AS branch_id, br.id AS "brandId"
          FROM "brands" br
          WHERE br."branchId" IS NOT NULL
          ORDER BY br."branchId", br."createdAt" ASC
        ) sub
        WHERE b.id = sub.branch_id
      `);

      // Branches with no linked brand: use any existing brand id
      await queryRunner.query(`
        UPDATE "branches"
        SET "brandId" = (SELECT id FROM "brands" ORDER BY "createdAt" ASC LIMIT 1)
        WHERE "brandId" IS NULL
          AND EXISTS (SELECT 1 FROM "brands")
      `);

      const [{ count: nullBrandBranches }] = await queryRunner.query(
        `SELECT COUNT(*)::int AS count FROM "branches" WHERE "brandId" IS NULL`
      );

      if (Number(nullBrandBranches) === 0) {
        await queryRunner.changeColumn(
          "branches",
          "brandId",
          new TableColumn({
            name: "brandId",
            type: "uuid",
            isNullable: false,
          })
        );

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

      const brandBranchFk = brandsTable.foreignKeys.find((fk) =>
        fk.columnNames.includes("branchId")
      );
      if (brandBranchFk) {
        await queryRunner.dropForeignKey("brands", brandBranchFk);
      }

      await queryRunner.dropColumn("brands", "branchId");
    } else if (!brandIdOnBranch) {
      await queryRunner.addColumn(
        "branches",
        new TableColumn({
          name: "brandId",
          type: "uuid",
          isNullable: false,
        })
      );

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

  public async down(queryRunner: QueryRunner): Promise<void> {
    const brandsTable = await queryRunner.getTable("brands");
    const branchesTable = await queryRunner.getTable("branches");

    if (!brandsTable || !branchesTable) {
      return;
    }

    const branchIdOnBrand = brandsTable.findColumnByName("branchId");
    const brandIdOnBranch = branchesTable.findColumnByName("brandId");

    if (brandIdOnBranch && !branchIdOnBrand) {
      await queryRunner.addColumn(
        "brands",
        new TableColumn({
          name: "branchId",
          type: "uuid",
          isNullable: true,
        })
      );

      await queryRunner.query(`
        UPDATE "brands" br
        SET "branchId" = sub.branch_id
        FROM (
          SELECT DISTINCT ON (b."brandId") b."brandId", b.id AS branch_id
          FROM "branches" b
          ORDER BY b."brandId", b."createdAt" ASC
        ) sub
        WHERE br.id = sub."brandId"
      `);

      await queryRunner.query(`
        UPDATE "brands"
        SET "branchId" = (SELECT id FROM "branches" ORDER BY "createdAt" ASC LIMIT 1)
        WHERE "branchId" IS NULL
          AND EXISTS (SELECT 1 FROM "branches")
      `);

      const [{ count: nullBranchBrands }] = await queryRunner.query(
        `SELECT COUNT(*)::int AS count FROM "brands" WHERE "branchId" IS NULL`
      );

      if (Number(nullBranchBrands) === 0) {
        await queryRunner.changeColumn(
          "brands",
          "branchId",
          new TableColumn({
            name: "branchId",
            type: "uuid",
            isNullable: false,
          })
        );

        await queryRunner.createForeignKey(
          "brands",
          new TableForeignKey({
            columnNames: ["branchId"],
            referencedTableName: "branches",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          })
        );
      }

      const branchBrandFk = branchesTable.foreignKeys.find((fk) =>
        fk.columnNames.includes("brandId")
      );
      if (branchBrandFk) {
        await queryRunner.dropForeignKey("branches", branchBrandFk);
      }

      await queryRunner.dropColumn("branches", "brandId");
    }
  }
}
