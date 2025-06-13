import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { IdColumnConfig } from "../utils/migration_helper";
import { userRole } from "../utils/types";

export class AddUser1749699703322 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    IdColumnConfig,
                    { name: "name", type: "varchar", isNullable: false },
                    { name: "email", type: "varchar", isNullable: false, isUnique: true },
                    { name: "role", type: "enum", enum: Object.values(userRole), isNullable: false ,  default: `'${userRole.STUDENT}'` },
                    { name: "firebase_uid", type: "varchar", isUnique: true },
                ],
            })
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }

}
