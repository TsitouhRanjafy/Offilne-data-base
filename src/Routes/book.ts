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


