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
exports.delTransaction = exports.getUser = exports.getUsers = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = mysql2_1.default
    .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
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
function delTransaction(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield pool.getConnection();
            // Delete the transactions by user ID
            yield connection.query(`DELETE FROM banking_app.transaction WHERE user_id = ?`, [user_id]);
            connection.release();
            return `${user_id}`;
        }
        catch (error) {
            console.error("Error when deleting transactions:", error);
            throw error;
        }
    });
}
exports.delTransaction = delTransaction;
// delTransaction(3);
