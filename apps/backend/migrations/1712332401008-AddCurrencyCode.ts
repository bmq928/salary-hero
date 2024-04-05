import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencyCode1712332401008 implements MigrationInterface {
    name = 'AddCurrencyCode1712332401008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "worker_entity" ADD "currency" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "worker_entity" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "worker_entity" ALTER COLUMN "updated_at" SET DEFAULT 'NOW()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "worker_entity" ALTER COLUMN "updated_at" SET DEFAULT '2024-04-05 15:14:12.660248+00'`);
        await queryRunner.query(`ALTER TABLE "worker_entity" ALTER COLUMN "created_at" SET DEFAULT '2024-04-05 15:14:12.660248+00'`);
        await queryRunner.query(`ALTER TABLE "worker_entity" DROP COLUMN "currency"`);
    }

}
