import { DataSource } from "typeorm";
import { config } from "dotenv";
config();

console.log(__dirname + "../../migrations/**/*{.ts,.js}");

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + "/../../entity/**/*{.ts,.js}"],
  migrations: [__dirname + "/../../migrations/**/*{.ts,.js}"],
  synchronize: false,
});
