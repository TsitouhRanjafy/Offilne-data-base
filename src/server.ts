import express, { Application,Request,Response, Router } from 'express'
import db from './Config/db';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import BooksRouter from './Routes/book';
import Routes from './routes';

const app : Application = express();
const PORT = process.env.PORT || 4000

// __________________________ MIDDLEWARE START __________________________ //

app.use(express.json())
app.use(express.urlencoded({extended : true}))

db.info()
.then((i) => console.log(i));

// __________________________ GESTION DE ROUTE START __________________________ //

const route: Routes = new Routes(app);
route.initialisez();



// __________________________ DEMARRAGE SERVEUR START __________________________ //
app.listen(PORT,() =>{
    console.log(` Server started on \"http:localhost:${PORT}\"`);
    
})

