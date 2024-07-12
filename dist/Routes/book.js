"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../Config/db"));
const http_status_codes_1 = require("http-status-codes");
const router = express_1.default.Router();
class BooksRouter {
    router = express_1.default.Router();
    constructor() {
        this.router = express_1.default.Router();
        this.add();
    }
    add() {
        // ADD
        //POST '/books/new'
        this.router.post('/new', async (req, res) => {
            const { title, author, genre, year } = req.body;
            // Génerer _id
            const _id = (0, uuid_1.v4)();
            const book = {
                _id,
                title,
                author,
                genre,
                year
            };
            console.table(book);
            // enregistrer le book dans notre base de donnée
            db_1.default.put(book)
                .then((response) => {
                res.status(http_status_codes_1.StatusCodes.CREATED).send(response);
            })
                .catch((error) => {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            });
        });
        // GET ALL
        // GET '/books/all'
        this.router.get('/all', async (req, res) => {
            try {
                const books = await db_1.default.allDocs({ include_docs: true });
                const response = books.rows.map((book) => book.doc);
                res.status(http_status_codes_1.StatusCodes.OK).send(response);
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
        });
        // GET ONE (_id)
        // GET '/books/:id'
        this.router.get('/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const book = await db_1.default.get(id);
                res.status(http_status_codes_1.StatusCodes.OK).send(book);
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
        });
        // UPDATE 
        // PUT '/books/:id'
        this.router.put('/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const { title, author, genre, year } = req.body;
                db_1.default.get(id)
                    .then(async (doc) => {
                    const response = await db_1.default.put({
                        _id: id,
                        _rev: doc._rev,
                        title,
                        author,
                        genre,
                        year
                    });
                });
                res.status(http_status_codes_1.StatusCodes.ACCEPTED).send(express_1.response);
            }
            catch (error) {
                console.log(error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
        });
        // DELETE ONE
        // DELETE '/books/:id'
        this.router.delete('/:id', async (req, res) => {
            try {
                const { id: id } = req.params;
                const doc = await db_1.default.get(id);
                const response = await db_1.default.remove(doc);
                res.status(http_status_codes_1.StatusCodes.OK).send(response);
            }
            catch (error) {
                console.log(error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
        });
    }
    getRouter() {
        return this.router;
    }
}
exports.default = BooksRouter;
