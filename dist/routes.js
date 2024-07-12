"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const book_1 = __importDefault(require("./Routes/book"));
class Routes {
    route;
    constructor(app) {
        this.route = app;
    }
    initialisez() {
        // GET '/'
        this.route.get('/', (req, res) => {
            res.status(http_status_codes_1.StatusCodes.OK).send({ "status": "OK" });
        });
        const bookRouter = new book_1.default();
        this.route.use('/books', bookRouter.getRouter());
    }
}
exports.default = Routes;
