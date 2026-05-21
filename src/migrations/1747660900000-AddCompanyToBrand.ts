import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCompanyToBrand1747660900000 implements MigrationInterface {
  name = 'AddCompanyToBrand1747660900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const brandsTable = await queryRunner.getTable('brands');
    if (!brandsTable) return;

    // Skip if column already exists
    if (brandsTable.findColumnByName('companyId')) return;

    // Step 1: Add the column as nullable first to allow backfill
    await queryRunner.addColumn(
      'brands',
      new TableColumn({
        name: 'companyId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Step 2: Backfill all existing brands with the first (oldest) company
    await queryRunner.query(`
      UPDATE "brands"
      SET "companyId" = (
        SELECT id FROM "companies" ORDER BY "createdAt" ASC LIMIT 1
      )
      WHERE "companyId" IS NULL
        AND EXISTS (SELECT 1 FROM "companies")
    `);

    // Step 3: Check whether all rows were filled before tightening the constraint
    const [{ count: nullCount }] = await queryRunner.query(
      `SELECT COUNT(*)::int AS count FROM "brands" WHERE "companyId" IS NULL`,
    );

    if (Number(nullCount) === 0) {
      // Make column non-nullable
      await queryRunner.changeColumn(
        'brands',
        'companyId',
        new TableColumn({
          name: 'companyId',
          type: 'uuid',
          isNullable: false,
        }),
      );
    }

    // Step 4: Add the foreign key regardless of nullable state
    await queryRunner.createForeignKey(
      'brands',
      new TableForeignKey({
        columnNames: ['companyId'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const brandsTable = await queryRunner.getTable('brands');
    if (!brandsTable) return;

    // Drop FK if it exists
    const companyFk = brandsTable.foreignKeys.find((fk) =>
      fk.columnNames.includes('companyId'),
    );
    if (companyFk) {
      await queryRunner.dropForeignKey('brands', companyFk);
    }

    // Drop the column if it exists
    if (brandsTable.findColumnByName('companyId')) {
      await queryRunner.dropColumn('brands', 'companyId');
    }
  }
}
