import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getUsers, getUser } from "./data";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json());

// =============================== HTTP ROUTE FOR BANKING APP ======================================

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json({
      Message: "Success get all users ✅",
      Users: users,
    });
  } catch (error) {
    // console.log("Error get users:", error);
    res.status(500).json({
      Message: "ERROR! An error occurred while fetching users.",
    });
  }
});

// Get user by id
app.get("/user/:id", async (req, res) => {
  const id = Number(req.params.id);

  // Error handling if input id is NaN
  if (isNaN(id)) {
    res.status(400).json({
      Message: "Invalid user ID 🚫",
    });
    return;
  }

  try {
    const user = await getUser(id);
    if (user.length === 0) {
      res.status(404).json({
        Message: `User ID ${id} not found 🚫`,
      });
    } else {
      res.status(200).json({
        Message: `User ID ${id} found ✅`,
        User: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      Message: "ERROR! An error occurred while fetching user.",
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
