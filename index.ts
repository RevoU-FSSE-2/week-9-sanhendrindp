import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { account } from "./data";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json());

// ================================ PORT RUNNING ====================================

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Banking App! 💰");
});

// Server listen
app.listen(port, () => {
  console.log(`🌩 Server is running on port: ${port} 🌩`);
});
