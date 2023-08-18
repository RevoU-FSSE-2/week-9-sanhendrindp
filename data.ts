import mysql from "mysql2";
import dotenv from "dotenv";
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

// Function to get all users
export async function getUsers(): Promise<User[]> {
  try {
    const connection = await pool.getConnection();
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
