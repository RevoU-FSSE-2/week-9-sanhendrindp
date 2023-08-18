import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getUsers } from "./data";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json());

// =============================== HTTP ROUTE FOR BANKING APP ======================================

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.log("Error get users:", error);
    res.status(500).json({
      Message: "An error occurred while fetching users.",
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
