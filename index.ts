import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { user } from "./data";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json());

// =============================== BANKING APP ======================================

// GET/user/:id
app.get("/user/:id", (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const account = user.find((item) => item.id === userId);

  if (!account) {
    res.status(404).json({
      Message: `User id ${userId} not found 🚫`,
    });
  } else {
    res.status(200).json({
      Message: `User id ${userId} found ✅`,
      account,
    });
  }
});

// ================================ PORT RUNNING ====================================

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Banking App! 💰");
});

// Server listen
app.listen(port, () => {
  console.log(`🌩 Server is running on port: ${port} 🌩`);
});
