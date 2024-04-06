import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSalaryForWorker1712378349021 implements MigrationInterface {
    name = 'AddSalaryForWorker1712378349021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "worker_entity" ADD "salary" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "worker_entity" ALTER COLUMN "created_at" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "worker_entity" ALTER COLUMN "updated_at" SET DEFAULT 'NOW()'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "worker_entity" ALTER COLUMN "updated_at" SET DEFAULT '2024-04-06 04:39:02.370582+00'`);
        await queryRunner.query(`ALTER TABLE "worker_entity" ALTER COLUMN "created_at" SET DEFAULT '2024-04-06 04:39:02.370582+00'`);
        await queryRunner.query(`ALTER TABLE "worker_entity" DROP COLUMN "salary"`);
    }

}
