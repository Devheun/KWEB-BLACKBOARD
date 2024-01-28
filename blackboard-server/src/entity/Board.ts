import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Timestamp } from "./common";
import { Course } from "./Course";


@Entity()
export class Board extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  course_id: number;

  @Column({ nullable: false })
  board_title: string;

  @Column({ nullable: false })
  board_desc: string;

  @ManyToOne(() => Course, (course)=> course.boards)
  @JoinColumn({ name: "course_id" })
  course: Course;
}
