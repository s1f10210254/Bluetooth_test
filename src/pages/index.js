"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const CandencePage_1 = __importDefault(require("../components/CandencePage"));
console.log('This is the index.tsx file!');
function App() {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "My Application"),
        react_1.default.createElement(CandencePage_1.default, null)));
}
exports.default = App;
