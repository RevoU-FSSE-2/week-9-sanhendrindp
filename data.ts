import mysql from "mysql2";
import dotenv from "dotenv";
import { error } from "console";
// import { error } from "console";

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();
interface User {
  id: number;
  name: string;
  address: string;
}

// This is for get user by id
interface UserAccount {
  id: number;
  name: string;
  address: string;
  balance: number;
  expense: number | null;
}

// Function to get all users
export async function getUsers(): Promise<User[]> {
  try {
    const connection = await pool.getConnection();

    // Select from table user
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      "SELECT * FROM user"
    );
    connection.release();

    const users: User[] = rows.map((row: mysql.RowDataPacket) => ({
      id: row.id,
      name: row.name,
      address: row.address,
    }));

    return users;
  } catch (error) {
    console.error("Error when get users:", error);
    throw error;
  }
}

// Call getUsers to get all users
// getUsers()
//   .then((users) => {
//     console.log("Users:", users);
//   })
//   .catch((error) => {
//     console.error("An error occurred:", error);
//   });

// Function to get user by id
export async function getUser(id: number): Promise<UserAccount[]> {
  try {
    const connection = await pool.getConnection();

    // Get user with expense and balance
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT p.id, p.name, p.address, 
            IFNULL(SUM(CASE WHEN o.type = 'expense' THEN o.amount ELSE 0 END), 0) as total_expense,
            IFNULL(SUM(CASE WHEN o.type = 'income' THEN o.amount ELSE 0 END), 0) as total_income
            FROM banking_app.user as p
            LEFT JOIN banking_app.transaction as o ON p.id = o.user_id
            WHERE p.id = ?
            GROUP BY p.id`,
      [id]
    );

    connection.release();

    const userAccount: UserAccount[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      expense: row.total_expense > 0 ? row.total_expense : 0,
      balance: row.total_income - row.total_expense,
    }));
    return userAccount;
  } catch (error) {
    console.log("Error when get user:", error);
    throw error;
  }
}

// Call getUser to get user with expense & balance
// getUser(1)
//   .then((user) => {
//     console.log("User:", user);
//   })
//   .catch((error) => {
//     console.error("An error occurred:", error);
//   });
