import mysql from "mysql2";
import dotenv from "dotenv";

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
  expense: number;
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
    console.log(users);
    return users;
  } catch (error) {
    console.error("Error when get users:", error);
    throw error;
  }
}

// getUsers();

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
    // console.log(userAccount);
    return userAccount;
  } catch (error) {
    console.log("Error when get user:", error);
    throw error;
  }
}

// getUser(1);

// Function to delete a transaction by ID
export async function delTransaction(user_id: number): Promise<string> {
  try {
    const connection = await pool.getConnection();

    // Delete the transactions by user ID
    await connection.query(
      `DELETE FROM banking_app.transaction WHERE user_id = ?`,
      [user_id]
    );

    connection.release();

    return `${user_id}`;
  } catch (error) {
    console.error("Error when deleting transactions:", error);
    throw error;
  }
}

// delTransaction(3);

// Function to add a transaction
export async function addTransaction(
  type: string,
  amount: number,
  user_id: number
): Promise<number> {
  try {
    const connection = await pool.getConnection();

    // Get user current balance
    const [userRows] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT IFNULL(SUM(CASE WHEN o.type = 'income' THEN o.amount ELSE -o.amount END), 0) as balance
         FROM banking_app.transaction o
         WHERE o.user_id = ?`,
      [user_id]
    );

    const userBalance = userRows[0].balance;

    if (type === "expense" && amount > userBalance) {
      connection.release();
      throw new Error(`Transaction amount exceeds user balance`);
    }

    // Insert the transaction
    await connection.query<mysql.RowDataPacket[]>(
      `INSERT INTO banking_app.transaction (type, amount, user_id) VALUES (?, ?, ?)`,
      [type, amount, user_id]
    );

    connection.release();

    return user_id;
  } catch (error) {
    console.error("Error when creating transaction:", error);
    throw error;
  }
}

// addTransaction("expense", 400000, 2);
