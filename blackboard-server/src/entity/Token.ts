import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class RefreshToken{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:false})
  userId : number;

  @Column({nullable:false})
  token : string;

  @Column({nullable:false})
  expiryDate : Date;
}