"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pouchdb_1 = __importDefault(require("pouchdb"));
// Créer un nouvelle instance de base deonnée
const db = new pouchdb_1.default('books');
// exporter notre instance 
exports.default = db;