import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database/ormconfig";
import cors from "cors";
import { mainRouter } from "./routes/index";
import { join } from "path";

dotenv.config();

const app = express();

const corsOptions = {
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(join(__dirname, './../volumes/uploads')));

app.use(mainRouter);

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");

    const migrations = await AppDataSource.runMigrations();

    app.listen(3000, () => {
      console.log(`Server running on port ${3000}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });