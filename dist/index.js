"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8888;
app.use(body_parser_1.default.json());
// ================================ PORT RUNNING ====================================
app.get("/", (req, res) => {
    res.send("Welcome to Banking App! 💰");
});
// Server listen
app.listen(port, () => {
    console.log(`🌩 Server is running on port: ${port} 🌩`);
});
