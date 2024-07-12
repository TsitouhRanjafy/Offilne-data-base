import PouchDB from 'pouchdb'

// Créer un nouvelle instance de base deonnée
const db = new PouchDB('books');

// exporter notre instance 
export default db;