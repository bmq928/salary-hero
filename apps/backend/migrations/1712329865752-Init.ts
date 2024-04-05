import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1712329865752 implements MigrationInterface {
    name = 'Init1712329865752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "worker_entity" ("id" uuid NOT NULL, "salary_type" character varying NOT NULL, "balance" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'NOW()', CONSTRAINT "PK_7b07d16a919661836685e11e8da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_869b7f7a1b57a3814968e1891a" ON "worker_entity" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_25b20e9b82f87214b2d38c8c62" ON "worker_entity" ("updated_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_25b20e9b82f87214b2d38c8c62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_869b7f7a1b57a3814968e1891a"`);
        await queryRunner.query(`DROP TABLE "worker_entity"`);
    }

}
