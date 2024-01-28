import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Timestamp } from "./common";
import { User } from "./User";
import { Course } from "./Course";


@Entity()
export class Apply extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  student_id: number;

  @Column({ nullable: false })
  course_id: number;

  // Foreign Key 설정
  // @ManyToOne(() => 관계를 맺은 테이블 class, (관계를 맺은 테이블의 별칭) => 관계를 맺은 테이블 class에서 현재 Entity의 별칭/변수명)
  @ManyToOne(() => User)
  @JoinColumn({ name: "student_id" }) // @JoinColumn({ name : 현재 Entity에서 외래키 변수명, referencedColumnName : 관계를 맺은 테이블에서 외래키 변수명})
  user: User;

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course;
}
