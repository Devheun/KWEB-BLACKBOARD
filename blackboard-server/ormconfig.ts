export const typeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3307,
  database: "test",
  username: "root",
  password: "wkdqhrh2022@",
  synchronize: false,
};

export const OrmConfig = {
  ...typeOrmModuleOptions,
  migrationsTableName: "migrations",
  migrations: ["./src/migrations/*.ts"],
  cli: {
    migrationsDir: "migrations",
  },
};
export default OrmConfig;