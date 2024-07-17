

<img src="https://github.com/user-attachments/assets/41af579e-a7c5-48c8-9969-a6c11eadbaef" alt="poucDB" width="250" height="250">
<img src="https://github.com/user-attachments/assets/8fa7e6d5-b3de-48f7-a030-8b1aa51279b7" alt="poucDB" width="250" height="250">



# Offline Data Base
Application web qui a de base de donnée local avec node.js de pouchdb.

## installation

```
  npm install express pouchdb typescript uuid
```
```
  npm install --save-dev @types/express @types/http-status-codes @types/pouchdb @types/uuid 
```

## configuration 

```
npx tsc --init   
```
```
// package.json
"scripts": {
    "test": "npx tsc && node ./dist/server.js"
  },
```

```
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2022",                                  
    "module": "commonjs",                                
    "outDir": "./dist",                                  
    "esModuleInterop": true,                             
    "forceConsistentCasingInFileNames": true,            
    "strict": true,                                      
    "skipLibCheck": true                                 
  },
  "include": ["src/**/*.ts"]
}
```
```
// strucure
src
├── Config
│   ├── db.ts
├── Routes
│   ├── book.ts
├── route.ts
├── server.ts
package.json
│
tsconfig.json
```

## code source
```
// db.ts
import PouchDB from 'pouchdb'

// Créer un nouvelle instance de base deonnée
const db = new PouchDB('books');

// exporter notre instance 
export default db;
```

```
// book.ts
import express, {Request,response,Response, Router} from 'express';
import {v4 as uuid4} from 'uuid';
import db from '../Config/db';
import { ReasonPhrases,StatusCodes} from 'http-status-codes';

const router = express.Router();

class BooksRouter{
    private router : Router = express.Router();
    constructor(){
        this.router = express.Router();
        this.add();

    }

    
    private add(){
        // ADD
        //POST '/books/new'
        this.router.post('/new',async (req : Request,res : Response) =>{
            const { title,author,genre,year } = req.body;
        
            // Génerer _id
            const _id = uuid4();

            const book = {
                _id,
                title,  
                author,
                genre,
                year
            }
            console.table(book)

            // enregistrer le book dans notre base de donnée
            db.put(book)
            .then((response) =>{
                res.status(StatusCodes.CREATED).send(response);
            })
            .catch((error)=>{
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            })
        })

        // GET ALL
        // GET '/books/all'
        this.router.get('/all',async (req : Request,res : Response) =>{
            try{
                const books = await db.allDocs({include_docs : true});
                const response = books.rows.map((book) => book.doc);
                res.status(StatusCodes.OK).send(response);
            } catch(error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
            }
        })

        // GET ONE (_id)
        // GET '/books/:id'
        this.router.get('/:id',async (req : Request,res : Response) =>{
            try{
                const {id} = req.params;
                const book = await db.get(id);
                res.status(StatusCodes.OK).send(book);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
            }
        })

        // UPDATE 
        // PUT '/books/:id'
        this.router.put('/:id',async (req : Request,res : Response) =>{
            try{
                const {id} = req.params;
                const {title,author,genre,year} = req.body;

                db.get(id)
                .then(async (doc) =>{
                    const response = await db.put({
                        _id : id,
                        _rev : doc._rev,
                        title,
                        author,
                        genre,
                        year
                    })
                })
                res.status(StatusCodes.ACCEPTED).send(response);
            } catch (error) {
                console.log(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
            }
        })

        // DELETE ONE
        // DELETE '/books/:id'
        this.router.delete('/:id',async (req : Request,res : Response) =>{
            try{
                const {id : id} = req.params;
                const doc = await db.get(id);
                const response = await db.remove(doc);
                res.status(StatusCodes.OK).send(response);
            } catch (error) {
                console.log(error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
            }
        })

    }

    public getRouter() : Router {
        return this.router;
    }

}

export default BooksRouter;

```

```
// route.ts
import { Application ,  Request , Response} from "express";
import { StatusCodes , ReasonPhrases } from "http-status-codes";
import BooksRouter from "./Routes/book";

class Routes{
    private route : Application
    constructor(app : Application){
        this.route = app;
    }
    public initialisez(){
        // GET '/'
        this.route.get('/',(req : Request,res : Response)=>{
            res.status(StatusCodes.OK).send({"status":"OK"}); 
        })
        const bookRouter : BooksRouter = new BooksRouter();
        this.route.use('/books',bookRouter.getRouter());
    }
}

export default Routes

```

```
// server.ts
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

```
