import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Course } from "./entity/Course";
import { Apply } from "./entity/Apply";
import { Board } from "./entity/Board";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3307,
  username: "root",
  password: "wkdqhrh2022@",
  database: "test",
  synchronize: true,
  logging: false,
  entities: [User, Course, Apply,Board],
  migrations: [],
  subscribers: [],
});
