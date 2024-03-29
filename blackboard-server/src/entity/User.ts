import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Timestamp } from "./common";

@Entity()
export class User extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:false, unique:true})
  username: string;

  @Column({nullable:false})
  password: string;

  @Column({nullable:false})
  name: string;

  @Column({nullable:false, unique:true})
  studentNumber: number;

  @Column({nullable:false})
  isProfessor: boolean;
}
