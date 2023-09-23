"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./index.html"));
});
const server = https_1.default.createServer({
    key: fs_1.default.readFileSync('./server.key'),
    cert: fs_1.default.readFileSync('./server.crt'),
    passphrase: 'password',
}, app);
// GET
app.get('/', (req, res) => {
    res.send('Hello World!');
});
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
