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

