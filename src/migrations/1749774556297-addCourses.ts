import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { IdColumnConfig } from "../utils/migration_helper";
import { CourseModality, CourseType } from "../utils/types";

export class AddCourses1749774556297 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "courses",
                columns: [
                    IdColumnConfig,
                    { name: "name", type: "varchar", isNullable: false },
                    { name: "description" , type: "text", isNullable: true },
                    { name: "image", type: "varchar", isNullable: true },
                    { name: "modality", type: "enum", enum: Object.values(CourseModality), isNullable: false ,  default: `'${CourseModality.PRESENCIAL}'` },
                    { name: "type", type: "enum", enum: Object.values(CourseType), isNullable: false ,  default: `'${CourseType.BACHARELADO}'` },
                    {name: "enade" , type: "int" , isNullable: true },
                ],
            })
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("courses");
    }

}
