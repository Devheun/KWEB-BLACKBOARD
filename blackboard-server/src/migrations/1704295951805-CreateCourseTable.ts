import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourseTable1704295951805 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE course (
            id INT NOT NULL AUTO_INCREMENT,
            course_name VARCHAR(255) NOT NULL,
            course_number VARCHAR(255) NOT NULL,
            professor_id INT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (professor_id)
            REFERENCES user (id)
            ON DELETE CASCADE)
        ENGINE = InnoDB
        DEFAULT CHARACTER SET = utf8`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
