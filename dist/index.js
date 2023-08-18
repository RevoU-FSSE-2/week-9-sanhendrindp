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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const data_1 = require("./data");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8888;
app.use(body_parser_1.default.json());
// =============================== HTTP ROUTE FOR BANKING APP ======================================
// Get all users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, data_1.getUsers)();
        res.status(200).json({
            Message: "Success get all users ✅",
            Users: users,
        });
    }
    catch (error) {
        // console.log("Error get users:", error);
        res.status(500).json({
            Message: "ERROR! An error occurred while fetching users 😵",
        });
    }
}));
// Get user by id
app.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    // console.log(id);
    // Error handling if input id is NaN
    if (isNaN(id)) {
        res.status(400).json({
            Message: "Invalid user ID 🚫",
        });
        return;
    }
    try {
        const user = yield (0, data_1.getUser)(id);
        if (user.length === 0) {
            res.status(404).json({
                Message: `User ID ${id} not found 🚫`,
            });
        }
        else {
            res.status(200).json({
                Message: `User ID ${id} found ✅`,
                User: user,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            Message: "ERROR! An error occurred while fetching user 😵",
        });
    }
}));
// DELETE transaction
app.delete("/transaction/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = Number(req.params.id);
    // console.log(user_id);
    // Error handling if input id is NaN
    if (isNaN(user_id)) {
        res.status(400).json({
            Message: "Invalid user ID 🚫",
        });
        return;
    }
    try {
        const delConfrim = yield (0, data_1.delTransaction)(user_id);
        // console.log(delConfrim);
        res.status(200).json({
            Message: `User ID ${delConfrim} transaction deleted 🚽`,
        });
    }
    catch (error) {
        res.status(500).json({
            Message: "ERROR! An error occurred while deleting transactions 😵",
        });
    }
}));
// ================================ PORT RUNNING ====================================
app.get("/", (req, res) => {
    res.send("Welcome to Banking App! 💰");
});
// Server listen
app.listen(port, () => {
    console.log(`🌩 Server is running on port: ${port} 🌩`);
});
