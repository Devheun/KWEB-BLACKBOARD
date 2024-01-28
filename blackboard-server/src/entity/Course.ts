import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Timestamp } from "./common";
import { User } from "./User";
import { Board } from "./Board";
import { Apply } from "./Apply";

@Entity()
export class Course extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  course_name: string;

  @Column({ nullable: false })
  course_number: string;

  @Column({ nullable: false })
  professor_id: number;

  // Foreign Key 설정
  // @ManyToOne(() => 관계를 맺은 테이블 class, (관계를 맺은 테이블의 별칭) => 관계를 맺은 테이블 class에서 현재 Entity의 별칭/변수명)
  @ManyToOne(() => User)
  @JoinColumn({ name: "professor_id" }) // @JoinColumn({ name : 현재 Entity에서 외래키 변수명, referencedColumnName : 관계를 맺은 테이블에서 외래키 변수명})
  user: User;

  @OneToMany(() => Board, (board) => board.course)
  boards: Board[];

  @OneToMany(() => Apply, (apply) => apply.course)
  applies: Apply[];
}
