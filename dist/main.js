"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./Config/db"));
const http_status_codes_1 = require("http-status-codes");
const book_1 = __importDefault(require("./Routes/book"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// MIDDLEWARE
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
db_1.default.info()
    .then((i) => console.log(i));
// ROUTER
app.get('/', (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send({
        "status": http_status_codes_1.ReasonPhrases.OK,
        "message": "ok ok et"
    });
});
app.get('/books', (req, res) => {
    const booksRouter = new book_1.default(app);
    app.use('/new', booksRouter.getRouter());
});
// Start serveur
app.listen(PORT, () => {
    console.log(` Server started on \"http:localhost:${PORT}\"`);
});
