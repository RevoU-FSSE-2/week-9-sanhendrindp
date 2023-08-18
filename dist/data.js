"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTransaction = exports.addTransaction = exports.delTransaction = exports.getUser = exports.getUsers = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = mysql2_1.default
    .createPool({
    host: "fdaa:2:c06e:a7b:18a:7faa:5f9f:2",
    user: "root",
    password: "1234",
    database: "banking_app",
})
    .promise();
// Function to get all users
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield pool.getConnection();
            // Select from table user
            const [rows] = yield connection.query("SELECT * FROM user");
            connection.release();
            const users = rows.map((row) => ({
                id: row.id,
                name: row.name,
                address: row.address,
            }));
            console.log(users);
            return users;
        }
        catch (error) {
            console.error("Error when get users:", error);
            throw error;
        }
    });
}
exports.getUsers = getUsers;
// getUsers();
// Function to get user by id
function getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield pool.getConnection();
            // Get user with expense and balance
            const [rows] = yield connection.query(`SELECT p.id, p.name, p.address, 
            IFNULL(SUM(CASE WHEN o.type = 'expense' THEN o.amount ELSE 0 END), 0) as total_expense,
            IFNULL(SUM(CASE WHEN o.type = 'income' THEN o.amount ELSE 0 END), 0) as total_income
            FROM banking_app.user as p
            LEFT JOIN banking_app.transaction as o ON p.id = o.user_id
            WHERE p.id = ?
            GROUP BY p.id`, [id]);
            connection.release();
            const userAccount = rows.map((row) => ({
                id: row.id,
                name: row.name,
                address: row.address,
                expense: row.total_expense > 0 ? row.total_expense : 0,
                balance: row.total_income - row.total_expense,
            }));
            // console.log(userAccount);
            return userAccount;
        }
        catch (error) {
            console.log("Error when get user:", error);
            throw error;
        }
    });
}
exports.getUser = getUser;
// getUser(1);
// Function to delete a transaction by ID
function delTransaction(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield pool.getConnection();
            // Delete the transactions by user ID
            yield connection.query(`DELETE FROM banking_app.transaction WHERE id = ?`, [
                id,
            ]);
            connection.release();
            return `${id}`;
        }
        catch (error) {
            console.error("Error when deleting transactions:", error);
            throw error;
        }
    });
}
exports.delTransaction = delTransaction;
// delTransaction(1);
// Function to add a transaction
function addTransaction(type, amount, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield pool.getConnection();
            // Get user current balance
            const [userRows] = yield connection.query(`SELECT IFNULL(SUM(CASE WHEN o.type = 'income' THEN o.amount ELSE -o.amount END), 0) as balance
         FROM banking_app.transaction o
         WHERE o.user_id = ?`, [user_id]);
            const userBalance = userRows[0].balance;
            if (type === "expense" && amount > userBalance) {
                connection.release();
                throw new Error(`Transaction amount exceeds user balance`);
            }
            // Insert the transaction
            const [insertResult] = yield connection.query(`INSERT INTO banking_app.transaction (type, amount, user_id) VALUES (?, ?, ?)`, [type, amount, user_id]);
            connection.release();
            // Return id transaction table
            const transactionId = insertResult.insertId;
            // console.log(transactionId);
            return transactionId;
        }
        catch (error) {
            console.error("Error when creating transaction:", error);
            throw error;
        }
    });
}
exports.addTransaction = addTransaction;
// addTransaction("income", 20000, 2);
// Function to edit a transaction
function editTransaction(id, type, amount, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield pool.getConnection();
            // Check if the transaction exists
            const [transactionRows] = yield connection.query(`SELECT * FROM banking_app.transaction WHERE id = ?`, [id]);
            if (transactionRows.length === 0) {
                connection.release();
                throw new Error(`Transaction with ID ${id} not found`);
            }
            // Get user current balance
            const [userRows] = yield connection.query(`SELECT IFNULL(SUM(CASE WHEN o.type = 'income' THEN o.amount ELSE -o.amount END), 0) as balance
           FROM banking_app.transaction o
           WHERE o.user_id = ? AND o.id <> ?`, [user_id, id]);
            const userBalance = userRows[0].balance;
            if (type === "expense" && amount > userBalance) {
                connection.release();
                throw new Error(`Transaction amount exceeds user balance`);
            }
            // Update the transaction
            yield connection.query(`UPDATE banking_app.transaction SET type = ?, amount = ?, user_id = ? WHERE id = ?`, [type, amount, user_id, id]);
            connection.release();
        }
        catch (error) {
            console.error("Error when editing transaction:", error);
            throw error;
        }
    });
}
exports.editTransaction = editTransaction;
