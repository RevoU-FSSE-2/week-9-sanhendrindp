import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { User, user } from "./data";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8888;

app.use(bodyParser.json());

// =============================== HTTP ROUTE FOR BANKING APP ======================================

// GET/user/:id
app.get("/user/:id", (req: Request, res: Response) => {
  const userId = parseInt(req.params.id); // Make sure to make user id as number
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

// POST/transaction
// app.post("/transaction", (req: Request, res: Response) => {
//   const { type, amount, user_id } = req.body;

//   // Find the user by id
//   const currentUser = user.find((item) => item.id === user_id);
//   console.log(currentUser);
//   if (!currentUser) {
//     res.status(404).json({
//       Message: `User id ${user_id} not found 🚫`,
//     });
//   }

//   // Update the balance based on transaction type
//   if (type === "expense") {
//     if (currentUser.balance < amount) {
//       res.status(400).json({
//         Message: "Your balance is insufficient 😢",
//       });
//     }
//     currentUser.balance -= amount;
//     currentUser.expense += amount;
//   } else if (type === "income") {
//     currentUser.balance += amount;
//   } else {
//     res.status(400).json({
//       Message: "Invalid transaction 🚫",
//     });
//   }

//   // Generate unique id for transaction
//   const transactionId = currentUser.expense + currentUser.balance;

//   res.status(201).json({
//     id: transactionId,
//   });
// });

// ================================ PORT RUNNING ====================================

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Banking App! 💰");
});

// Server listen
app.listen(port, () => {
  console.log(`🌩 Server is running on port: ${port} 🌩`);
});
