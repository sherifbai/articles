import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableArticle1747228143068 implements MigrationInterface {
    name = 'CreateTableArticle1747228143068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" character varying(500) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "author_id" uuid, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_6515da4dff8db423ce4eb841490" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_6515da4dff8db423ce4eb841490"`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }

}
