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
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
// import { error } from "console";
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
            const [rows] = yield connection.query("SELECT * FROM user");
            connection.release();
            const users = rows.map((row) => ({
                id: row.id,
                name: row.name,
                address: row.address,
            }));
            return users;
        }
        catch (error) {
            console.error("Error when get users:", error);
            throw error;
        }
    });
}
// Call getUsers to get all users
getUsers()
    .then((users) => {
    console.log("Users:", users);
})
    .catch((error) => {
    console.error("An error occurred:", error);
});
