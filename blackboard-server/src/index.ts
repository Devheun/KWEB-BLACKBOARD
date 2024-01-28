import express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { routes } from "./routes/index";
import "reflect-metadata";
import passport from "./passport";
import cors from "cors"; // Import the cors middleware
import { AppDataSource } from "./data-source";

dotenv.config();

const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;
app.use(passport.initialize());

// Use cors middleware before your routes

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use("/", routes);

app.get('*', (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
