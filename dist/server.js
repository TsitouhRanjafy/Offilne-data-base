"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./Config/db"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// __________________________ MIDDLEWARE START __________________________ //
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
db_1.default.info()
    .then((i) => console.log(i));
// __________________________ GESTION DE ROUTE START __________________________ //
const route = new routes_1.default(app);
route.initialisez();
// __________________________ DEMARRAGE SERVEUR START __________________________ //
app.listen(PORT, () => {
    console.log(` Server started on \"http:localhost:${PORT}\"`);
});
